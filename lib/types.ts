export type RoleType = 'ENGINEERING' | 'FRONTLINE';

export type AnswerClass = 'concrete' | 'vague' | 'claimed_but_unowned' | 'opening' | 'n/a';

export type Specificity = 'concrete' | 'partial' | 'thin';

export type ConfidenceTier = 'high' | 'medium' | 'low' | 'insufficient_evidence';

export type ScreenPhase = 'consent' | 'expectations' | 'screening' | 'candidate_qa' | 'closing' | 'ended';

export interface EvidenceItem {
  competency: string;
  claim: string;
  specificity: Specificity;
  verbatim: string;
}

export interface ConfidenceData {
  tier: ConfidenceTier;
  rationale: string;
  coverage: string;
}

export interface NovaState {
  phase: ScreenPhase;
  topic: string;
  probe_depth: number;
  last_answer_class: AnswerClass;
  evidence: EvidenceItem[];
  open_questions: string[];
  flags: string[];
  confidence: ConfidenceData;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  cleanContent?: string;
  state?: NovaState;
  probeChip?: string | null;
  timestamp: string;
}

export interface FactSheetData {
  roleType: RoleType;
  roleTitle: string;
  company: string;
  recruiter: string;
  sheetText: string;
  deliberateOmissions: string[];
}
