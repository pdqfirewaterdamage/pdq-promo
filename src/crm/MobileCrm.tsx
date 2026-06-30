import { useMemo, useState, type ReactNode } from 'react';
import {
  JOBS, DIV_LABEL, DIV_COLOR, STATUS_LABEL, STATUS_COLOR, SCORECARD, measurableOnTarget,
  COMPLIANCE_TASKS, EQUIPMENT, money, balanceDue, activeJobs, pendingSalesJobs,
  collectionsRows, type DemoJob,
} from './data';

const NAVY = '#032e5b';
const RED = '#dc2626';

type Mode = 'office' | 'field';
type ScreenKey =
  | 'my-review' | 'dispatch-office' | 'company' | 'operations' | 'collections' | 'warehouse' | 'sales'
  | 'ops-summary' | 'dispatch' | 'index' | 'job-management' | 'truck-checklist'
  | 'compliance' | 'pyscorp' | 'playbook' | 'account';

const OFFICE_NAV: { key: ScreenKey; label: string; icon: string }[] = [
  { key: 'my-review', label: 'My Review', icon: '📋' },
  { key: 'dispatch-office', label: 'Dispatch', icon: '📞' },
  { key: 'company', label: 'Company', icon: '🏠' },
  { key: 'operations', label: 'Operations', icon: '📊' },
  { key: 'collections', label: 'Collections', icon: '💲' },
  { key: 'warehouse', label: 'Warehouse', icon: '📦' },
  { key: 'sales', label: 'Sales', icon: '📈' },
  { key: 'compliance', label: 'Compliance', icon: '🛡️' },
];
const FIELD_NAV: { key: ScreenKey; label: string; icon: string }[] = [
  { key: 'ops-summary', label: 'Operations Summary', icon: '📊' },
  { key: 'dispatch', label: 'Dispatch', icon: '🚚' },
  { key: 'index', label: 'My Jobs', icon: '💼' },
  { key: 'job-management', label: 'Job Management', icon: '🛠️' },
  { key: 'truck-checklist', label: 'Truck Checklist', icon: '☑️' },
  { key: 'compliance', label: 'Compliance', icon: '🛡️' },
];
const FOOTER_NAV: { key: ScreenKey; label: string; icon: string }[] = [
  { key: 'pyscorp', label: 'Pyscorp', icon: '💧' },
  { key: 'playbook', label: 'Playbook', icon: '📖' },
  { key: 'account', label: 'Account', icon: '👤' },
];

const TITLES: Record<ScreenKey, string> = {
  'my-review': 'My Review', 'dispatch-office': 'Dispatch', company: 'Company', operations: 'Operations',
  collections: 'Collections', warehouse: 'Warehouse', sales: 'Sales', 'ops-summary': 'Operations Summary',
  dispatch: 'Dispatch', index: 'My Jobs', 'job-management': 'Job Management', 'truck-checklist': 'Truck Checklist',
  compliance: 'Compliance', pyscorp: 'Pyscorp Calculator', playbook: 'Playbook', account: 'Account',
};

export function MobileCrm() {
  const [mode, setMode] = useState<Mode>('field');
  const [screen, setScreen] = useState<ScreenKey>('ops-summary');
  const [drawer, setDrawer] = useState(false);
  const [job, setJob] = useState<DemoJob | null>(null);

  const flip = (m: Mode) => { setMode(m); setScreen(m === 'office' ? 'my-review' : 'ops-summary'); setJob(null); setDrawer(false); };
  const navItems = mode === 'field' ? FIELD_NAV : OFFICE_NAV;

  return (
    <div className="crm-phone-stage">
      <div className="crm-phone">
        <div className="crm-phone-header">
          <button className="crm-phone-iconbtn" onClick={() => setDrawer(true)} aria-label="Menu">☰</button>
          <span className="crm-phone-title" style={{ flex: 1 }}>{job ? job.jobNumber : TITLES[screen]}</span>
          <button className="crm-phone-iconbtn" onClick={() => { setScreen('account'); setJob(null); }} aria-label="Account">👤</button>
        </div>

        <div className="crm-phone-body">
          {job ? <MJobDetail job={job} onBack={() => setJob(null)} />
            : <MScreen screen={screen} onPick={(j) => setJob(j)} />}
        </div>

        {drawer && (
          <>
            <div className="crm-drawer-overlay" onClick={() => setDrawer(false)} />
            <div className="crm-drawer">
              <div className="crm-drawer-head">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: NAVY, letterSpacing: 0.5 }}>PDQ</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Restoration</span>
                </div>
                <div className="crm-mode-flip">
                  {(['office', 'field'] as Mode[]).map((m) => (
                    <button key={m} className={mode === m ? 'active' : ''} onClick={() => flip(m)}>{m === 'office' ? 'Office' : 'Field'}</button>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', paddingTop: 8 }}>
                {navItems.map((it) => (
                  <button key={it.key} className={'crm-drawer-row' + (screen === it.key ? ' active' : '')}
                    onClick={() => { setScreen(it.key); setJob(null); setDrawer(false); }}>
                    <span style={{ width: 24 }}>{it.icon}</span>{it.label}
                  </button>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>
                {FOOTER_NAV.map((it) => (
                  <button key={it.key} className={'crm-drawer-row' + (screen === it.key ? ' active' : '')}
                    onClick={() => { setScreen(it.key); setJob(null); setDrawer(false); }}>
                    <span style={{ width: 24 }}>{it.icon}</span>{it.label}
                  </button>
                ))}
                <button className="crm-drawer-row" style={{ color: RED }} onClick={() => setDrawer(false)}>
                  <span style={{ width: 24 }}>↩︎</span>Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Phone primitives ─────────────────────────────────────────────────────────
function MStat({ label, value, color }: { label: string; value: ReactNode; color?: string }) {
  return (
    <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '12px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: color ?? NAVY }}>{value}</div>
      <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.3 }}>{label}</div>
    </div>
  );
}
function MStatusPill({ status }: { status: string }) {
  return <span style={{ background: STATUS_COLOR[status] ?? '#6b7280', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{STATUS_LABEL[status] ?? status}</span>;
}
function MSectionTitle({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, margin: '4px 2px 8px' }}>{children}</div>;
}
function pad(children: ReactNode) { return <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>; }

function JobCard({ job, onPick }: { job: DemoJob; onPick: (j: DemoJob) => void }) {
  return (
    <button className="crm-mcard" style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }} onClick={() => onPick(job)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: DIV_COLOR[job.division] }} />
        <span style={{ fontWeight: 700, color: NAVY, flex: 1 }}>{job.jobNumber}</span>
        <MStatusPill status={job.status} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{job.customer}</div>
      <div style={{ color: '#6b7280', marginTop: 2, fontSize: 13 }}>{DIV_LABEL[job.division]} · {job.city}, NJ</div>
    </button>
  );
}

// ── Screens ──────────────────────────────────────────────────────────────────
function MScreen({ screen, onPick }: { screen: ScreenKey; onPick: (j: DemoJob) => void }) {
  switch (screen) {
    case 'index': return <MyJobs onPick={onPick} mine />;
    case 'dispatch':
    case 'dispatch-office': return <MyJobs onPick={onPick} />;
    case 'ops-summary':
    case 'operations': return <MOpsSummary onPick={onPick} />;
    case 'my-review': return <MMyReview onPick={onPick} />;
    case 'company': return <MCompany />;
    case 'collections': return <MCollections onPick={onPick} />;
    case 'warehouse': return <MWarehouse />;
    case 'sales': return <MSales />;
    case 'job-management': return <MyJobs onPick={onPick} />;
    case 'truck-checklist': return <MTruckChecklist />;
    case 'compliance': return <MCompliance />;
    case 'pyscorp': return <MPyscorp />;
    case 'playbook': return <MPlaybook />;
    case 'account': return <MAccount />;
    default: return <div className="crm-empty">—</div>;
  }
}

function MyJobs({ onPick, mine }: { onPick: (j: DemoJob) => void; mine?: boolean }) {
  const [scope, setScope] = useState<'all' | 'mine'>(mine ? 'mine' : 'all');
  const [q, setQ] = useState('');
  const pool = useMemo(() => {
    const base = scope === 'mine' ? JOBS.filter((j) => j.supervisor === 'Carlos Reyes' || j.division === 'WTR').slice(0, 10) : JOBS.filter((j) => j.status !== 'closed' && j.status !== 'lost');
    const t = q.trim().toLowerCase();
    return t ? base.filter((j) => j.jobNumber.toLowerCase().includes(t) || j.customer.toLowerCase().includes(t)) : base;
  }, [scope, q]);
  return (
    <div>
      <div style={{ padding: 12, background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs or customers"
          style={{ background: '#f0f2f5', borderRadius: 10, padding: '10px 12px', border: 'none', outline: 'none' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'mine'] as const).map((s) => (
            <button key={s} onClick={() => setScope(s)} style={{ flex: 1, padding: 8, borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, background: scope === s ? NAVY : '#eef1f5', color: scope === s ? '#fff' : '#1a1a2e' }}>{s === 'all' ? 'All Jobs' : 'My Jobs'}</button>
          ))}
        </div>
      </div>
      {pad(pool.map((j) => <JobCard key={j.id} job={j} onPick={onPick} />))}
    </div>
  );
}

function MOpsSummary({ onPick }: { onPick: (j: DemoJob) => void }) {
  return pad(<>
    <div style={{ display: 'flex', gap: 8 }}>
      <MStat label="Pending" value={pendingSalesJobs().length} color="#b45309" />
      <MStat label="Active MIT" value={activeJobs().filter((j) => j.division !== 'REC').length} />
      <MStat label="Crews Out" value={6} color="#16a34a" />
    </div>
    <MSectionTitle>This Week's Measurables</MSectionTitle>
    {SCORECARD.slice(0, 5).map((m) => {
      const ok = measurableOnTarget(m);
      return (
        <div key={m.label} className="crm-mcard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div><div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div><div style={{ fontSize: 12, color: '#6b7280' }}>{m.owner}</div></div>
          <span style={{ fontSize: 18, fontWeight: 800, color: ok === false ? RED : '#16a34a' }}>{m.actual}{m.unit === '%' ? '%' : ''}</span>
        </div>
      );
    })}
    <MSectionTitle>Active Jobs</MSectionTitle>
    {activeJobs().slice(0, 6).map((j) => <JobCard key={j.id} job={j} onPick={onPick} />)}
  </>);
}

function MMyReview({ onPick }: { onPick: (j: DemoJob) => void }) {
  const [tasks, setTasks] = useState(COMPLIANCE_TASKS);
  return pad(<>
    <div style={{ display: 'flex', gap: 8 }}>
      <MStat label="My Jobs" value={12} />
      <MStat label="Tasks" value={tasks.filter((t) => !t.done).length} color="#b45309" />
      <MStat label="Rocks" value="3/4" color="#16a34a" />
    </div>
    <MSectionTitle>My Tasks Today</MSectionTitle>
    {tasks.map((t) => (
      <button key={t.id} className="crm-mcard" style={{ display: 'flex', gap: 10, alignItems: 'center', textAlign: 'left', cursor: 'pointer', width: '100%' }}
        onClick={() => setTasks((p) => p.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}>
        <span style={{ width: 20, height: 20, borderRadius: 10, border: '2px solid', borderColor: t.done ? '#16a34a' : '#cbd5e1', background: t.done ? '#16a34a' : '#fff', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>{t.done ? '✓' : ''}</span>
        <span style={{ flex: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 600, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#94a3b8' : '#0f172a', display: 'block' }}>{t.label}</span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.job} · {t.due}</span>
        </span>
      </button>
    ))}
    <MSectionTitle>Needs Attention</MSectionTitle>
    {collectionsRows().slice(0, 3).map((j) => <JobCard key={j.id} job={j} onPick={onPick} />)}
  </>);
}

function MCompany() {
  return pad(<>
    <div style={{ display: 'flex', gap: 8 }}>
      <MStat label="Wk Revenue" value={money(112400)} color="#059669" />
      <MStat label="Active" value={activeJobs().length + pendingSalesJobs().length} />
      <MStat label="Cycle" value="27d" color="#16a34a" />
    </div>
    <MSectionTitle>Company Scorecard</MSectionTitle>
    {SCORECARD.map((m) => {
      const ok = measurableOnTarget(m);
      return (
        <div key={m.label} className="crm-mcard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `4px solid ${ok == null ? '#cbd5e1' : ok ? '#22c55e' : '#ef4444'}` }}>
          <div><div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div><div style={{ fontSize: 12, color: '#6b7280' }}>Owner: {m.owner}</div></div>
          <span style={{ fontSize: 16, fontWeight: 800, color: ok === false ? RED : NAVY }}>{m.actual == null ? '—' : m.actual}{m.unit === '%' ? '%' : ''}</span>
        </div>
      );
    })}
  </>);
}

function MCollections({ onPick }: { onPick: (j: DemoJob) => void }) {
  const rows = collectionsRows();
  return pad(<>
    <div style={{ display: 'flex', gap: 8 }}>
      <MStat label="Open AR" value={money(rows.reduce((a, j) => a + j.balance, 0))} color={RED} />
      <MStat label=">45 Days" value={money(rows.filter((j) => j.daysOpen > 45).reduce((a, j) => a + j.balance, 0))} color="#b45309" />
      <MStat label="Invoices" value={rows.length} />
    </div>
    <MSectionTitle>Outstanding Balances</MSectionTitle>
    {rows.map((j) => (
      <button key={j.id} className="crm-mcard" style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }} onClick={() => onPick(j)}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, color: NAVY }}>{j.jobNumber}</span>
          <span style={{ fontWeight: 800, color: RED }}>{money(j.balance)}</span>
        </div>
        <div style={{ fontSize: 13, marginTop: 2 }}>{j.customer} · {j.carrier}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{j.daysOpen} days · {j.city}, NJ</div>
      </button>
    ))}
  </>);
}

function MWarehouse() {
  return pad(<>
    <div style={{ display: 'flex', gap: 8 }}>
      <MStat label="On Job" value={EQUIPMENT.reduce((a, e) => a + e.onJob, 0)} />
      <MStat label="Available" value={EQUIPMENT.reduce((a, e) => a + (e.total - e.onJob), 0)} color="#16a34a" />
      <MStat label="Bins" value="218/276" />
    </div>
    <MSectionTitle>Equipment Fleet</MSectionTitle>
    {EQUIPMENT.map((e) => (
      <div key={e.kind} className="crm-mcard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><div style={{ fontWeight: 600 }}>{e.label}</div><div style={{ fontSize: 12, color: '#6b7280' }}>{e.onJob} on job · {e.total - e.onJob} available</div></div>
        <span style={{ fontWeight: 800, color: NAVY }}>{e.total}</span>
      </div>
    ))}
  </>);
}

function MSales() {
  return pad(<>
    <div style={{ display: 'flex', gap: 8 }}>
      <MStat label="Signed" value={11} color="#16a34a" />
      <MStat label="Close %" value="38%" />
      <MStat label="STL" value="8m" color="#16a34a" />
    </div>
    <MSectionTitle>Pipeline by Rep</MSectionTitle>
    {['Michael Moughrabie', 'Hunter Halliburton', 'TJ Rozansky'].map((rep) => {
      const jobs = JOBS.filter((j) => j.marketing === rep);
      return (
        <div key={rep} className="crm-mcard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontWeight: 600 }}>{rep}</div><div style={{ fontSize: 12, color: '#6b7280' }}>{jobs.length} jobs</div></div>
          <span style={{ fontWeight: 800, color: '#059669' }}>{money(jobs.reduce((a, j) => a + j.estimate, 0))}</span>
        </div>
      );
    })}
  </>);
}

function MTruckChecklist() {
  const [items, setItems] = useState(
    ['Air movers (10)', 'LGR dehumidifier', 'Moisture meter', 'Thermal camera', 'Extraction wand', 'Antimicrobial', 'PPE kit', 'Cones & signage'].map((label) => ({ label, done: false })),
  );
  return pad(<>
    <MSectionTitle>Truck 7 — Morning Checklist</MSectionTitle>
    {items.map((it, i) => (
      <button key={it.label} className="crm-mcard" style={{ display: 'flex', gap: 10, alignItems: 'center', textAlign: 'left', cursor: 'pointer', width: '100%' }}
        onClick={() => setItems((p) => p.map((x, xi) => xi === i ? { ...x, done: !x.done } : x))}>
        <span style={{ width: 22, height: 22, borderRadius: 6, border: '2px solid', borderColor: it.done ? '#16a34a' : '#cbd5e1', background: it.done ? '#16a34a' : '#fff', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{it.done ? '✓' : ''}</span>
        <span style={{ fontWeight: 600, textDecoration: it.done ? 'line-through' : 'none', color: it.done ? '#94a3b8' : '#0f172a' }}>{it.label}</span>
      </button>
    ))}
    <button style={{ marginTop: 6, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Submit Checklist</button>
  </>);
}

function MCompliance() {
  return pad(<>
    <div style={{ display: 'flex', gap: 8 }}>
      <MStat label="Open" value={COMPLIANCE_TASKS.filter((t) => !t.done).length} color="#b45309" />
      <MStat label="Overdue" value={COMPLIANCE_TASKS.filter((t) => t.due === 'overdue').length} color={RED} />
      <MStat label="Workflows" value={94} />
    </div>
    <MSectionTitle>Tasks Assigned To Me</MSectionTitle>
    {COMPLIANCE_TASKS.filter((t) => !t.done).map((t) => (
      <div key={t.id} className="crm-mcard">
        <div style={{ fontWeight: 600 }}>{t.label}</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{t.job} · {t.role}</div>
        <div style={{ marginTop: 6 }}>{t.due === 'overdue' ? <span style={{ background: RED, color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>Overdue</span> : <span style={{ fontSize: 12, color: '#94a3b8' }}>Due {t.due}</span>}</div>
      </div>
    ))}
  </>);
}

function MPyscorp() {
  const [gallons, setGallons] = useState(500);
  const cost = (gallons * 0.42).toFixed(2);
  return pad(<>
    <MSectionTitle>Pyscorp Water Damage Calculator</MSectionTitle>
    <div className="crm-mcard">
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Estimated water extracted (gallons)</div>
      <input type="range" min={50} max={2000} value={gallons} onChange={(e) => setGallons(Number(e.target.value))} style={{ width: '100%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        <span style={{ fontWeight: 700 }}>{gallons} gal</span>
        <span style={{ fontWeight: 800, color: '#059669' }}>${cost}</span>
      </div>
    </div>
    <div className="crm-mcard">
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Recommended drying setup</div>
      <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
        Air movers: <strong>{Math.ceil(gallons / 50)}</strong><br />
        LGR dehumidifiers: <strong>{Math.ceil(gallons / 250)}</strong><br />
        Est. dry time: <strong>{Math.max(3, Math.ceil(gallons / 200))} days</strong>
      </div>
    </div>
  </>);
}

function MPlaybook() {
  return pad(<>
    <MSectionTitle>Field Playbook</MSectionTitle>
    {['Water Mitigation SOP', 'Mold Remediation SOP', 'Customer Authorization Steps', 'Daily Monitoring Checklist', 'Equipment Handling'].map((p) => (
      <div key={p} className="crm-mcard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600 }}>{p}</span><span style={{ color: '#94a3b8' }}>›</span>
      </div>
    ))}
  </>);
}

function MAccount() {
  return pad(<>
    <div className="crm-mcard" style={{ textAlign: 'center', padding: 20 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: NAVY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, margin: '0 auto 10px' }}>CR</div>
      <div style={{ fontWeight: 700, fontSize: 18 }}>Carlos Reyes</div>
      <div style={{ color: '#6b7280', fontSize: 13 }}>Field Supervisor · PDQ Restoration</div>
    </div>
    {['Notifications', 'Office / Field default', 'Sync status', 'Help & Support'].map((r) => (
      <div key={r} className="crm-mcard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600 }}>{r}</span><span style={{ color: '#94a3b8' }}>›</span>
      </div>
    ))}
  </>);
}

function MJobDetail({ job, onBack }: { job: DemoJob; onBack: () => void }) {
  return (
    <div>
      <div style={{ background: '#fff', padding: 14, borderBottom: '1px solid #e5e7eb' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: NAVY, fontWeight: 700, cursor: 'pointer', padding: 0, marginBottom: 8 }}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: DIV_COLOR[job.division] }} />
          <span style={{ fontWeight: 700, color: NAVY }}>{job.jobNumber}</span>
          <MStatusPill status={job.status} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{job.customer}</div>
        <div style={{ color: '#6b7280', fontSize: 13 }}>{job.address}, {job.city}, NJ</div>
      </div>
      {pad(<>
        <div style={{ display: 'flex', gap: 8 }}>
          <MStat label="Estimate" value={money(job.estimate)} color="#059669" />
          <MStat label="Balance" value={money(balanceDue(job))} color={balanceDue(job) > 0 ? RED : '#16a34a'} />
          <MStat label="Photos" value={job.photos} />
        </div>
        <MSectionTitle>Photos</MSectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ aspectRatio: '1', borderRadius: 8, background: 'linear-gradient(135deg,#dbeafe,#e0e7ff)' }} />)}
        </div>
        <MSectionTitle>Recent Notes</MSectionTitle>
        <div className="crm-mcard"><div style={{ fontSize: 13 }}>Set 3 air movers + 1 LGR dehu. Moisture at baseboard 38%.</div><div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{job.supervisor} · 8:46 AM</div></div>
        <div className="crm-mcard"><div style={{ fontSize: 13 }}>Customer signed authorization to perform.</div><div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>System · 8:31 AM</div></div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button style={{ flex: 1, background: '#eef1f5', color: NAVY, border: 'none', borderRadius: 10, padding: 12, fontWeight: 700, cursor: 'pointer' }}>+ Note</button>
          <button style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: 12, fontWeight: 700, cursor: 'pointer' }}>+ Photo</button>
        </div>
      </>)}
    </div>
  );
}
