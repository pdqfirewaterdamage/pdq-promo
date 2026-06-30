// ---------------------------------------------------------------------------
// PDQ CRM — demo dataset.
//
// Shaped to match the REAL pdq-crm Supabase schema (divisions, job_statuses,
// jobs, equipment, collections, company scorecard, plumbers, alerts) so the
// embedded demo reads like the actual app — NOT invented filler.
//
// Customer names are synthetic/anonymized. Divisions, statuses, NJ service
// cities, equipment kinds, and scorecard measurables mirror the live system.
// Everything here is static; the demo makes zero network calls.
// ---------------------------------------------------------------------------

// ── Divisions (real codes + labels) ─────────────────────────────────────────
export interface Division { code: string; label: string; color: string; }
export const DIVISIONS: Division[] = [
  { code: 'WTR', label: 'Water Mitigation',            color: '#2563eb' },
  { code: 'REC', label: 'Reconstruction',              color: '#f59e0b' },
  { code: 'CON', label: 'Contents',                     color: '#7c3aed' },
  { code: 'MLD', label: 'Mold Remediation',             color: '#16a34a' },
  { code: 'STC', label: 'Structural Cleaning',          color: '#0891b2' },
  { code: 'CPO', label: 'Contents Packout/Packback',    color: '#a78bfa' },
  { code: 'ASB', label: 'Asbestos',                     color: '#dc2626' },
  { code: 'ENV', label: 'Environmental',                color: '#eab308' },
  { code: 'TRM', label: 'Trauma',                       color: '#be123c' },
  { code: 'TMP', label: 'Temporary Repairs',            color: '#6b7280' },
  { code: 'REF', label: 'Referral',                     color: '#94a3b8' },
];
export const DIV_LABEL: Record<string, string> = Object.fromEntries(DIVISIONS.map((d) => [d.code, d.label]));
export const DIV_COLOR: Record<string, string> = Object.fromEntries(DIVISIONS.map((d) => [d.code, d.color]));

// ── Job statuses (real keys, labels, buckets) ───────────────────────────────
export interface JobStatusDef { key: string; label: string; bucket: string; terminal: boolean; }
export const JOB_STATUSES: JobStatusDef[] = [
  { key: 'open',                   label: 'Open',                     bucket: 'open',    terminal: false },
  { key: 'pending_sales',          label: 'Pending Sales',            bucket: 'pending', terminal: false },
  { key: 'pre_production',         label: 'Pre-Production',           bucket: 'active',  terminal: false },
  { key: 'work_in_progress',       label: 'Work In Progress',         bucket: 'active',  terminal: false },
  { key: 'completed_no_paperwork', label: 'Completed – No Paperwork', bucket: 'active',  terminal: false },
  { key: 'invoice_pending',        label: 'Invoice Pending',          bucket: 'pending', terminal: false },
  { key: 'accounts_receivable',    label: 'Accounts Receivable',      bucket: 'pending', terminal: false },
  { key: 'waiting_to_close',       label: 'Waiting to Close',         bucket: 'pending', terminal: false },
  { key: 'closed',                 label: 'Closed',                   bucket: 'done',    terminal: true  },
  { key: 'on_hold',                label: 'On Hold',                  bucket: 'onhold',  terminal: false },
  { key: 'lost',                   label: 'Lost / Cancelled',         bucket: 'lost',    terminal: true  },
];
export const STATUS_LABEL: Record<string, string> = Object.fromEntries(JOB_STATUSES.map((s) => [s.key, s.label]));
export const STATUS_BUCKET: Record<string, string> = Object.fromEntries(JOB_STATUSES.map((s) => [s.key, s.bucket]));

// Status pill color (mirrors mobile @pdq/core statusColor families).
export const STATUS_COLOR: Record<string, string> = {
  open: '#6b7280',
  pending_sales: '#d97706',
  pre_production: '#2563eb',
  work_in_progress: '#0e9f6e',
  completed_no_paperwork: '#0891b2',
  invoice_pending: '#7c3aed',
  accounts_receivable: '#b45309',
  waiting_to_close: '#9333ea',
  closed: '#16a34a',
  on_hold: '#475569',
  lost: '#b42318',
};

// ── Service territory (real NJ cities from the live job set) ─────────────────
const CITIES = [
  'Hackensack', 'Denville', 'Belleville', 'East Orange', 'Rockaway', 'Boonton',
  'Ringwood', 'Sparta', 'Hackettstown', 'Phillipsburg', 'Rutherford', 'Mine Hill',
  'Rochelle Park', 'Liberty Corner', 'Edison', 'Fair Lawn', 'Oak Ridge', 'Wayne',
  'Montclair', 'Parsippany', 'Morristown', 'Clifton',
];

// ── Staff roster (synthetic names; structure mirrors profiles + teams) ───────
export const SUPERVISORS = ['Carlos Reyes', 'Devon Pierce', 'Marcus Hale', 'Tony Briggs', 'Ray Coletti', 'No Supervisor'];
export const MARKETING = ['Michael Moughrabie', 'Hunter Halliburton', 'TJ Rozansky'];
export const ESTIMATORS = ['Greg Sanford', 'Alan Whitmore', 'Devon Pierce'];

// ── Deterministic PRNG so the demo is stable across reloads ──────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260607);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const between = (lo: number, hi: number) => Math.floor(rand() * (hi - lo + 1)) + lo;

const FIRST = ['Maria', 'James', 'Linda', 'Robert', 'Patricia', 'John', 'Jennifer', 'David', 'Susan', 'Michael',
  'Karen', 'William', 'Nancy', 'Richard', 'Lisa', 'Thomas', 'Sandra', 'Daniel', 'Donna', 'Paul',
  'Carol', 'Mark', 'Michelle', 'Steven', 'Amanda', 'Kenneth', 'Dorothy', 'Joshua', 'Angela', 'Brian'];
const LAST = ['Romano', 'Walsh', 'Fiore', 'Delgado', 'Pawlowski', 'Hughes', 'Castellano', 'Brennan', 'Nguyen', 'Russo',
  'Kowalski', 'Esposito', 'Patel', 'Caruso', 'O’Brien', 'Marchetti', 'Sullivan', 'Vargas', 'DeLuca', 'Friedman',
  'Greco', 'Santiago', 'Conti', 'Murphy', 'Ferraro', 'Klein', 'Rizzo', 'Boyd', 'Lombardi', 'Schneider'];
const COMMERCIAL = ['Ridgeline Dental', 'Summit HOA', 'Garden State Storage', 'Maple Ave Apartments', 'Northvale Medical',
  'Parkway Diner', 'Lakeside Church', 'Brookfield School District', 'Hudson Logistics', 'Crestmont Realty'];
const STREETS = ['Larch Ave', 'Spring St', 'Hillside Rd', 'Maple Ter', 'Oak Knoll Dr', 'Riverview Blvd', 'Elm St',
  'Sunset Ln', 'Forest Ave', 'Highland Pkwy', 'Birch Hollow', 'Clinton Pl', 'Grove St', 'Valley Rd'];

const CAUSES: Record<string, string[]> = {
  WTR: ['Supply line burst — kitchen', 'Water heater failure', 'Toilet supply overflow', 'Roof leak — storm', 'Dishwasher discharge', 'Sump pump failure'],
  MLD: ['Microbial growth — basement', 'Bathroom mold remediation', 'Crawlspace contamination', 'HVAC mold'],
  REC: ['Rebuild — water loss', 'Kitchen reconstruction', 'Full basement rebuild', 'Drywall & paint package'],
  CON: ['Contents inventory & clean', 'Soft goods restoration', 'Electronics evaluation'],
  STC: ['Soot/structural cleaning', 'Post-mit deep clean', 'Odor treatment'],
  CPO: ['Pack-out to warehouse', 'Pack-back delivery'],
  ASB: ['Asbestos abatement — flooring', 'Pipe insulation abatement'],
  ENV: ['Sewage (Cat 3) cleanup', 'Biohazard remediation'],
  TRM: ['Trauma scene cleanup'],
  TMP: ['Emergency board-up', 'Temporary roof tarp'],
  REF: ['Referred to partner'],
};

const ACTIVE_STATUSES = ['pending_sales', 'pre_production', 'work_in_progress', 'completed_no_paperwork', 'invoice_pending', 'accounts_receivable', 'waiting_to_close', 'on_hold'];
const ACTIVE_DIVS = ['WTR', 'WTR', 'WTR', 'REC', 'REC', 'CON', 'MLD', 'STC', 'CPO', 'ASB', 'ENV', 'TRM', 'TMP'];

export interface DemoJob {
  id: string;
  jobNumber: string;
  customer: string;
  address: string;
  city: string;
  division: string;
  status: string;
  priority: 'High' | 'Normal';
  supervisor: string;
  marketing: string;
  estimate: number;
  invoiced: number;
  paid: number;
  daysOpen: number;
  receivedAt: string;       // ISO date
  photos: number;
  noteCount: number;
  cause: string;
  carrier: string;
}

const CARRIERS = ['State Farm', 'Allstate', 'Liberty Mutual', 'Travelers', 'NJM', 'Chubb', 'Plymouth Rock', 'Self-Pay', 'Selective'];

function makeJob(i: number): DemoJob {
  const division = ACTIVE_DIVS[i % ACTIVE_DIVS.length];
  const status = i < 3 ? 'work_in_progress' : pick(ACTIVE_STATUSES);
  const commercial = rand() < 0.18;
  const customer = commercial ? pick(COMMERCIAL) : `${pick(FIRST)} ${pick(LAST)}`;
  const city = pick(CITIES);
  const estimate = division === 'REC' ? between(12, 65) * 1000 : between(2, 18) * 1000 + between(0, 9) * 100;
  const bucket = STATUS_BUCKET[status];
  const invoiced = ['invoice_pending', 'accounts_receivable', 'waiting_to_close'].includes(status) ? Math.round(estimate * (0.85 + rand() * 0.25)) : 0;
  const paid = status === 'waiting_to_close' ? invoiced : status === 'accounts_receivable' ? Math.round(invoiced * (rand() < 0.5 ? 0 : 0.5)) : 0;
  const daysOpen = bucket === 'pending' ? between(8, 74) : between(1, 35);
  const d = new Date(2026, 5, 30);
  d.setDate(d.getDate() - daysOpen);
  const yr = 25 + (i % 2);
  return {
    id: `job-${i}`,
    jobNumber: `${yr}-${1100 + i * 7 + between(0, 6)}-${division}`,
    customer,
    address: `${between(2, 1480)} ${pick(STREETS)}`,
    city,
    division,
    status,
    priority: rand() < 0.22 ? 'High' : 'Normal',
    supervisor: pick(SUPERVISORS),
    marketing: pick(MARKETING),
    estimate,
    invoiced,
    paid,
    daysOpen,
    receivedAt: d.toISOString().slice(0, 10),
    photos: between(4, 64),
    noteCount: between(1, 14),
    cause: pick(CAUSES[division] ?? ['Loss']),
    carrier: pick(CARRIERS),
  };
}

export const JOBS: DemoJob[] = Array.from({ length: 46 }, (_, i) => makeJob(i));

export const balanceDue = (j: DemoJob) => Math.max(0, j.invoiced - j.paid);

// ── Company scorecard (real measurables) ────────────────────────────────────
export interface Measurable { label: string; unit: string | null; target: number | null; op: string; owner: string; actual: number | null; }
export const SCORECARD: Measurable[] = [
  { label: 'Weekly Revenue',             unit: '$',     target: 100000, op: '>=', owner: 'Tim',  actual: 112400 },
  { label: 'Leads Received',             unit: 'count', target: 20,     op: '>=', owner: 'Mike', actual: 23 },
  { label: 'Closing %',                  unit: '%',     target: 35,     op: '>=', owner: 'Mike', actual: 38 },
  { label: 'Avg Speed to Lead',          unit: 'min',   target: 10,     op: '<=', owner: 'Tim',  actual: 8 },
  { label: 'Jobs Signed',                unit: 'count', target: 10,     op: '>=', owner: 'Mike', actual: 11 },
  { label: 'Cash Collected',             unit: '$',     target: 100000, op: '>=', owner: 'Sue',  actual: 94300 },
  { label: 'Open AR > 30 days',          unit: '$',     target: 50000,  op: '<=', owner: 'Sue',  actual: 61800 },
  { label: 'Jobs Completed',             unit: 'count', target: 12,     op: '>=', owner: 'Mike', actual: 12 },
  { label: 'Cycle Time (median, days)',  unit: 'days',  target: 30,     op: '<=', owner: 'Mike', actual: 27 },
];
export function measurableOnTarget(m: Measurable): boolean | null {
  if (m.actual == null || m.target == null) return null;
  return m.op === '<=' ? m.actual <= m.target : m.actual >= m.target;
}

// ── Equipment fleet (real kinds + counts, scaled to active jobs) ─────────────
export interface EquipKind { kind: string; label: string; total: number; onJob: number; }
export const EQUIPMENT: EquipKind[] = [
  { kind: 'airmover',     label: 'Air Movers',     total: 283, onJob: 96 },
  { kind: 'dehu',         label: 'Dehumidifiers',  total: 106, onJob: 41 },
  { kind: 'air_scrubber', label: 'Air Scrubbers',  total: 22,  onJob: 9 },
  { kind: 'hydroxyl',     label: 'Hydroxyl Gens',  total: 22,  onJob: 5 },
  { kind: 'injectidry',  label: 'Inject-i-Dry',    total: 8,   onJob: 3 },
  { kind: 'other',        label: 'Other Assets',   total: 67,  onJob: 12 },
];

// ── Insurance carriers + adjusters (shape of insurance-adjusting dashboard) ──
export interface AdjusterRow { name: string; carrier: string; openClaims: number; avgSupplement: number; approvalRate: number; }
export const ADJUSTERS: AdjusterRow[] = [
  { name: 'B. Henderson', carrier: 'State Farm',      openClaims: 9, avgSupplement: 0.18, approvalRate: 0.82 },
  { name: 'L. Ortega',    carrier: 'Allstate',        openClaims: 6, avgSupplement: 0.11, approvalRate: 0.74 },
  { name: 'R. Kim',       carrier: 'Liberty Mutual',  openClaims: 7, avgSupplement: 0.22, approvalRate: 0.69 },
  { name: 'D. Pruitt',    carrier: 'Travelers',       openClaims: 4, avgSupplement: 0.09, approvalRate: 0.88 },
  { name: 'S. Abboud',    carrier: 'NJM',             openClaims: 8, avgSupplement: 0.15, approvalRate: 0.79 },
  { name: 'M. Flores',    carrier: 'Selective',       openClaims: 3, avgSupplement: 0.27, approvalRate: 0.61 },
];
export const CARRIER_LIST = ['State Farm', 'Allstate', 'Liberty Mutual', 'Travelers', 'NJM', 'Chubb', 'Plymouth Rock', 'Selective'];

// ── Marketing lead sources (real tabs) ──────────────────────────────────────
export interface LeadSource { slug: string; label: string; leads: number; jobs: number; revenue: number; cost: number; }
export const LEAD_SOURCES: LeadSource[] = [
  { slug: 'service-direct', label: 'Service Direct', leads: 41, jobs: 14, revenue: 184000, cost: 9200 },
  { slug: 'inquirly',       label: 'Inquirly',       leads: 22, jobs: 6,  revenue: 71000,  cost: 4100 },
  { slug: '33-mile',        label: '33 Mile',        leads: 18, jobs: 7,  revenue: 96000,  cost: 3000 },
  { slug: 'elocal',         label: 'eLocal',         leads: 27, jobs: 5,  revenue: 58000,  cost: 5400 },
  { slug: 'ppc',            label: 'PPC',            leads: 33, jobs: 9,  revenue: 142000, cost: 11800 },
  { slug: 'lsa',            label: 'LSA',            leads: 16, jobs: 6,  revenue: 88000,  cost: 2600 },
  { slug: 'seo',            label: 'SEO',            leads: 29, jobs: 11, revenue: 168000, cost: 1500 },
];

// ── Plumber referral CRM ─────────────────────────────────────────────────────
export interface Plumber { name: string; company: string; referrals: number; converted: number; payout: number; lastReferral: string; tier: 'Gold' | 'Silver' | 'Bronze'; }
export const PLUMBERS: Plumber[] = [
  { name: 'Joe Marchetti', company: 'Marchetti Plumbing',   referrals: 14, converted: 9, payout: 4500, lastReferral: '2 days ago',  tier: 'Gold' },
  { name: 'Dave Russo',    company: 'Russo & Sons',          referrals: 11, converted: 6, payout: 3000, lastReferral: '5 days ago',  tier: 'Gold' },
  { name: 'Frank Conti',   company: 'Reliable Rooter',       referrals: 8,  converted: 4, payout: 2000, lastReferral: '1 week ago',  tier: 'Silver' },
  { name: 'Mike Esposito', company: 'Esposito Mechanical',   referrals: 6,  converted: 3, payout: 1500, lastReferral: '3 days ago',  tier: 'Silver' },
  { name: 'Tom Walsh',     company: 'Walsh Plumbing & Heat', referrals: 4,  converted: 1, payout: 500,  lastReferral: '2 weeks ago', tier: 'Bronze' },
  { name: 'Sal Greco',     company: 'Greco Drain Pros',      referrals: 3,  converted: 2, payout: 1000, lastReferral: '4 days ago',  tier: 'Bronze' },
];

// ── Alert Page (scanner dispatches scored by AI) ─────────────────────────────
export interface Alert { id: string; time: string; feed: string; raw: string; score: number; verdict: 'Hot lead' | 'Worth a call' | 'Skip'; reason: string; }
export const ALERTS: Alert[] = [
  { id: 'a1', time: '07:52', feed: 'Bergen County Fire', raw: 'STRUCTURE FIRE — single-family residence, smoke showing, 2nd alarm, 400 blk Prospect Ave, Hackensack', score: 92, verdict: 'Hot lead',
    reason: 'Residential structure fire, 2nd alarm = significant smoke/water damage likely. Owner-occupied zip, high reconstruction potential.' },
  { id: 'a2', time: '07:39', feed: 'Morris County Dispatch', raw: 'WATER FLOW ALARM — commercial, sprinkler activation, no fire found, Rt-10 retail plaza, Denville', score: 76, verdict: 'Worth a call',
    reason: 'Sprinkler discharge in a commercial building means real water mitigation work even with no fire.' },
  { id: 'a3', time: '07:21', feed: 'Essex County Fire', raw: 'BURST PIPE — basement flooding reported, occupied 2-family, East Orange', score: 81, verdict: 'Hot lead',
    reason: 'Active basement flooding in an occupied multi-family. Category-1 water, fast mitigation window.' },
  { id: 'a4', time: '06:58', feed: 'Mesa Fire & Medical', raw: 'MEDICAL — chest pain, 1 patient, BLS response', score: 6, verdict: 'Skip',
    reason: 'Medical-only call, no property loss. Not a restoration opportunity.' },
];

// ── Collections aging buckets ────────────────────────────────────────────────
export function collectionsRows() {
  return JOBS.filter((j) => balanceDue(j) > 0).map((j) => ({ ...j, balance: balanceDue(j), age: j.daysOpen }));
}

// ── Compliance tasks (detection-then-execution engine) ───────────────────────
export interface ComplianceTask { id: string; label: string; job: string; role: string; due: string; done: boolean; source: string; }
export const COMPLIANCE_TASKS: ComplianceTask[] = [
  { id: 'c1', label: 'Upload moisture map', job: '26-1147-WTR', role: 'Lead Tech', due: 'by 11:00 AM', done: false, source: 'Moisture docs rule' },
  { id: 'c2', label: 'Signed authorization to perform', job: '26-1182-REC', role: 'Estimator', due: 'today', done: false, source: 'Auth rule' },
  { id: 'c3', label: 'Daily monitoring reading', job: '26-1133-MLD', role: 'Lead Tech', due: '2:00 PM', done: false, source: 'Daily-log rule' },
  { id: 'c4', label: 'Equipment in/out timestamps', job: '26-1126-WTR', role: 'Warehouse', due: 'today', done: false, source: 'Equipment rule' },
  { id: 'c5', label: 'Certificate of completion signed', job: '26-1119-STC', role: 'Supervisor', due: 'overdue', done: false, source: 'Closeout rule' },
  { id: 'c6', label: 'Confirm dumpster pickup', job: '26-1108-REC', role: 'Dispatch', due: 'today', done: true, source: 'Dispatch rule' },
];

// ── AI Billing QA (pre-submission completeness) ──────────────────────────────
export const BILLING_QA = {
  job: '26-1126-WTR',
  score: 86,
  checks: [
    { label: 'Signed authorization to perform', ok: true,  note: 'On file (e-sign 06/24)' },
    { label: 'Before / after photos per room',  ok: true,  note: '52 photos, 6 of 6 rooms' },
    { label: 'Daily moisture logs',             ok: true,  note: '4 of 4 days logged' },
    { label: 'Equipment in/out timestamps',     ok: false, note: '2 air movers missing pickup time' },
    { label: 'Xactimate line-item match',       ok: true,  note: 'Sketch matches estimate' },
    { label: 'Certificate of completion',       ok: false, note: 'Not yet signed by customer' },
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
export const money = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n.toLocaleString()}`;
export const moneyFull = (n: number) => `$${Math.round(n).toLocaleString()}`;

export function jobsByStatus(status: string) { return JOBS.filter((j) => j.status === status); }
export function jobsByDivision(div: string) { return JOBS.filter((j) => j.division === div); }
export function activeJobs() { return JOBS.filter((j) => STATUS_BUCKET[j.status] === 'active'); }
export function pendingSalesJobs() { return JOBS.filter((j) => j.status === 'pending_sales'); }
