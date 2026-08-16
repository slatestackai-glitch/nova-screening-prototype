import { RoleType, NovaState, ChatMessage } from './types';
import { getFactSheet } from './factSheets';

export interface SimulatedTurnResponse {
  content: string;
  state: NovaState;
}

export function generateSimulatedTurn(
  messages: Array<{ role: string; content: string }>,
  roleType: RoleType,
  lastState?: NovaState
): SimulatedTurnResponse {
  const factSheet = getFactSheet(roleType);
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMsg = userMessages[userMessages.length - 1]?.content?.toLowerCase() || '';

  // 1. Initial Opening Turn
  if (messages.length <= 1) {
    if (roleType === 'ENGINEERING') {
      const state: NovaState = {
        phase: 'consent',
        topic: 'AI Identity & Call Recording Consent',
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

      const responseText = `Hi, is this Alex? I'm Nova — I should say upfront, I'm an AI, not a person. I work with ${factSheet.company} and I'm calling about the ${factSheet.roleTitle} role you applied for. This call gets recorded so the hiring team can review it. Is now an okay time, and are you okay to continue?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
      return { content: responseText, state };
    } else {
      // Frontline opening (warm, lower stakes, conversational)
      const state: NovaState = {
        phase: 'consent',
        topic: 'AI Identity & Consent (Frontline)',
        probe_depth: 0,
        last_answer_class: 'n/a',
        evidence: [],
        open_questions: [],
        flags: [],
        confidence: {
          tier: 'insufficient_evidence',
          rationale: 'Initial call setup in progress. No evaluation data collected.',
          coverage: 'Pending initial responses.'
        }
      };

      const responseText = `Hey there, is this Priya? I'm Nova — just so you know right off the bat, I'm an AI, not a human recruiter. I'm helping the team at ${factSheet.company} with initial chats for the ${factSheet.roleTitle} role. We record these so our team can listen back. Do you have a few minutes, and are you good to chat?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
      return { content: responseText, state };
    }
  }

  // 2. Handling Candidate Questions (Fact Sheet lookups vs Omissions)
  if (
    lastUserMsg.includes('salary') ||
    lastUserMsg.includes('comp') ||
    lastUserMsg.includes('pay') ||
    lastUserMsg.includes('package') ||
    lastUserMsg.includes('rate') ||
    lastUserMsg.includes('lpa')
  ) {
    if (roleType === 'ENGINEERING') {
      const state: NovaState = {
        ...(lastState || {
          phase: 'screening',
          topic: 'Compensation Transparency & Background',
          probe_depth: 0,
          last_answer_class: 'n/a',
          evidence: [],
          open_questions: [],
          flags: [],
          confidence: {
            tier: 'insufficient_evidence',
            rationale: 'Answered compensation question from fact sheet. Awaiting technical deep dive.',
            coverage: 'Comp expectations aligned.'
          }
        }),
        phase: 'candidate_qa'
      };

      const responseText = `For the ${factSheet.roleTitle} role at ${factSheet.company}, the base compensation band is 38 to 52 LPA fixed. To bridge back to your background, what's a recent distributed systems challenge you tackled in Go or Postgres?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
      return { content: responseText, state };
    } else {
      const state: NovaState = {
        ...(lastState || {
          phase: 'screening',
          topic: 'Hourly Rate Inquiry',
          probe_depth: 0,
          last_answer_class: 'n/a',
          evidence: [],
          open_questions: [],
          flags: [],
          confidence: {
            tier: 'insufficient_evidence',
            rationale: 'Shared hourly rate transparently from fact sheet.',
            coverage: 'Pay rate confirmed.'
          }
        }),
        phase: 'candidate_qa'
      };

      const responseText = `At ${factSheet.company}, our tutor compensation is ₹450 to ₹600 per teaching hour, usually running 15 to 25 hours a week. How does that hourly range line up with your availability?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
      return { content: responseText, state };
    }
  }

  if (
    lastUserMsg.includes('manager') ||
    lastUserMsg.includes('who is the manager') ||
    lastUserMsg.includes('who would i report to') ||
    lastUserMsg.includes('equity') ||
    lastUserMsg.includes('esop') ||
    lastUserMsg.includes('stock') ||
    lastUserMsg.includes('schedule') ||
    lastUserMsg.includes('batch size')
  ) {
    // Deliberate Omission Fallback Path!
    const openQuestion = lastUserMsg.includes('manager')
      ? 'Hiring manager name and reporting structure'
      : lastUserMsg.includes('equity')
      ? 'Equity / ESOP grant details'
      : 'Class batch scheduling and payment cycle dates';

    const prevOpen = lastState?.open_questions || [];
    const openQuestions = prevOpen.includes(openQuestion) ? prevOpen : [...prevOpen, openQuestion];

    const state: NovaState = {
      ...(lastState || {
        phase: 'screening',
        topic: 'Recruiter Delegation',
        probe_depth: 0,
        last_answer_class: 'n/a',
        evidence: [],
        flags: [],
        confidence: {
          tier: 'insufficient_evidence',
          rationale: 'Delegated unknown detail to human recruiter.',
          coverage: 'Handoff logged.'
        }
      }),
      phase: 'candidate_qa',
      open_questions: openQuestions
    };

    const responseText = `I don't have that detail in front of me — ${factSheet.recruiter} will have it for your next conversation, and I'm logging that question so it's the first thing they cover with you. Coming back to your work, how have you historically approached production incident triage?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
    return { content: responseText, state };
  }

  // 3. Opening Flow: Turn 2 (Expectations) & Turn 3 (Floor Hand-off)
  if (userMessages.length === 1 && (lastUserMsg.includes('yes') || lastUserMsg.includes('sure') || lastUserMsg.includes('ok') || lastUserMsg.includes('fine') || lastUserMsg.includes('go ahead'))) {
    const state: NovaState = {
      phase: 'expectations',
      topic: 'Call Structure & Timeline',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: [],
      open_questions: [],
      flags: [],
      confidence: {
        tier: 'insufficient_evidence',
        rationale: 'Consent granted. Setting expectations for a 10-minute screen.',
        coverage: 'Introductory framing complete.'
      }
    };

    const responseText = roleType === 'ENGINEERING'
      ? `Great. This will take about ten minutes. We'll dive into your systems architecture experience, how you handle database throughput, and wrap up with any questions you have for us. Are you ready to begin?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`
      : `Awesome. We'll keep it to about ten minutes — just want to hear how you connect with middle school students, how you handle tricky math concepts, and any questions you've got for us. Ready to jump in?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
    return { content: responseText, state };
  }

  if (userMessages.length === 2 && (lastUserMsg.includes('ready') || lastUserMsg.includes('yes') || lastUserMsg.includes('start') || lastUserMsg.includes('sure') || lastUserMsg.includes('let\'s do it'))) {
    const state: NovaState = {
      phase: 'screening',
      topic: roleType === 'ENGINEERING' ? 'Backend Architecture & High Throughput Systems' : 'Student Engagement & Math Pedagogy',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: [],
      open_questions: lastState?.open_questions || [],
      flags: lastState?.flags || [],
      confidence: {
        tier: 'insufficient_evidence',
        rationale: 'Screening phase commenced. Awaiting first substantive domain claim.',
        coverage: '0 / 4 competencies evidenced.'
      }
    };

    const responseText = roleType === 'ENGINEERING'
      ? `Let's start with your recent backend work. Can you walk me through a distributed service or data pipeline you engineered where system latency or throughput was the primary constraint?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`
      : `Let's start with teaching. Can you tell me about a student in Grade 7 or 8 who was completely stuck on algebra or fractions, and how you helped them break through?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
    return { content: responseText, state };
  }

  // 4. Substantive Answer Evaluation: Vague / Claimed-but-Unowned vs Concrete
  const isVagueOrTeam =
    lastUserMsg.includes('we improved') ||
    lastUserMsg.includes('we worked') ||
    lastUserMsg.includes('we built') ||
    lastUserMsg.includes('team player') ||
    lastUserMsg.includes('it went well') ||
    lastUserMsg.includes('good performance') ||
    lastUserMsg.length < 50 && !lastUserMsg.includes('migrated') && !lastUserMsg.includes('kafka');

  if (isVagueOrTeam) {
    // TRIGGER PROBE: Claimed-but-unowned / Vague
    const isTeamClaim = lastUserMsg.includes('we ');
    const answerClass = isTeamClaim ? 'claimed_but_unowned' : 'vague';

    const state: NovaState = {
      phase: 'screening',
      topic: roleType === 'ENGINEERING' ? 'Individual Architectural Contribution' : 'Specific Teaching Action',
      probe_depth: (lastState?.probe_depth || 0) + 1,
      last_answer_class: answerClass,
      evidence: lastState?.evidence || [],
      open_questions: lastState?.open_questions || [],
      flags: lastState?.flags || [],
      confidence: {
        tier: 'insufficient_evidence',
        rationale: 'Candidate described a broad team outcome ("we") without specific personal engineering decisions or metrics. Probing ownership.',
        coverage: 'Ownership unverified; systems design evidence pending.'
      }
    };

    const responseText = roleType === 'ENGINEERING'
      ? (isTeamClaim
          ? `Which part of that pipeline optimization was your specific architectural contribution versus the rest of the team?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`
          : `What specific bottleneck did you diagnose in that system, and what tradeoffs drove your fix?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`)
      : `What did you personally say or do in that session to get the student engaged?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;

    return { content: responseText, state };
  }

  // 5. Concrete Answer Provided: Bank Evidence & Shift Confidence!
  if (roleType === 'ENGINEERING') {
    const existingEvidence = lastState?.evidence || [];
    const newEvidence = [
      ...existingEvidence,
      {
        competency: 'Distributed Systems & Data Architecture',
        claim: 'Engineered high-throughput Go ingestion pipeline with Kafka consumer partitioning',
        specificity: 'concrete' as const,
        verbatim: lastUserMsg.slice(0, 110) + '...'
      },
      {
        competency: 'Performance Optimization & Latency',
        claim: 'Reduced p99 database write latency from 420ms down to 65ms',
        specificity: 'concrete' as const,
        verbatim: 'cut p99 latency from 420ms to 65ms under 15k RPS load'
      },
      {
        competency: 'Technical Tradeoffs & Storage',
        claim: 'Chose Postgres tenant partitioning over MongoDB for ACID transaction guarantees',
        specificity: 'concrete' as const,
        verbatim: 'partitioned by tenant ID to avoid cross-shard locking'
      }
    ];

    const state: NovaState = {
      phase: 'screening',
      topic: 'Fault Tolerance & Disaster Recovery',
      probe_depth: 0,
      last_answer_class: 'concrete',
      evidence: newEvidence,
      open_questions: lastState?.open_questions || [],
      flags: lastState?.flags || [],
      confidence: {
        tier: 'high',
        rationale: 'Candidate provided 3 concrete engineering claims across 2 competencies (Distributed Systems & Performance Optimization). Verified specific Kafka partition strategy and p99 reduction (420ms → 65ms).',
        coverage: 'Evidenced: Distributed Systems, Performance, Storage Tradeoffs. Uncovered: On-call operations.'
      }
    };

    const responseText = `That's clear on the Go consumer group partitioning. When Kafka brokers experienced partition rebalancing under that 15k RPS load, what broke first in your consumer offset management?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
    return { content: responseText, state };
  } else {
    // Frontline Concrete response
    const existingEvidence = lastState?.evidence || [];
    const newEvidence = [
      ...existingEvidence,
      {
        competency: 'Math Pedagogy & Simplification',
        claim: 'Used visual fraction bar analogies to teach Grade 7 mixed fractions',
        specificity: 'concrete' as const,
        verbatim: lastUserMsg.slice(0, 100) + '...'
      },
      {
        competency: 'Student Empathy & Patience',
        claim: 'Spent 15 minutes rebuilding confidence before retesting quiz problems',
        specificity: 'concrete' as const,
        verbatim: 'paused the timer and let the student explain their thinking step by step'
      }
    ];

    const state: NovaState = {
      phase: 'screening',
      topic: 'Parent Communication & Retention',
      probe_depth: 0,
      last_answer_class: 'concrete',
      evidence: newEvidence,
      open_questions: lastState?.open_questions || [],
      flags: lastState?.flags || [],
      confidence: {
        tier: 'high',
        rationale: 'Concrete pedagogy techniques cited with direct student dialogue examples. Demonstrated patience and visual teaching methods.',
        coverage: 'Evidenced: Pedagogy, Empathy. Uncovered: Tech troubleshooting.'
      }
    };

    const responseText = `That visual bar analogy makes total sense. How did the student's parents react when you shared that progress update?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
    return { content: responseText, state };
  }
}
