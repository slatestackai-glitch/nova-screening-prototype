import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt } from '@/lib/systemPrompt';
import { generateSimulatedTurn } from '@/lib/simulationEngine';
import { checkRateLimit } from '@/lib/rateLimiter';
import { RoleType } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous-client';
    const rateLimit = checkRateLimit(clientIp, 15, 60000); // 15 req/min

    if (!rateLimit.success) {
      console.warn(`[Rate Limit Exceeded] IP: ${clientIp}. Falling back to simulation engine.`);
      
      const body = await req.json().catch(() => ({ messages: [], roleType: 'ENGINEERING' }));
      const currentRole: RoleType = body.roleType === 'FRONTLINE' ? 'FRONTLINE' : 'ENGINEERING';
      const simulated = generateSimulatedTurn(body.messages || [], currentRole);

      return NextResponse.json(
        {
          role: 'assistant',
          content: simulated.content,
          mode: 'rate_limited_simulation',
          warning: `Rate limit reached (${rateLimit.limit} req/min). Operating safely in enterprise simulation mode.`
        },
        {
          status: 200,
          headers: {
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetMs)
          }
        }
      );
    }

    const body = await req.json();
    const { messages, roleType, forceMode } = body as {
      messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
      roleType: RoleType;
      forceMode?: 'live' | 'simulation';
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: "messages" array is required.' },
        { status: 400 }
      );
    }

    const currentRole: RoleType = roleType === 'FRONTLINE' ? 'FRONTLINE' : 'ENGINEERING';
    const systemPrompt = buildSystemPrompt(currentRole);
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    // If explicit simulation mode is requested OR no API keys are present in env
    if (forceMode === 'simulation' || (!geminiApiKey && !anthropicApiKey)) {
      const simulated = generateSimulatedTurn(messages, currentRole);
      return NextResponse.json(
        {
          role: 'assistant',
          content: simulated.content,
          mode: 'simulation',
          warning: !geminiApiKey && !anthropicApiKey
            ? 'API key not configured in environment (GEMINI_API_KEY). Running in enterprise simulation mode.'
            : undefined
        },
        {
          headers: {
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining)
          }
        }
      );
    }

    // 2. Google Gemini Provider
    if (geminiApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash',
          systemInstruction: systemPrompt,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1500,
          }
        });

        // Format history for Gemini SDK
        const contents = messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const result = await model.generateContent({ contents });
        const responseText = result.response.text();

        return NextResponse.json(
          {
            role: 'assistant',
            content: responseText,
            mode: 'gemini'
          },
          {
            headers: {
              'X-RateLimit-Limit': String(rateLimit.limit),
              'X-RateLimit-Remaining': String(rateLimit.remaining)
            }
          }
        );
      } catch (geminiError: any) {
        console.error('[Gemini API Error]', geminiError);
        const simulated = generateSimulatedTurn(messages, currentRole);
        return NextResponse.json({
          role: 'assistant',
          content: simulated.content,
          mode: 'simulation_fallback',
          errorNote: `Gemini API error: ${geminiError?.message || 'Check key'}. Safe simulation fallback activated.`
        });
      }
    }

    // 3. Anthropic API Provider (if configured)
    if (anthropicApiKey) {
      try {
        const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicApiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1500,
            system: systemPrompt,
            messages: messages.map(m => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content
            }))
          })
        });

        if (!anthropicRes.ok) {
          const errData = await anthropicRes.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Anthropic HTTP ${anthropicRes.status}`);
        }

        const data = await anthropicRes.json();
        const responseText = data.content?.[0]?.text || '';

        return NextResponse.json(
          {
            role: 'assistant',
            content: responseText,
            mode: 'anthropic'
          },
          {
            headers: {
              'X-RateLimit-Limit': String(rateLimit.limit),
              'X-RateLimit-Remaining': String(rateLimit.remaining)
            }
          }
        );
      } catch (anthropicError: any) {
        console.error('[Anthropic API Error]', anthropicError);
        const simulated = generateSimulatedTurn(messages, currentRole);
        return NextResponse.json({
          role: 'assistant',
          content: simulated.content,
          mode: 'simulation_fallback',
          errorNote: `Anthropic API error: ${anthropicError?.message}. Switched to local simulation.`
        });
      }
    }

    return NextResponse.json(
      { error: 'API key not configured. Please set GEMINI_API_KEY in your environment.' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('[Route Handler Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error processing screening turn.' },
      { status: 500 }
    );
  }
}
