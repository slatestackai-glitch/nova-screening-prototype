'use client';

/**
 * Hybrid Voice Engine for Nova
 * 1. Streams ElevenLabs ultra-realistic neural voice if API key is active.
 * 2. Seamlessly falls back to local high-fidelity Web SpeechSynthesis.
 */

let activeAudioElement: HTMLAudioElement | null = null;

export interface VoicePlayOptions {
  voiceId?: string;
  clientKey?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Plays assistant voice using ElevenLabs if available, or Browser SpeechSynthesis as fallback.
 */
export async function playAssistantVoice(
  text: string,
  options: VoicePlayOptions = {}
): Promise<boolean> {
  const { voiceId, clientKey, onStart, onEnd } = options;

  // Stop any currently playing audio or speech
  stopAllVoice();

  const cleanSpokenText = text
    .replace(/<<<NOVA_STATE[\s\S]*?NOVA_STATE>>>/g, '')
    .replace(/[#*_`~↳]/g, '')
    .trim();

  if (!cleanSpokenText) return false;

  try {
    // Attempt ElevenLabs TTS stream via server route
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanSpokenText,
        voiceId: voiceId || '21m00Tcm4TlvDq8ikWAM',
        clientKey: clientKey || (typeof window !== 'undefined' ? localStorage.getItem('nova_elevenlabs_key') : null)
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
        // Fallback to browser speech synthesis
        speakTextFallback(cleanSpokenText, onStart, onEnd);
      };

      await audio.play();
      return true;
    } else {
      // Fallback to browser speech synthesis
      return speakTextFallback(cleanSpokenText, onStart, onEnd);
    }
  } catch (err) {
    console.warn('[Voice Engine] Falling back to Web SpeechSynthesis', err);
    return speakTextFallback(cleanSpokenText, onStart, onEnd);
  }
}

/**
 * High-definition browser speech synthesis fallback
 */
function speakTextFallback(
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
  utterance.rate = 1.02;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(v => 
    (v.name.includes('Natural') || v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Aria') || v.name.includes('Neural')) && v.lang.startsWith('en')
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
