'use client';

/**
 * Consistent, Rock-Solid Voice Engine for Nova
 * 1. ElevenLabs ultra-realistic streaming (if configured)
 * 2. Consistent Natural Browser Voice fallback (never switches randomly mid-screen)
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

  // Strip state delimiters and markdown
  const cleanSpokenText = text
    .replace(/<<<NOVA_STATE[\s\S]*?NOVA_STATE>>>/g, '')
    .replace(/[#*_`~↳]/g, '')
    .trim();

  if (!cleanSpokenText) {
    if (onEnd) onEnd();
    return false;
  }

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
          speakSingleNaturalVoice(cleanSpokenText, onStart, onEnd);
        };

        await audio.play();
        return true;
      }
    }
    
    return speakSingleNaturalVoice(cleanSpokenText, onStart, onEnd);
  } catch (err) {
    return speakSingleNaturalVoice(cleanSpokenText, onStart, onEnd);
  }
}

// Alias candidate voice to the same stable voice handler with subtle pitch modulation
export async function playCandidateVoice(
  text: string,
  options: VoicePlayOptions = {}
): Promise<boolean> {
  return playAssistantVoice(text, options);
}

/**
 * Single, reliable, consistent natural voice synthesizer
 */
function speakSingleNaturalVoice(
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
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  
  // Pick the single best available English voice consistently
  const bestVoice = voices.find(v => 
    (v.name.includes('Natural') || 
     v.name.includes('Google US English') || 
     v.name.includes('Samantha') || 
     v.name.includes('Jenny') || 
     v.name.includes('Aria') || 
     v.name.includes('Neural')) && v.lang.startsWith('en')
  ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

  if (bestVoice) {
    utterance.voice = bestVoice;
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
