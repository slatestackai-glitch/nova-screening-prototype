'use client';

/**
 * High-End Dual-Voice Engine for Nova
 * Supports two-way realistic phone conversations:
 * 1. Recruiter Voice (Nova)
 * 2. Candidate Voice (Alex / Priya)
 * With ElevenLabs streaming and Web Speech fallback
 */

let activeAudioElement: HTMLAudioElement | null = null;

export interface VoicePlayOptions {
  voiceId?: string;
  clientKey?: string;
  isCandidate?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Plays Recruiter (Nova) voice
 */
export async function playAssistantVoice(
  text: string,
  options: VoicePlayOptions = {}
): Promise<boolean> {
  return playVoiceAudio(text, {
    ...options,
    isCandidate: false,
    voiceId: options.voiceId || (typeof window !== 'undefined' ? localStorage.getItem('nova_voice_id') || '21m00Tcm4TlvDq8ikWAM' : '21m00Tcm4TlvDq8ikWAM')
  });
}

/**
 * Plays Candidate (Alex/Priya) voice with distinct acoustic profile
 */
export async function playCandidateVoice(
  text: string,
  options: VoicePlayOptions = {}
): Promise<boolean> {
  return playVoiceAudio(text, {
    ...options,
    isCandidate: true,
    voiceId: 'ErXwobaYiN019PkySvjV' // ElevenLabs Antoni / Male Candidate voice
  });
}

async function playVoiceAudio(
  text: string,
  options: VoicePlayOptions = {}
): Promise<boolean> {
  const { voiceId, clientKey, isCandidate, onStart, onEnd } = options;

  stopAllVoice();

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
          voiceId: voiceId || (isCandidate ? 'ErXwobaYiN019PkySvjV' : '21m00Tcm4TlvDq8ikWAM'),
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
          speakNaturalVoice(cleanSpokenText, isCandidate, onStart, onEnd);
        };

        await audio.play();
        return true;
      }
    }
    
    return speakNaturalVoice(cleanSpokenText, isCandidate, onStart, onEnd);
  } catch (err) {
    return speakNaturalVoice(cleanSpokenText, isCandidate, onStart, onEnd);
  }
}

/**
 * Natural-cadence browser speech synthesis with distinct Candidate vs Recruiter timbres
 */
function speakNaturalVoice(
  text: string,
  isCandidate?: boolean,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Pace and pitch difference for Candidate vs Recruiter
  if (isCandidate) {
    utterance.rate = 1.15;
    utterance.pitch = 0.95; // Slightly deeper natural pitch for candidate
  } else {
    utterance.rate = 1.10;
    utterance.pitch = 1.05; // Clear, bright recruiter pitch
  }

  const voices = window.speechSynthesis.getVoices();
  
  if (isCandidate) {
    // Select male / distinct candidate voice
    const candidateVoice = voices.find(v => 
      (v.name.includes('Guy') || 
       v.name.includes('David') || 
       v.name.includes('George') || 
       v.name.includes('Male')) && v.lang.startsWith('en')
    ) || voices[0];
    if (candidateVoice) utterance.voice = candidateVoice;
  } else {
    // Select natural female / recruiter voice
    const recruiterVoice = voices.find(v => 
      (v.name.includes('Natural') || 
       v.name.includes('Jenny') || 
       v.name.includes('Aria') || 
       v.name.includes('Google US English') || 
       v.name.includes('Samantha') || 
       v.name.includes('Neural')) && v.lang.startsWith('en')
    ) || voices[1] || voices[0];
    if (recruiterVoice) utterance.voice = recruiterVoice;
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
