import { NextRequest, NextResponse } from 'next/server';

// Default ElevenLabs Recruiter Voice IDs:
// Rachel (Calm, professional recruiter): 21m00Tcm4TlvDq8ikWAM
// Sarah (Warm, expressive conversational): EXAVITQu4vr4xnSDxMaL
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voiceId, clientKey } = body as {
      text: string;
      voiceId?: string;
      clientKey?: string;
    };

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Missing "text" parameter.' },
        { status: 400 }
      );
    }

    const apiKey = clientKey || process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured.', fallback: true },
        { status: 200 }
      );
    }

    // Clean text of state delimiters or markdown tags before speech synthesis
    const cleanSpokenText = text
      .replace(/<<<NOVA_STATE[\s\S]*?NOVA_STATE>>>/g, '')
      .replace(/[#*_`~↳]/g, '')
      .trim();

    if (!cleanSpokenText) {
      return NextResponse.json(
        { error: 'Empty spoken text.', fallback: true },
        { status: 200 }
      );
    }

    const targetVoice = voiceId || DEFAULT_VOICE_ID;
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}?output_format=mp3_44100_128`;

    const elevenRes = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: cleanSpokenText,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!elevenRes.ok) {
      const errText = await elevenRes.text().catch(() => '');
      console.warn('[ElevenLabs API Error]', errText);
      return NextResponse.json(
        { error: `ElevenLabs error: ${elevenRes.status}`, fallback: true },
        { status: 200 }
      );
    }

    const audioBuffer = await elevenRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (err: any) {
    console.error('[TTS Route Error]', err);
    return NextResponse.json(
      { error: err?.message || 'Internal TTS server error', fallback: true },
      { status: 200 }
    );
  }
}
