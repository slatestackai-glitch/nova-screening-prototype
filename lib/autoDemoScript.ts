import { NovaState, RoleType, ChatMessage } from './types';

export interface ScriptedTourStep {
  id: number;
  title: string;
  roleType: RoleType;
  candidateInput?: string;
  novaResponse: string;
  probeChip: string | null;
  state: NovaState;
  narration: string;
  durationMs: number;
}

export const SCRIPTED_TOUR_STEPS: ScriptedTourStep[] = [
  // STEP 1: Opening Consent & AI Disclosure (Engineering)
  {
    id: 1,
    title: '1. AI Consent & Explicit Disclosure',
    roleType: 'ENGINEERING',
    novaResponse: "Hi, is this Alex? I'm Nova — I should say upfront, I'm an AI, not a person. I work with Meridian Labs and I'm calling about the Senior Backend Engineer role you applied for. This call gets recorded so the hiring team can review it. Is now an okay time, and are you okay to continue?",
    probeChip: null,
    state: {
      phase: 'consent',
      topic: 'AI Identity & Recording Consent',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: [],
      open_questions: [],
      flags: [],
      confidence: {
        tier: 'insufficient_evidence',
        rationale: 'Screen initiated. Explicit AI disclosure delivered in first two sentences. Awaiting affirmative consent.',
        coverage: 'Pending consent and competency exploration.'
      }
    },
    narration: 'Turn 1: Nova explicitly discloses AI identity in the first two sentences without softening language. Pauses for explicit candidate consent.',
    durationMs: 7000
  },

  // STEP 2: Candidate Consent -> Turn 2 Framing & Turn 3 Hand-off
  {
    id: 2,
    title: '2. Framing & Floor Hand-off',
    roleType: 'ENGINEERING',
    candidateInput: 'Yes, now is a good time and I am happy to continue.',
    novaResponse: "Great. This will take about ten minutes. We'll dive into your distributed systems architecture experience, how you handle database throughput, and wrap up with any questions you have for us. Let's start with your recent backend work — can you walk me through a service you engineered where throughput or latency was the primary bottleneck?",
    probeChip: null,
    state: {
      phase: 'screening',
      topic: 'High-Throughput Distributed Architecture',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: [],
      open_questions: [],
      flags: [],
      confidence: {
        tier: 'insufficient_evidence',
        rationale: 'Consent granted. Expectations set for 10-minute technical screen. Awaiting first substantive domain claim.',
        coverage: '0 / 5 core engineering competencies evidenced.'
      }
    },
    narration: 'Candidate affirms consent. Nova frames the 10-minute agenda and immediately hands over the floor with a domain-specific question.',
    durationMs: 7500
  },

  // STEP 3: Candidate Gives Vague "We" Answer -> Nova Probes Unowned Claim!
  {
    id: 3,
    title: '3. Vague Answer → Adaptive Probe',
    roleType: 'ENGINEERING',
    candidateInput: 'We improved the pipeline performance and made it much faster for the entire platform.',
    novaResponse: 'Which part of that data pipeline optimization was your specific architectural contribution versus the rest of the team?',
    probeChip: '↳ probed: unowned claim',
    state: {
      phase: 'screening',
      topic: 'Individual Architectural Contribution',
      probe_depth: 1,
      last_answer_class: 'claimed_but_unowned',
      evidence: [],
      open_questions: [],
      flags: [],
      confidence: {
        tier: 'insufficient_evidence',
        rationale: 'Candidate described a broad team outcome ("we") without specific personal decisions or metrics. Probing ownership.',
        coverage: 'Ownership unverified; systems design evidence pending.'
      }
    },
    narration: 'Candidate gives generic "we" claim. Nova classifies as claimed_but_unowned, isolates individual ownership, and renders the probe chip.',
    durationMs: 7500
  },

  // STEP 4: Candidate Gives Concrete Metrics & Tradeoffs -> Evidence Ledger Banks 3 Claims & Confidence Jumps to High!
  {
    id: 4,
    title: '4. Concrete Metrics → Confidence Shifts',
    roleType: 'ENGINEERING',
    candidateInput: 'I personally migrated our Postgres ingestion pipeline to Kafka with Go consumer groups partitioned by tenant ID, cutting p99 write latency from 420ms down to 65ms under 15k RPS load.',
    novaResponse: "That's clear on the Go consumer group partitioning and p99 latency reduction. When Kafka brokers experienced partition rebalancing under that 15k RPS load, what broke first in your consumer offset management?",
    probeChip: null,
    state: {
      phase: 'screening',
      topic: 'Fault Tolerance & Offset Management',
      probe_depth: 0,
      last_answer_class: 'concrete',
      evidence: [
        {
          competency: 'Distributed Systems & Data Architecture',
          claim: 'Migrated ingestion from Postgres to Kafka with Go consumer groups',
          specificity: 'concrete',
          verbatim: 'migrated our Postgres ingestion pipeline to Kafka with Go consumer groups'
        },
        {
          competency: 'Performance Optimization & Latency',
          claim: 'Reduced p99 write latency from 420ms to 65ms under 15k RPS load',
          specificity: 'concrete',
          verbatim: 'cutting p99 write latency from 420ms down to 65ms under 15k RPS load'
        },
        {
          competency: 'Technical Tradeoffs & Storage Partitioning',
          claim: 'Partitioned Kafka consumers by tenant ID to avoid lock contention',
          specificity: 'concrete',
          verbatim: 'partitioned by tenant ID'
        }
      ],
      open_questions: [],
      flags: [],
      confidence: {
        tier: 'high',
        rationale: 'Candidate provided 3 concrete engineering claims across 2 core competencies (Distributed Systems & Performance). Verified specific Kafka partitioning strategy and p99 reduction (420ms → 65ms at 15k RPS).',
        coverage: 'Evidenced: Distributed Systems, Performance, Storage Tradeoffs. Uncovered: On-call operations.'
      }
    },
    narration: 'Candidate delivers specific metrics. Evidence ledger logs 3 concrete claims; Confidence moves off insufficient_evidence to High!',
    durationMs: 8500
  },

  // STEP 5: Candidate Asks Salary -> Answered Directly From Fact Sheet!
  {
    id: 5,
    title: '5. Fact Sheet QA Transparency',
    roleType: 'ENGINEERING',
    candidateInput: 'What is the salary band and compensation structure for this role?',
    novaResponse: "For the Senior Backend Engineer role at Meridian Labs, our base compensation band is 38 to 52 LPA fixed base. To bridge back to your background, what's a recent distributed systems incident you triaged in production?",
    probeChip: null,
    state: {
      phase: 'candidate_qa',
      topic: 'Compensation Transparency & Background',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: [
        {
          competency: 'Distributed Systems & Data Architecture',
          claim: 'Migrated ingestion from Postgres to Kafka with Go consumer groups',
          specificity: 'concrete',
          verbatim: 'migrated our Postgres ingestion pipeline to Kafka with Go consumer groups'
        },
        {
          competency: 'Performance Optimization & Latency',
          claim: 'Reduced p99 write latency from 420ms to 65ms under 15k RPS load',
          specificity: 'concrete',
          verbatim: 'cutting p99 write latency from 420ms down to 65ms under 15k RPS load'
        },
        {
          competency: 'Technical Tradeoffs & Storage Partitioning',
          claim: 'Partitioned Kafka consumers by tenant ID to avoid lock contention',
          specificity: 'concrete',
          verbatim: 'partitioned by tenant ID'
        }
      ],
      open_questions: [],
      flags: [],
      confidence: {
        tier: 'high',
        rationale: 'Answered salary inquiry directly from fact sheet (38–52 LPA fixed base). Candidate demonstrated high intent.',
        coverage: 'Comp aligned. High confidence across technical competencies.'
      }
    },
    narration: 'Candidate asks about comp. Nova cites 38–52 LPA fixed base directly from fact sheet, then bridges smoothly back without deflecting.',
    durationMs: 7500
  },

  // STEP 6: Candidate Asks for Manager Name -> Deliberate Omission Hand-off to Priya!
  {
    id: 6,
    title: '6. Deliberate Omission Delegation',
    roleType: 'ENGINEERING',
    candidateInput: 'Who will be my direct engineering manager if I join?',
    novaResponse: "I don't have the engineering manager's details in front of me — Priya will have that for your next conversation, and I'm logging that question so it's the first thing she covers with you. What timeline works best on your end for the next round?",
    probeChip: null,
    state: {
      phase: 'candidate_qa',
      topic: 'Recruiter Delegation & Next Steps',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: [
        {
          competency: 'Distributed Systems & Data Architecture',
          claim: 'Migrated ingestion from Postgres to Kafka with Go consumer groups',
          specificity: 'concrete',
          verbatim: 'migrated our Postgres ingestion pipeline to Kafka with Go consumer groups'
        },
        {
          competency: 'Performance Optimization & Latency',
          claim: 'Reduced p99 write latency from 420ms to 65ms under 15k RPS load',
          specificity: 'concrete',
          verbatim: 'cutting p99 write latency from 420ms down to 65ms under 15k RPS load'
        },
        {
          competency: 'Technical Tradeoffs & Storage Partitioning',
          claim: 'Partitioned Kafka consumers by tenant ID to avoid lock contention',
          specificity: 'concrete',
          verbatim: 'partitioned by tenant ID'
        }
      ],
      open_questions: ['Hiring manager name and reporting structure (Priya to address in Round 1)'],
      flags: [],
      confidence: {
        tier: 'high',
        rationale: 'Logged unprovided manager inquiry for recruiter follow-up. High technical evidence banked.',
        coverage: 'High confidence. Priya action items recorded.'
      }
    },
    narration: 'Manager name is omitted from fact sheet. Nova triggers graceful recruiter delegation ("I don\'t have that, Priya will...") and logs it in Recruiter Actions.',
    durationMs: 8000
  },

  // STEP 7: Frontline Switch -> Warm, Human Register
  {
    id: 7,
    title: '7. Frontline Register Shift (Math Educator)',
    roleType: 'FRONTLINE',
    novaResponse: "Hey there, is this Priya? I'm Nova — just so you know right off the bat, I'm an AI, not a human recruiter. I'm helping the team at Meridian Learn with initial chats for the Math Tutor role. We record these so our team can listen back. Do you have a few minutes, and are you good to chat?",
    probeChip: null,
    state: {
      phase: 'consent',
      topic: 'Frontline AI Consent & Register',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: [],
      open_questions: [],
      flags: [],
      confidence: {
        tier: 'insufficient_evidence',
        rationale: 'Frontline screen initiated. Notice the warm, conversational register with contractions and lowered stakes.',
        coverage: 'Pending pedagogical competency exploration.'
      }
    },
    narration: 'Role swapped to Frontline Math Tutor. Notice the audibly different register: warm, conversational, lower stakes, human beat, zero jargon.',
    durationMs: 8000
  }
];
