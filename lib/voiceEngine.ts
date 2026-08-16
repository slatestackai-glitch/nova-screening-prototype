'use client';

/**
 * Enhanced Browser SpeechSynthesis Voice Engine for Nova
 * Prioritizes high-end Natural / Neural English voices
 */

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

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

  // Strip state blocks and markdown
  const cleanSpoken = text
    .replace(/<<<NOVA_STATE[\s\S]*?NOVA_STATE>>>/g, '')
    .replace(/[#*_`~↳]/g, '')
    .trim();

  if (!cleanSpoken) return false;

  const utterance = new SpeechSynthesisUtterance(cleanSpoken);
  utterance.rate = 1.02;
  utterance.pitch = 1.0;

  // Prioritize highest quality English neural/natural voices
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

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
