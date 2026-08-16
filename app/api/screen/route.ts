import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt } from '@/lib/systemPrompt';
import { parseNovaState } from '@/lib/parseState';
import { generateSimulatedTurn } from '@/lib/simulationEngine';
import { RoleType } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
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

    // If explicit simulation mode is requested OR no API keys are present
    if (forceMode === 'simulation' || (!geminiApiKey && !anthropicApiKey)) {
      const simulated = generateSimulatedTurn(messages, currentRole);
      return NextResponse.json({
        role: 'assistant',
        content: simulated.content,
        mode: 'simulation',
        warning: !geminiApiKey && !anthropicApiKey
          ? 'API key not configured in environment (GEMINI_API_KEY). Running in enterprise simulation mode.'
          : undefined
      });
    }

    // 1. Google Gemini Provider
    if (geminiApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        // Use gemini-2.0-flash or gemini-1.5-flash
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

        return NextResponse.json({
          role: 'assistant',
          content: responseText,
          mode: 'gemini'
        });
      } catch (geminiError: any) {
        console.error('[Gemini API Error]', geminiError);
        // Graceful fallback to simulation with error note
        const simulated = generateSimulatedTurn(messages, currentRole);
        return NextResponse.json({
          role: 'assistant',
          content: simulated.content,
          mode: 'simulation_fallback',
          errorNote: `Gemini API call encountered an error: ${geminiError?.message || 'Check key and permissions'}. Switched to local simulation.`
        });
      }
    }

    // 2. Anthropic API Provider (if configured)
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

        return NextResponse.json({
          role: 'assistant',
          content: responseText,
          mode: 'anthropic'
        });
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
