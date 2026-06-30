// ---------------------------------------------------------------------------
// DUMMY DATA ONLY. Everything here is invented for the demo / prototype.
// No real customers, no secrets, no live env values. Numbers are illustrative.
// ---------------------------------------------------------------------------

export type JobStatus =
  | 'Dispatched'
  | 'In Progress'
  | 'Monitoring'
  | 'Awaiting Approval'
  | 'Billing';

export interface DemoJob {
  jobNumber: string;
  customer: string;
  address: string;
  division: string; // e.g. WTR / MLD / REC
  divisionLabel: string;
  status: JobStatus;
  eta: string;
  techs: string[];
  priority: 'High' | 'Normal';
  photos: number;
  noteCount: number;
  amount: string;
}

export const DIVISIONS: Record<string, string> = {
  WTR: 'Water Mitigation',
  MLD: 'Mold Remediation',
  REC: 'Reconstruction',
  CON: 'Contents',
  STC: 'Structural Cleaning',
};

// Today's board for the mobile prototype --------------------------------------
export const DEMO_JOBS: DemoJob[] = [
  {
    jobNumber: '26-1273-WTR',
    customer: 'Marisol Vega',
    address: '418 Larkspur Ln, Tempe AZ',
    division: 'WTR',
    divisionLabel: 'Water Mitigation',
    status: 'In Progress',
    eta: '8:30 AM',
    techs: ['D. Cruz', 'A. Patel'],
    priority: 'High',
    photos: 24,
    noteCount: 6,
    amount: '$8,420',
  },
  {
    jobNumber: '26-1268-MLD',
    customer: 'Greenfield HOA',
    address: '92 Catalina Ct, Mesa AZ',
    division: 'MLD',
    divisionLabel: 'Mold Remediation',
    status: 'Monitoring',
    eta: '10:15 AM',
    techs: ['R. Boone'],
    priority: 'Normal',
    photos: 11,
    noteCount: 3,
    amount: '$5,180',
  },
  {
    jobNumber: '26-1255-REC',
    customer: 'Tom & Dana Webb',
    address: '1107 Saguaro Dr, Chandler AZ',
    division: 'REC',
    divisionLabel: 'Reconstruction',
    status: 'Awaiting Approval',
    eta: '1:00 PM',
    techs: ['M. Ortiz', 'J. Lane'],
    priority: 'Normal',
    photos: 38,
    noteCount: 9,
    amount: '$31,900',
  },
  {
    jobNumber: '26-1241-WTR',
    customer: 'Sunridge Dental',
    address: '5 Roosevelt Blvd, Gilbert AZ',
    division: 'WTR',
    divisionLabel: 'Water Mitigation',
    status: 'Billing',
    eta: 'Done',
    techs: ['D. Cruz'],
    priority: 'Normal',
    photos: 52,
    noteCount: 12,
    amount: '$14,260',
  },
];

// "My Day" to-dos -------------------------------------------------------------
export interface DemoTodo {
  id: string;
  label: string;
  due: string;
  done: boolean;
  source: string; // which engine created it
}

export const DEMO_TODOS: DemoTodo[] = [
  { id: 't1', label: 'Upload moisture map — 26-1273-WTR', due: 'by 11:00 AM', done: false, source: 'Compliance' },
  { id: 't2', label: 'Customer authorization signature — Webb', due: 'today', done: false, source: 'Compliance' },
  { id: 't3', label: 'Daily monitoring reading — Greenfield HOA', due: '2:00 PM', done: false, source: 'Compliance' },
  { id: 't4', label: 'Confirm dumpster pickup — Sunridge', due: 'today', done: true, source: 'Dispatch' },
];

// Incoming scanner alerts (Alert Page) ----------------------------------------
export interface DemoAlert {
  id: string;
  time: string;
  feed: string;
  raw: string;
  score: number; // 0-100 AI qualifier
  verdict: 'Hot lead' | 'Worth a call' | 'Skip';
  reason: string;
}

export const DEMO_ALERTS: DemoAlert[] = [
  {
    id: 'a1',
    time: '07:52',
    feed: 'Maricopa County Fire',
    raw: 'STRUCTURE FIRE — single-family residence, smoke showing, 2nd alarm, 6200 blk N Marbella',
    score: 92,
    verdict: 'Hot lead',
    reason: 'Residential structure fire, 2nd alarm = significant smoke/water damage likely. Owner-occupied zip, high reconstruction potential.',
  },
  {
    id: 'a2',
    time: '07:39',
    feed: 'Chandler PD/Fire',
    raw: 'WATER FLOW ALARM — commercial, sprinkler activation, no fire found',
    score: 74,
    verdict: 'Worth a call',
    reason: 'Sprinkler discharge in a commercial building means real water mitigation work even with no fire.',
  },
  {
    id: 'a3',
    time: '07:21',
    feed: 'Mesa Fire & Medical',
    raw: 'MEDICAL — chest pain, 1 patient, BLS response',
    score: 6,
    verdict: 'Skip',
    reason: 'Medical-only call, no property loss. Not a restoration opportunity.',
  },
];

// Billing-package QA result ---------------------------------------------------
export interface QACheck {
  label: string;
  ok: boolean;
  note: string;
}

export const DEMO_QA: { job: string; score: number; checks: QACheck[] } = {
  job: '26-1241-WTR',
  score: 86,
  checks: [
    { label: 'Signed authorization to perform', ok: true, note: 'On file (e-sign 06/24)' },
    { label: 'Before / after photos per room', ok: true, note: '52 photos, 6 of 6 rooms' },
    { label: 'Daily moisture logs', ok: true, note: '4 of 4 days logged' },
    { label: 'Equipment in/out timestamps', ok: false, note: '2 air movers missing pickup time' },
    { label: 'Xactimate line-item match', ok: true, note: 'Sketch matches estimate' },
    { label: 'Certificate of completion', ok: false, note: 'Not yet signed by customer' },
  ],
};

// Note grading ----------------------------------------------------------------
export const DEMO_NOTE_GRADE = {
  job: '26-1273-WTR',
  grade: 'B+',
  score: 88,
  strengths: ['Affected materials documented', 'Moisture % readings included', 'Equipment placement noted'],
  gaps: ['No customer communication logged', 'Missing cause-of-loss detail'],
};

// Marketing copy: feature grid ------------------------------------------------
export interface Feature {
  icon: string;
  title: string;
  body: string;
}

export const FEATURES: Feature[] = [
  { icon: '🧭', title: 'Mobile dispatch', body: 'Field crews see their day, drive routes, and update jobs from the truck. The web app runs the office.' },
  { icon: '📊', title: 'Eight live dashboards', body: 'Operations, Rebuild, Warehouse, Collections, Insurance Adjusting, Sales, Marketing, and Company — calculated from the data, never hand-keyed.' },
  { icon: '✅', title: 'Compliance engine', body: 'Detection-then-execution rules watch every job and auto-create the right task for the right person at the right time.' },
  { icon: '📡', title: 'Live Alert Page', body: 'Turns real-time fire & EMS scanner dispatches into restoration leads before the phone ever rings.' },
  { icon: '🤝', title: 'Plumber referral CRM', body: 'Track referral partners, attribution, and payouts so the relationships that drive jobs never fall through.' },
  { icon: '🗂️', title: 'One source of truth', body: 'Jobs, customers, claims, and documents in one place — replacing legacy spreadsheets and the old Dash tool.' },
  { icon: '🧱', title: 'My Day & Accountability', body: 'An EOS / Ninety-style daily focus view plus a living org chart so everyone owns their seat.' },
  { icon: '🔌', title: 'Integrations that matter', body: 'QuickBooks (accounting + Time), Microsoft 365 calendar & email, RingCentral, and Encircle field data.' },
];

export interface AIFeature {
  badge: string;
  title: string;
  benefit: string;
  detail: string;
}

export const AI_FEATURES: AIFeature[] = [
  {
    badge: 'Lead capture',
    title: 'AI Alert Qualifier',
    benefit: 'Scores live scanner dispatches as leads so you chase the fires worth chasing.',
    detail: 'Reads raw fire/EMS radio dispatches and rates each one 0–100 with a plain-English reason — separating a 2nd-alarm structure fire from a routine medical call.',
  },
  {
    badge: 'Win more claims',
    title: 'AI Rebuttal Assistant',
    benefit: 'Drafts insurance-denial rebuttals grounded in your own denial library.',
    detail: 'Pulls from a curated denial library and cites IICRC standards and Xactimate line items, so adjusters get a defensible, sourced response instead of a guess.',
  },
  {
    badge: 'Documentation',
    title: 'AI Note Grading',
    benefit: 'Scores job-note quality and tells the tech exactly what is missing.',
    detail: 'Grades each note for completeness — cause of loss, moisture readings, customer comms — and nudges the crew to fix gaps while they are still on site.',
  },
  {
    badge: 'Get paid faster',
    title: 'AI Billing-Package QA',
    benefit: 'A pre-submission completeness check before the package goes to the carrier.',
    detail: 'Scans photos, logs, signatures, and the estimate, then flags what is missing — cutting rejections and the back-and-forth that delays payment.',
  },
  {
    badge: 'Ask anything',
    title: 'Company Brain',
    benefit: 'A conversational assistant that answers questions over all company data.',
    detail: 'Ask "which water jobs are over 30 days unbilled?" or "how did Crew B do last month?" in plain English and get an answer grounded in your live CRM.',
  },
  {
    badge: 'Coaching',
    title: 'AI Crew Coaching',
    benefit: 'Turns the grades and QA findings into per-tech coaching prompts.',
    detail: 'Aggregates note grades and billing-QA misses into specific, encouraging coaching for each crew member — building a documentation habit that protects every claim.',
  },
];

// Pitch deck slides -----------------------------------------------------------
export interface Slide {
  kind: 'title' | 'statement' | 'bullets' | 'metrics';
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  metrics?: { value: string; label: string }[];
  footer?: string;
}

export const SLIDES: Slide[] = [
  {
    kind: 'title',
    eyebrow: 'Tailr',
    title: 'The operating system for the restoration business',
    subtitle: 'Jobs, customers, claims, and compliance in one place — with AI built in.',
    footer: 'Investor & operations overview',
  },
  {
    kind: 'statement',
    eyebrow: 'The problem',
    title: 'Restoration runs on spreadsheets, sticky notes, and a tool nobody likes',
    subtitle: 'Work lives in disconnected Excel files and the legacy "Dash." Data is stale, compliance slips, claims get denied, and leads are missed while the office is on the phone.',
  },
  {
    kind: 'statement',
    eyebrow: 'The solution',
    title: 'One CRM that is the source of truth — field to billing',
    subtitle: 'A mobile dispatch app for crews and a web app for the office, sharing one live database for every job, customer, claim, and document.',
  },
  {
    kind: 'bullets',
    eyebrow: 'For the field',
    title: 'A mobile app crews actually use',
    bullets: [
      'My Day: today\'s jobs, routes, and the tasks that matter',
      'Update status, log notes, and capture photos from the truck',
      'Compliance tasks pushed to the right tech automatically',
      'Works the way a restoration day actually flows',
    ],
  },
  {
    kind: 'bullets',
    eyebrow: 'For the office',
    title: 'Eight dashboards, calculated live',
    bullets: [
      'Operations, Rebuild, Warehouse, Collections',
      'Insurance Adjusting, Sales, Marketing, Company',
      'Plus My Day (EOS / Ninety-style) and an Accountability org chart',
      'Every number rolls up from the data — nothing hand-keyed',
    ],
  },
  {
    kind: 'statement',
    eyebrow: 'The engine',
    title: 'A compliance engine that never forgets',
    subtitle: 'Detection-then-execution: database triggers detect what happened, and workflow rules auto-create the right task for the right role at the right time — so documentation and claims stay airtight.',
  },
  {
    kind: 'bullets',
    eyebrow: 'AI built in',
    title: 'Six ways AI does the heavy lifting',
    bullets: [
      'Alert Qualifier — scores live scanner dispatches as leads',
      'Rebuttal Assistant — drafts sourced insurance-denial rebuttals',
      'Note Grading — scores documentation quality on site',
      'Billing-Package QA — pre-submission completeness check',
      'Company Brain — ask anything across your data',
      'Crew Coaching — turns findings into per-tech guidance',
    ],
  },
  {
    kind: 'statement',
    eyebrow: 'Lead capture',
    title: 'Find the loss before the phone rings',
    subtitle: 'The Alert Page ingests real-time fire & EMS scanner dispatches and the AI Alert Qualifier scores each one — so the team is reaching out while competitors are still asleep.',
  },
  {
    kind: 'bullets',
    eyebrow: 'Integrations',
    title: 'Plugs into the tools you already run',
    bullets: [
      'QuickBooks — accounting and QuickBooks Time',
      'Microsoft 365 — calendar and email',
      'RingCentral — calls, recordings, transcripts',
      'Encircle — field documentation and equipment data',
    ],
  },
  {
    kind: 'metrics',
    eyebrow: 'The results',
    title: 'What good looks like',
    subtitle: 'Illustrative targets for a mid-size restoration operation.',
    metrics: [
      { value: '8 hrs', label: 'admin time saved per crew, weekly' },
      { value: '30%', label: 'fewer claim rejections' },
      { value: '< 1 min', label: 'from scanner alert to qualified lead' },
      { value: '1', label: 'source of truth, instead of dozens of files' },
    ],
  },
  {
    kind: 'statement',
    eyebrow: 'Why now',
    title: 'The restoration back office is finally ready to be automated',
    subtitle: 'The data, the integrations, and AI that can read a denial letter or a radio dispatch all exist today. Tailr CRM ties them into one workflow built by people who run the trucks.',
  },
  {
    kind: 'title',
    eyebrow: 'Tailr CRM',
    title: 'Run the whole business from one place',
    subtitle: 'Field to billing, with AI built in.',
    footer: 'Thank you',
  },
];
