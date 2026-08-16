'use client';

/**
 * High-Quality Voice Engine for Nova
 * 1. ElevenLabs ultra-realistic neural voice streaming (if key configured).
 * 2. Natural-sounding, fluid, lively Browser Neural Voice fallback.
 */

let activeAudioElement: HTMLAudioElement | null = null;

export interface VoicePlayOptions {
  voiceId?: string;
  clientKey?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export async function playAssistantVoice(
  text: string,
  options: VoicePlayOptions = {}
): Promise<boolean> {
  const { voiceId, clientKey, onStart, onEnd } = options;

  stopAllVoice();

  const cleanSpokenText = text
    .replace(/<<<NOVA_STATE[\s\S]*?NOVA_STATE>>>/g, '')
    .replace(/[#*_`~↳]/g, '')
    .trim();

  if (!cleanSpokenText) return false;

  try {
    const storedElevenKey = typeof window !== 'undefined' ? localStorage.getItem('nova_elevenlabs_key') : null;
    const keyToUse = clientKey || storedElevenKey;

    if (keyToUse) {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanSpokenText,
          voiceId: voiceId || (typeof window !== 'undefined' ? localStorage.getItem('nova_voice_id') || '21m00Tcm4TlvDq8ikWAM' : '21m00Tcm4TlvDq8ikWAM'),
          clientKey: keyToUse
        })
      });

      const contentType = response.headers.get('content-type') || '';

      if (response.ok && contentType.includes('audio/mpeg')) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        activeAudioElement = audio;

        audio.onplay = () => {
          if (onStart) onStart();
        };

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          activeAudioElement = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          activeAudioElement = null;
          speakNaturalVoice(cleanSpokenText, onStart, onEnd);
        };

        await audio.play();
        return true;
      }
    }
    
    // Use natural neural voice fallback
    return speakNaturalVoice(cleanSpokenText, onStart, onEnd);
  } catch (err) {
    return speakNaturalVoice(cleanSpokenText, onStart, onEnd);
  }
}

/**
 * Enhanced natural-cadence speech synthesis
 */
function speakNaturalVoice(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Fast, conversational human pace (1.12x rate prevents slow robotic drag)
  utterance.rate = 1.12;
  utterance.pitch = 1.02;

  const voices = window.speechSynthesis.getVoices();
  
  // Prioritize Microsoft Natural, Google US English, Jenny, Aria, Samantha
  const naturalVoice = voices.find(v => 
    (v.name.includes('Natural') || 
     v.name.includes('Jenny') || 
     v.name.includes('Aria') || 
     v.name.includes('Google US English') || 
     v.name.includes('Samantha') || 
     v.name.includes('Neural') ||
     v.name.includes('Guy')) && v.lang.startsWith('en')
  ) || voices.find(v => v.lang.startsWith('en'));

  if (naturalVoice) {
    utterance.voice = naturalVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopAllVoice(): void {
  if (activeAudioElement) {
    activeAudioElement.pause();
    activeAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
