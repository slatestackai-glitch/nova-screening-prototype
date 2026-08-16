import { RoleType, NovaState } from './types';
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
  const lastUserMsg = userMessages[userMessages.length - 1]?.content?.toLowerCase().trim() || '';
  const turnCount = userMessages.length;

  // 1. Initial Opening Turn
  if (messages.length <= 1) {
    if (roleType === 'ENGINEERING') {
      const state: NovaState = {
        phase: 'consent',
        topic: 'Introduction & Consent',
        probe_depth: 0,
        last_answer_class: 'n/a',
        evidence: [],
        open_questions: [],
        flags: [],
        confidence: {
          tier: 'insufficient_evidence',
          rationale: 'Call connected. Explicit AI identity disclosed. Awaiting candidate consent.',
          coverage: 'Interview starting.'
        }
      };

      const responseText = `Hi, is this Alex? I'm Nova — I should mention upfront, I'm an AI, not a human recruiter. I work with ${factSheet.company} and I'm calling about the ${factSheet.roleTitle} role. This call is recorded so the hiring team can review it. Is now a good time, and are you okay to chat?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
      return { content: responseText, state };
    } else {
      const state: NovaState = {
        phase: 'consent',
        topic: 'Introduction & Consent',
        probe_depth: 0,
        last_answer_class: 'n/a',
        evidence: [],
        open_questions: [],
        flags: [],
        confidence: {
          tier: 'insufficient_evidence',
          rationale: 'Initial call setup in progress.',
          coverage: 'Interview starting.'
        }
      };

      const responseText = `Hey there, is this Priya? I'm Nova — just so you know upfront, I'm an AI, not a person. I'm helping the team at ${factSheet.company} with chats for the ${factSheet.roleTitle} role. We record these so our team can review. Do you have a few minutes to chat?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
      return { content: responseText, state };
    }
  }

  // 2. Candidate is Confused / Doesn't Understand / Says "No Clue"
  if (
    lastUserMsg.includes("don't understand") ||
    lastUserMsg.includes("dont understand") ||
    lastUserMsg.includes("no clue") ||
    lastUserMsg.includes("confused") ||
    lastUserMsg.includes("what do you mean") ||
    lastUserMsg.includes("repeat") ||
    lastUserMsg.includes("repeating")
  ) {
    const state: NovaState = {
      phase: 'screening',
      topic: 'Core Technical Background',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: lastState?.evidence || [],
      open_questions: lastState?.open_questions || [],
      flags: lastState?.flags || [],
      confidence: {
        tier: 'insufficient_evidence',
        rationale: 'Pivoting question to candidate comfort area after clarification request.',
        coverage: 'Exploring core technical skills.'
      }
    };

    const responseText = roleType === 'ENGINEERING'
      ? `No problem at all — let's zoom out. Can you tell me what programming languages and backend frameworks you feel most comfortable building in day-to-day?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`
      : `No worries at all! Let's keep it simple. What grade levels of students do you enjoy teaching math to the most?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;

    return { content: responseText, state };
  }

  // 3. Compensation Inquiries
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
        phase: 'candidate_qa',
        topic: 'Compensation & Expectations',
        probe_depth: 0,
        last_answer_class: 'n/a',
        evidence: lastState?.evidence || [],
        open_questions: lastState?.open_questions || [],
        flags: lastState?.flags || [],
        confidence: {
          tier: lastState?.confidence?.tier || 'insufficient_evidence',
          rationale: 'Answered salary inquiry directly from fact sheet (38–52 LPA fixed base).',
          coverage: 'Comp expectations aligned.'
        }
      };

      const responseText = `For the ${factSheet.roleTitle} role at ${factSheet.company}, our base compensation band is 38 to 52 LPA fixed. How does that range line up with your expectations?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
      return { content: responseText, state };
    } else {
      const state: NovaState = {
        phase: 'candidate_qa',
        topic: 'Hourly Rate & Hours',
        probe_depth: 0,
        last_answer_class: 'n/a',
        evidence: lastState?.evidence || [],
        open_questions: lastState?.open_questions || [],
        flags: lastState?.flags || [],
        confidence: {
          tier: lastState?.confidence?.tier || 'insufficient_evidence',
          rationale: 'Shared hourly pay rate (₹450–600/hr).',
          coverage: 'Pay aligned.'
        }
      };

      const responseText = `At ${factSheet.company}, our tutor pay is ₹450 to ₹600 per teaching hour, usually 15 to 25 hours per week. Does that hourly structure work with your weekly schedule?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
      return { content: responseText, state };
    }
  }

  // 4. Unknown details (Manager, Equity) -> Delegate to Priya/Arjun
  if (
    lastUserMsg.includes('manager') ||
    lastUserMsg.includes('report to') ||
    lastUserMsg.includes('equity') ||
    lastUserMsg.includes('stock') ||
    lastUserMsg.includes('schedule')
  ) {
    const questionText = lastUserMsg.includes('manager')
      ? 'Hiring manager reporting structure'
      : lastUserMsg.includes('equity')
      ? 'Equity and stock grant details'
      : 'Weekly schedule preferences';

    const prevOpen = lastState?.open_questions || [];
    const openQuestions = prevOpen.includes(questionText) ? prevOpen : [...prevOpen, questionText];

    const state: NovaState = {
      phase: 'candidate_qa',
      topic: 'Recruiter Follow-up',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: lastState?.evidence || [],
      open_questions: openQuestions,
      flags: lastState?.flags || [],
      confidence: {
        tier: lastState?.confidence?.tier || 'insufficient_evidence',
        rationale: `Logged candidate inquiry for ${factSheet.recruiter}'s follow-up.`,
        coverage: 'Delegation logged.'
      }
    };

    const responseText = `I don't have that specific detail in front of me, but I've noted that down for ${factSheet.recruiter} to cover directly with you in the next call. To wrap up our chat, what is your current notice period?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
    return { content: responseText, state };
  }

  // 5. Initial Agreement / Consent
  if (turnCount === 1) {
    const state: NovaState = {
      phase: 'expectations',
      topic: 'Call Overview',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: [],
      open_questions: [],
      flags: [],
      confidence: {
        tier: 'insufficient_evidence',
        rationale: 'Candidate agreed to proceed. Framing agenda.',
        coverage: 'Introductory framing.'
      }
    };

    const responseText = roleType === 'ENGINEERING'
      ? `Great! This will take about ten minutes. We'll chat through your backend engineering experience, system performance tradeoffs, and any questions you have for us. To kick off, can you tell me about a backend service you built recently that you're especially proud of?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`
      : `Awesome! We'll keep it to about ten minutes. We'd love to hear how you teach math concepts, connect with students, and answer any questions you have. To start, what got you into teaching math?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
    return { content: responseText, state };
  }

  // 6. Substantive Answers: Concrete Technical Metrics vs Vague
  const isConcrete = 
    lastUserMsg.includes('kafka') || 
    lastUserMsg.includes('postgres') || 
    lastUserMsg.includes('latency') || 
    lastUserMsg.includes('redis') || 
    lastUserMsg.includes('microservice') ||
    lastUserMsg.includes('database') ||
    lastUserMsg.includes('students') ||
    lastUserMsg.includes('fraction') ||
    lastUserMsg.includes('algebra') ||
    lastUserMsg.length > 70;

  if (isConcrete) {
    if (roleType === 'ENGINEERING') {
      const existingEvidence = lastState?.evidence || [];
      const newEvidence = [
        ...existingEvidence,
        {
          competency: 'System Architecture & Data Pipelines',
          claim: 'Engineered backend services with high-throughput data processing',
          specificity: 'concrete' as const,
          verbatim: lastUserMsg.slice(0, 100) + '...'
        },
        {
          competency: 'Performance & Optimization',
          claim: 'Demonstrated deep understanding of latency bottlenecks and caching',
          specificity: 'concrete' as const,
          verbatim: 'Optimized p99 response times and throughput'
        }
      ];

      const state: NovaState = {
        phase: 'screening',
        topic: 'Architecture & Tradeoffs',
        probe_depth: 0,
        last_answer_class: 'concrete',
        evidence: newEvidence,
        open_questions: lastState?.open_questions || [],
        flags: lastState?.flags || [],
        confidence: {
          tier: 'high',
          rationale: 'Candidate provided specific technical claims across architecture and performance optimization.',
          coverage: 'Core technical competencies verified.'
        }
      };

      const responseText = `That's really clear. When designing that system, what was the biggest tradeoff you had to make between latency, data consistency, and complexity?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
      return { content: responseText, state };
    } else {
      const existingEvidence = lastState?.evidence || [];
      const newEvidence = [
        ...existingEvidence,
        {
          competency: 'Math Pedagogy & Teaching Style',
          claim: 'Uses visual breakdowns and relatable analogies for middle school students',
          specificity: 'concrete' as const,
          verbatim: lastUserMsg.slice(0, 100) + '...'
        }
      ];

      const state: NovaState = {
        phase: 'screening',
        topic: 'Student Engagement',
        probe_depth: 0,
        last_answer_class: 'concrete',
        evidence: newEvidence,
        open_questions: lastState?.open_questions || [],
        flags: lastState?.flags || [],
        confidence: {
          tier: 'high',
          rationale: 'Candidate articulated practical teaching analogies and student engagement techniques.',
          coverage: 'Teaching methodology verified.'
        }
      };

      const responseText = `That makes a lot of sense. How do you usually handle it when a student seems disengaged or frustrated during an online class?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;
      return { content: responseText, state };
    }
  }

  // 7. Vague / Generic Answer -> Smart Single Probe
  const isTeam = lastUserMsg.includes('we ') || lastUserMsg.includes('team');
  const state: NovaState = {
    phase: 'screening',
    topic: 'Individual Contribution',
    probe_depth: (lastState?.probe_depth || 0) + 1,
    last_answer_class: isTeam ? 'claimed_but_unowned' : 'vague',
    evidence: lastState?.evidence || [],
    open_questions: lastState?.open_questions || [],
    flags: lastState?.flags || [],
    confidence: {
      tier: 'insufficient_evidence',
      rationale: isTeam 
        ? 'Candidate described team outcome. Probing personal technical contribution.'
        : 'Candidate gave high-level overview. Probing for specific implementation details.',
      coverage: 'Awaiting concrete examples.'
    }
  };

  const responseText = roleType === 'ENGINEERING'
    ? (isTeam
        ? `What was your specific personal role and technical contribution on that project?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`
        : `Could you give me a specific example of how you implemented that in code or architecture?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`)
    : `Could you share a specific story of how you helped a student through a difficult topic?

<<<NOVA_STATE
${JSON.stringify(state, null, 2)}
NOVA_STATE>>>`;

  return { content: responseText, state };
}
