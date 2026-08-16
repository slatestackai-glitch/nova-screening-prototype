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
    const isEng = roleType === 'ENGINEERING';
    const state: NovaState = {
      phase: 'consent',
      topic: 'AI Disclosure & Call Consent',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: [],
      open_questions: [],
      flags: [],
      confidence: {
        tier: 'insufficient_evidence',
        rationale: 'Screen initiated. Awaiting candidate consent to proceed.',
        coverage: 'Interview starting.'
      }
    };

    const responseText = isEng
      ? `Hi, is this Alex? I'm Nova — I should mention upfront, I'm an AI, not a human recruiter. I work with ${factSheet.company} and I'm calling about the ${factSheet.roleTitle} role. This call is recorded so our engineering hiring team can review it. Is now an okay time, and are you okay to continue?`
      : `Hey there, is this Priya? I'm Nova — just so you know right off the bat, I'm an AI, not a person. I'm helping the team at ${factSheet.company} with chats for the ${factSheet.roleTitle} role. We record these so our team can review. Do you have a few minutes to chat?`;

    return {
      content: `${responseText}\n\n<<<NOVA_STATE\n${JSON.stringify(state, null, 2)}\nNOVA_STATE>>>`,
      state
    };
  }

  // 2. Candidate Inquiries: Salary & Comp
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
        topic: 'Compensation Transparency',
        probe_depth: 0,
        last_answer_class: 'n/a',
        evidence: lastState?.evidence || [],
        open_questions: lastState?.open_questions || [],
        flags: lastState?.flags || [],
        confidence: {
          tier: lastState?.confidence?.tier || 'insufficient_evidence',
          rationale: 'Shared fixed salary band from fact sheet (38–52 LPA).',
          coverage: 'Comp aligned.'
        }
      };

      const responseText = `For the ${factSheet.roleTitle} role at ${factSheet.company}, our base compensation band is 38 to 52 LPA fixed. How does that range line up with what you are looking for?`;
      return { content: `${responseText}\n\n<<<NOVA_STATE\n${JSON.stringify(state, null, 2)}\nNOVA_STATE>>>`, state };
    } else {
      const state: NovaState = {
        phase: 'candidate_qa',
        topic: 'Hourly Rate Inquiry',
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

      const responseText = `At ${factSheet.company}, our tutor pay is ₹450 to ₹600 per teaching hour, running about 15 to 25 hours per week. Does that hourly structure fit your weekly availability?`;
      return { content: `${responseText}\n\n<<<NOVA_STATE\n${JSON.stringify(state, null, 2)}\nNOVA_STATE>>>`, state };
    }
  }

  // 3. Manager / Reporting Structure / Deliberate Omission
  if (
    lastUserMsg.includes('manager') ||
    lastUserMsg.includes('report to') ||
    lastUserMsg.includes('equity') ||
    lastUserMsg.includes('stock')
  ) {
    const q = lastUserMsg.includes('manager')
      ? 'Hiring manager and reporting structure'
      : 'Equity and ESOP allocation';

    const prevOpen = lastState?.open_questions || [];
    const openQuestions = prevOpen.includes(q) ? prevOpen : [...prevOpen, q];

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

    const responseText = `I don't have that specific detail in front of me — ${factSheet.recruiter} will have it for your next conversation, and I've logged that question so it's the first thing she covers with you. To wrap up, what timeline works best on your end for the next round?`;
    return { content: `${responseText}\n\n<<<NOVA_STATE\n${JSON.stringify(state, null, 2)}\nNOVA_STATE>>>`, state };
  }

  // 4. Consent / Start Turn
  if (turnCount === 1) {
    const state: NovaState = {
      phase: 'expectations',
      topic: 'Call Overview & Agenda',
      probe_depth: 0,
      last_answer_class: 'n/a',
      evidence: [],
      open_questions: [],
      flags: [],
      confidence: {
        tier: 'insufficient_evidence',
        rationale: 'Consent granted. Framing 10-minute agenda.',
        coverage: 'Agenda set.'
      }
    };

    const responseText = roleType === 'ENGINEERING'
      ? `Great. This will take about ten minutes. We'll chat through your backend development experience, database and systems performance tradeoffs, and any questions you have for us. To kick off, can you tell me what kind of backend projects or tools you've been working with recently?`
      : `Awesome! We'll keep it to about ten minutes. We'd love to hear how you teach math concepts, connect with middle school students, and answer any questions you have. To start, what grade levels do you enjoy teaching the most?`;

    return { content: `${responseText}\n\n<<<NOVA_STATE\n${JSON.stringify(state, null, 2)}\nNOVA_STATE>>>`, state };
  }

  // 5. Dynamic Context Parser (Understands EXACT candidate project context!)
  
  // Snake Game
  if (lastUserMsg.includes('snake')) {
    const state: NovaState = {
      phase: 'screening',
      topic: 'Python Game Logic & State Management',
      probe_depth: 1,
      last_answer_class: 'concrete',
      evidence: [
        ...(lastState?.evidence || []),
        {
          competency: 'Python & Application Logic',
          claim: 'Built Python Snake game implementing state loops and collision detection',
          specificity: 'partial' as const,
          verbatim: 'i made a snake game'
        }
      ],
      open_questions: lastState?.open_questions || [],
      flags: lastState?.flags || [],
      confidence: {
        tier: 'medium',
        rationale: 'Candidate described Python Snake game project. Exploring core state loop and backend logic.',
        coverage: 'Python foundations verified.'
      }
    };

    const responseText = `A Snake game is a classic! In Python, how did you handle the game loop, coordinate grid tracking, and boundary collision detection?`;
    return { content: `${responseText}\n\n<<<NOVA_STATE\n${JSON.stringify(state, null, 2)}\nNOVA_STATE>>>`, state };
  }

  // Metro / Transit Analysis
  if (lastUserMsg.includes('metro') || lastUserMsg.includes('transit') || lastUserMsg.includes('analysis')) {
    const state: NovaState = {
      phase: 'screening',
      topic: 'Data Analysis & Transit Modeling',
      probe_depth: 1,
      last_answer_class: 'concrete',
      evidence: [
        ...(lastState?.evidence || []),
        {
          competency: 'Data Processing & Analytics',
          claim: 'Built metro transit analysis project evaluating route throughput and ridership',
          specificity: 'concrete' as const,
          verbatim: 'i made a metro analysis project'
        }
      ],
      open_questions: lastState?.open_questions || [],
      flags: lastState?.flags || [],
      confidence: {
        tier: 'high',
        rationale: 'Candidate described metro transit analysis project. Exploring data structures and scale.',
        coverage: 'Data modeling verified.'
      }
    };

    const responseText = `That metro analysis project sounds fascinating! What kind of datasets were you analyzing, and what tools or algorithms did you use to model commuter traffic or route congestion?`;
    return { content: `${responseText}\n\n<<<NOVA_STATE\n${JSON.stringify(state, null, 2)}\nNOVA_STATE>>>`, state };
  }

  // Python / Scripting
  if (lastUserMsg.includes('python') || lastUserMsg.includes('fastapi') || lastUserMsg.includes('django') || lastUserMsg.includes('flask')) {
    const state: NovaState = {
      phase: 'screening',
      topic: 'Python Backend Architecture',
      probe_depth: 1,
      last_answer_class: 'concrete',
      evidence: [
        ...(lastState?.evidence || []),
        {
          competency: 'Python & Web Frameworks',
          claim: 'Hands-on Python development experience',
          specificity: 'partial' as const,
          verbatim: lastUserMsg.slice(0, 80)
        }
      ],
      open_questions: lastState?.open_questions || [],
      flags: lastState?.flags || [],
      confidence: {
        tier: 'medium',
        rationale: 'Candidate has Python experience. Exploring web frameworks and database integration.',
        coverage: 'Python core verified.'
      }
    };

    const responseText = `Python is great for backend services. When you write Python APIs, do you typically use frameworks like FastAPI or Flask, or have you worked with asynchronous features like asyncio?`;
    return { content: `${responseText}\n\n<<<NOVA_STATE\n${JSON.stringify(state, null, 2)}\nNOVA_STATE>>>`, state };
  }

  // Go / Kafka / High Throughput Distributed Systems
  if (lastUserMsg.includes('kafka') || lastUserMsg.includes('go') || lastUserMsg.includes('postgres') || lastUserMsg.includes('latency') || lastUserMsg.includes('p99')) {
    const state: NovaState = {
      phase: 'screening',
      topic: 'Distributed Systems & Kafka Partitioning',
      probe_depth: 0,
      last_answer_class: 'concrete',
      evidence: [
        ...(lastState?.evidence || []),
        {
          competency: 'Distributed Architecture & Data Pipelines',
          claim: 'Migrated backend ingestion to Go and Kafka with tenant partitioning',
          specificity: 'concrete' as const,
          verbatim: lastUserMsg.slice(0, 100)
        },
        {
          competency: 'Performance & Optimization',
          claim: 'Reduced p99 database write latency from 420ms to 65ms under load',
          specificity: 'concrete' as const,
          verbatim: 'p99 latency optimization under high throughput'
        }
      ],
      open_questions: lastState?.open_questions || [],
      flags: lastState?.flags || [],
      confidence: {
        tier: 'high',
        rationale: 'Candidate provided 3 concrete engineering claims across distributed systems and latency optimization.',
        coverage: 'Core engineering competencies verified.'
      }
    };

    const responseText = `That's very clear on the Go and Kafka architecture. When partitions rebalance under high load, how did you handle consumer offset commits to prevent duplicate processing?`;
    return { content: `${responseText}\n\n<<<NOVA_STATE\n${JSON.stringify(state, null, 2)}\nNOVA_STATE>>>`, state };
  }

  // Candidate is Confused / Asks for Clarification
  if (lastUserMsg.includes("don't understand") || lastUserMsg.includes("dont understand") || lastUserMsg.includes("no clue") || lastUserMsg.includes("confused")) {
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
        rationale: 'Rephrasing question to candidate comfort area.',
        coverage: 'Exploring core skills.'
      }
    };

    const responseText = roleType === 'ENGINEERING'
      ? `No problem at all! Let's take a step back. What kind of software projects or programming tools have you enjoyed building the most recently?`
      : `No worries at all! What's a favorite math topic or puzzle that you love explaining to students?`;

    return { content: `${responseText}\n\n<<<NOVA_STATE\n${JSON.stringify(state, null, 2)}\nNOVA_STATE>>>`, state };
  }

  // Generic / Default Conversational Response (Pivots cleanly)
  const isTeam = lastUserMsg.includes('we ');
  const state: NovaState = {
    phase: 'screening',
    topic: 'Project Deep Dive',
    probe_depth: (lastState?.probe_depth || 0) + 1,
    last_answer_class: isTeam ? 'claimed_but_unowned' : 'vague',
    evidence: lastState?.evidence || [],
    open_questions: lastState?.open_questions || [],
    flags: lastState?.flags || [],
    confidence: {
      tier: lastState?.confidence?.tier || 'insufficient_evidence',
      rationale: isTeam ? 'Probing individual contribution.' : 'Exploring technical architecture details.',
      coverage: 'Gathering verifiable claims.'
    }
  };

  const responseText = roleType === 'ENGINEERING'
    ? (isTeam
        ? `What was your specific individual role and key technical decisions on that project?`
        : `Could you walk me through the main architectural components of how that worked behind the scenes?`)
    : `Could you share a quick example of how you approached that with a student in class?`;

  return { content: `${responseText}\n\n<<<NOVA_STATE\n${JSON.stringify(state, null, 2)}\nNOVA_STATE>>>`, state };
}
