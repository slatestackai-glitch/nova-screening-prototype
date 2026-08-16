import { FactSheetData, RoleType } from './types';

export const FACT_SHEETS: Record<RoleType, FactSheetData> = {
  ENGINEERING: {
    roleType: 'ENGINEERING',
    roleTitle: 'Senior Backend Engineer',
    company: 'Meridian Labs',
    recruiter: 'Priya',
    deliberateOmissions: ['equity details', 'engineering manager name', 'on-call rotation schedule'],
    sheetText: `ROLE: Senior Backend Engineer
COMPANY: Meridian Labs
COMPENSATION BAND: 38–52 LPA fixed base (annual)
TEAM STRUCTURE: Backend engineering team of 9 engineers
WORK LOCATION / MODEL: Hybrid model (3 days in Bangalore office, 2 days remote)
TECH STACK: Go, PostgreSQL, Apache Kafka, Kubernetes, AWS
INTERVIEW PROCESS: 3 technical & architectural rounds following this initial AI phone screen
PROCESS TIMELINE: Approximately 2 weeks from screen to final offer
RECRUITER / POINT OF CONTACT: Priya (Talent Lead)

DELIBERATELY NOT PROVIDED / UNKNOWN:
- Equity / ESOP allocations (Priya will cover in the follow-up call)
- Direct hiring manager name & background (Priya will share before round 1)
- On-call rotation / paging specifics (Priya and the tech team will discuss)`
  },
  FRONTLINE: {
    roleType: 'FRONTLINE',
    roleTitle: 'Math Tutor (Grades 6–10)',
    company: 'Meridian Learn',
    recruiter: 'Arjun',
    deliberateOmissions: ['exact weekly batch schedule', 'payment cycle dates', 'student count per batch'],
    sheetText: `ROLE: Math Tutor (Grades 6–10)
COMPANY: Meridian Learn
HOURLY RATE: ₹450–600 per teaching hour
WEEKLY COMMITMENT: 15–25 hours per week (flexible shifts across evenings & weekends)
LOCATION / MODEL: 100% Fully Remote
EQUIPMENT REQUIRED: Must own personal laptop / PC with reliable high-speed broadband & HD webcam
NEXT STEP: 1 live demo class (30 minutes) with our academic lead after passing this phone screen
RECRUITER / POINT OF CONTACT: Arjun (Educator Onboarding)

DELIBERATELY NOT PROVIDED / UNKNOWN:
- Exact class batch schedules & assigned grade allocations (Arjun will align during onboarding)
- Bi-weekly vs monthly payment cycle dates (Arjun will provide in contractor agreement)
- Number of students per batch (Academic lead will explain during the demo class)`
  }
};

export function getFactSheet(roleType: RoleType): FactSheetData {
  return FACT_SHEETS[roleType] || FACT_SHEETS.ENGINEERING;
}
