import { NovaState } from './types';

export const INITIAL_NOVA_STATE: NovaState = {
  phase: 'consent',
  topic: 'Initial Contact & AI Consent',
  probe_depth: 0,
  last_answer_class: 'n/a',
  evidence: [],
  open_questions: [],
  flags: [],
  confidence: {
    tier: 'insufficient_evidence',
    rationale: 'Screen initiated. No candidate claims or verified competencies collected yet.',
    coverage: 'Pending candidate response on initial competencies.'
  }
};

/**
 * Extracts and parses <<<NOVA_STATE ... NOVA_STATE>>> block using pure delimiter splitting.
 * Never uses regex for extraction as per spec.
 * Returns clean display text and the parsed NovaState (or fallback on error).
 */
export function parseNovaState(
  rawText: string,
  fallbackState: NovaState = INITIAL_NOVA_STATE
): { cleanText: string; state: NovaState; hasStateBlock: boolean } {
  const START_DELIMITER = '<<<NOVA_STATE';
  const END_DELIMITER = 'NOVA_STATE>>>';

  if (!rawText.includes(START_DELIMITER)) {
    return {
      cleanText: rawText.trim(),
      state: fallbackState,
      hasStateBlock: false
    };
  }

  // Split on delimiters without regex
  const partsBeforeStart = rawText.split(START_DELIMITER);
  const textBefore = partsBeforeStart[0] || '';
  const remainder = partsBeforeStart.slice(1).join(START_DELIMITER);

  let stateJsonStr = '';
  let textAfter = '';

  if (remainder.includes(END_DELIMITER)) {
    const partsAfterEnd = remainder.split(END_DELIMITER);
    stateJsonStr = partsAfterEnd[0].trim();
    textAfter = partsAfterEnd.slice(1).join(END_DELIMITER).trim();
  } else {
    // If END_DELIMITER is missing (e.g. truncated streaming), try to take the remainder
    stateJsonStr = remainder.trim();
  }

  const cleanText = `${textBefore.trim()} ${textAfter}`.trim();

  try {
    const parsed = JSON.parse(stateJsonStr);
    
    // Validate essential structure
    const validatedState: NovaState = {
      phase: parsed.phase || fallbackState.phase || 'screening',
      topic: parsed.topic || fallbackState.topic || 'Screening',
      probe_depth: typeof parsed.probe_depth === 'number' ? parsed.probe_depth : (fallbackState.probe_depth || 0),
      last_answer_class: parsed.last_answer_class || fallbackState.last_answer_class || 'n/a',
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence : fallbackState.evidence || [],
      open_questions: Array.isArray(parsed.open_questions) ? parsed.open_questions : fallbackState.open_questions || [],
      flags: Array.isArray(parsed.flags) ? parsed.flags : fallbackState.flags || [],
      confidence: {
        tier: parsed.confidence?.tier || fallbackState.confidence?.tier || 'insufficient_evidence',
        rationale: parsed.confidence?.rationale || fallbackState.confidence?.rationale || 'Insufficient evidence collected.',
        coverage: parsed.confidence?.coverage || fallbackState.confidence?.coverage || 'Pending coverage assessment.'
      }
    };

    return {
      cleanText,
      state: validatedState,
      hasStateBlock: true
    };
  } catch (error) {
    console.warn('[Nova Parse] Failed to parse NOVA_STATE JSON block. Retaining fallback state.', error);
    return {
      cleanText: cleanText || rawText.replace(START_DELIMITER, '').replace(END_DELIMITER, '').trim(),
      state: fallbackState,
      hasStateBlock: false
    };
  }
}

export function getProbeChipLabel(answerClass: string): string | null {
  switch (answerClass) {
    case 'claimed_but_unowned':
      return '↳ probed: unowned claim';
    case 'vague':
      return '↳ probed: vague answer';
    case 'opening':
      return '↳ probed: thread opening';
    default:
      return null;
  }
}
