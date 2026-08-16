'use client';

/**
 * Browser SpeechSynthesis Voice Engine for Nova
 */

export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip state blocks or markdown syntax from speech
  const cleanSpoken = text
    .replace(/<<<NOVA_STATE[\s\S]*?NOVA_STATE>>>/g, '')
    .replace(/[#*_`]/g, '')
    .trim();

  if (!cleanSpoken) return false;

  const utterance = new SpeechSynthesisUtterance(cleanSpoken);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  // Try to find a clean, natural English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen') || v.lang.startsWith('en'))
  );

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
