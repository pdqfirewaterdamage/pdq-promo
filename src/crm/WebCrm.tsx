import { useState, type ReactNode } from 'react';
import {
  JOBS, DIVISIONS, DIV_LABEL, STATUS_LABEL, SCORECARD, measurableOnTarget, EQUIPMENT,
  ADJUSTERS, CARRIER_LIST, LEAD_SOURCES, PLUMBERS, ALERTS, COMPLIANCE_TASKS, BILLING_QA,
  money, balanceDue, activeJobs, pendingSalesJobs, jobsByStatus,
  jobsByDivision, collectionsRows, MARKETING, type DemoJob,
} from './data';
import {
  PageHead, StatCard, StatRow, JobsTable, Card, DivisionDot, StatusPill, DayBadge, Bar,
  Empty, AR_COLS, type Column,
} from './ui';

// ── Navigation (mirrors the real _app.tsx NAV) ──────────────────────────────
type Section =
  | 'my-day' | 'jobs' | 'operations' | 'rebuild' | 'warehouse' | 'collections'
  | 'insurance-adjusting' | 'sales' | 'alert-page' | 'plumber-manager'
  | 'marketing' | 'company-overview' | 'compliance' | 'admin';

const NAV: { key: Section; label: string }[] = [
  { key: 'my-day', label: 'My Day' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'operations', label: 'Operations' },
  { key: 'rebuild', label: 'Rebuild' },
  { key: 'warehouse', label: 'Warehouse' },
  { key: 'collections', label: 'Collections' },
  { key: 'insurance-adjusting', label: 'Insurance Adjusting' },
  { key: 'sales', label: 'Sales' },
  { key: 'alert-page', label: 'Alert Page' },
  { key: 'plumber-manager', label: 'Plumber Manager' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'company-overview', label: 'Company' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'admin', label: 'Admin' },
];

// ── Dashboard tab registries (mirror lib/dashboards.tsx) ─────────────────────
const TABS: Record<string, { key: string; label: string }[]> = {
  operations: [
    { key: 'summary', label: 'Summary' },
    { key: 'dispatch', label: 'Dispatch' },
    { key: 'pending-sales', label: 'Pending Sales' },
    { key: 'active-jobs', label: 'Active Jobs' },
    { key: 'work-day-planner', label: 'Work Day Planner' },
    { key: 'equipment-tracking', label: 'Equipment Tracking' },
  ],
  rebuild: [
    { key: 'summary', label: 'Summary' },
    { key: 'estimates-to-be-written', label: 'Estimates to be Written' },
    { key: 'estimates-waiting-approval', label: 'Estimates Waiting for Approval' },
    { key: 'active', label: 'Active REC Jobs' },
    { key: 'work-day-planner', label: 'Rebuild Work Day Planner' },
  ],
  warehouse: [
    { key: 'status', label: 'Summary' },
    { key: 'expected-revenue', label: 'Expected Revenue' },
    { key: 'packout-planner', label: 'Packout Planner' },
    { key: 'inventory', label: 'Inventory Management' },
    { key: 'inventory-system', label: 'Inventory System' },
    { key: 'left-rack', label: 'Left Rack' },
    { key: 'right-rack', label: 'Right Rack' },
    { key: 'shared-space', label: 'Shared Space' },
  ],
  collections: [
    { key: 'company-status', label: 'Company Collection Status' },
    { key: 'invoices-0-45', label: '0–45 Day Invoices' },
    { key: 'invoices-45-plus', label: '45+ Day Invoices' },
    { key: 'waiting-for-closure', label: 'Waiting for Final Closure' },
  ],
  'insurance-adjusting': [
    { key: 'adjusters', label: 'Adjuster Directory' },
    { key: 'carriers', label: 'Carrier Directory' },
    { key: 'insight', label: 'Carrier Insights' },
    { key: 'adjustment-analysis', label: 'Adjustment Analysis' },
    { key: 'rebuttal-assistant', label: 'Rebuttals' },
  ],
  sales: [
    { key: 'overview', label: 'Overview' },
    { key: 'closing-ratios', label: 'Company Closing Ratios' },
    { key: 'commission', label: 'Commission Report' },
    { key: 'michael-moughrabie', label: 'Michael Moughrabie' },
    { key: 'hunter-halliburton', label: 'Hunter Halliburton' },
  ],
  marketing: [
    { key: 'summary', label: 'Summary' },
    ...LEAD_SOURCES.map((s) => ({ key: s.slug, label: s.label })),
  ],
  'company-overview': [
    { key: 'overview', label: 'Overview' },
    { key: 'brain', label: 'Company Brain' },
    { key: 'ninety-io', label: 'Measurables' },
    { key: 'financials', label: 'Financials' },
    { key: 'labor', label: 'Labor' },
    { key: 'cycle-time', label: 'Cycle Time' },
    { key: 'hr', label: 'HR' },
    { key: 'dashboard-utilization', label: 'Dashboard Utilization' },
  ],
};

const DASH_LABEL: Record<string, string> = {
  operations: 'Operations', rebuild: 'Rebuild', warehouse: 'Warehouse', collections: 'Collections',
  'insurance-adjusting': 'Insurance Adjusting', sales: 'Sales', marketing: 'Marketing', 'company-overview': 'Company',
};

// ── Shell ────────────────────────────────────────────────────────────────────
export function WebCrm() {
  const [section, setSection] = useState<Section>('operations');
  const [tab, setTab] = useState<string>('summary');
  const [job, setJob] = useState<DemoJob | null>(null);

  const go = (s: Section) => {
    setSection(s);
    setJob(null);
    setTab(TABS[s]?.[0]?.key ?? '');
  };
  const openJob = (j: DemoJob) => { setJob(j); };

  return (
    <div className="crm-shell">
      <aside className="crm-sidebar">
        <div className="crm-brand">
          <span className="crm-brand-mark" />
          <span>
            <span className="crm-brand-text">PDQ</span>
            <span className="crm-brand-sub" style={{ display: 'block' }}>Restoration CRM</span>
          </span>
        </div>
        <nav className="crm-sidenav">
          {NAV.map((n) => (
            <button key={n.key} className={'crm-navitem' + (section === n.key ? ' active' : '')} onClick={() => go(n.key)}>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="crm-sidebar-foot">
          <button className="crm-btn crm-btn-primary" style={{ width: '100%' }}>+ Quick Create</button>
          <span className="crm-user">demo@pdqrestoration.com</span>
        </div>
      </aside>

      <main className="crm-content">
        {job ? (
          <JobDetail job={job} onBack={() => setJob(null)} />
        ) : (
          <SectionView section={section} tab={tab} setTab={setTab} openJob={openJob} />
        )}
      </main>
    </div>
  );
}

function SectionView({ section, tab, setTab, openJob }: {
  section: Section; tab: string; setTab: (k: string) => void; openJob: (j: DemoJob) => void;
}) {
  // Dashboards with tab strips
  if (TABS[section]) {
    return (
      <>
        <PageHead title={DASH_LABEL[section]} tabs={TABS[section]} active={tab} onTab={setTab}
          right={<PlaybookBtn label={DASH_LABEL[section]} />} />
        <div className="crm-body">{renderDashboardTab(section, tab, openJob)}</div>
      </>
    );
  }
  // Standalone sections
  if (section === 'jobs') return <JobsSection openJob={openJob} />;
  if (section === 'my-day') return <MyDay />;
  if (section === 'alert-page') return <AlertPage />;
  if (section === 'plumber-manager') return <PlumberManager />;
  if (section === 'compliance') return <Compliance />;
  if (section === 'admin') return <Admin />;
  return null;
}

function PlaybookBtn({ label }: { label: string }) {
  return <button className="crm-btn" style={{ background: '#2563eb', color: '#fff' }}>📖 {label} Playbook</button>;
}

// ── Dashboard tab content router ─────────────────────────────────────────────
function renderDashboardTab(section: string, tab: string, openJob: (j: DemoJob) => void): ReactNode {
  const key = `${section}/${tab}`;
  switch (key) {
    // Operations
    case 'operations/summary': return <OperationsSummary openJob={openJob} />;
    case 'operations/dispatch': return <Dispatch openJob={openJob} />;
    case 'operations/pending-sales': return <JobsTable jobs={pendingSalesJobs()} onPick={openJob} columns={PENDING_COLS} />;
    case 'operations/active-jobs': return <JobsTable jobs={activeJobs()} onPick={openJob} />;
    case 'operations/work-day-planner': return <WorkDayPlanner />;
    case 'operations/equipment-tracking': return <EquipmentTracking />;
    // Rebuild
    case 'rebuild/summary': return <RebuildSummary openJob={openJob} />;
    case 'rebuild/estimates-to-be-written': return <JobsTable jobs={jobsByDivision('REC').filter((j) => j.status === 'pre_production' || j.status === 'pending_sales')} onPick={openJob} columns={EST_COLS} />;
    case 'rebuild/estimates-waiting-approval': return <JobsTable jobs={jobsByDivision('REC').filter((j) => j.status === 'pending_sales')} onPick={openJob} columns={EST_COLS} />;
    case 'rebuild/active': return <JobsTable jobs={jobsByDivision('REC').filter((j) => j.status === 'work_in_progress' || j.status === 'pre_production')} onPick={openJob} />;
    case 'rebuild/work-day-planner': return <WorkDayPlanner rebuild />;
    // Warehouse
    case 'warehouse/status': return <WarehouseStatus />;
    case 'warehouse/expected-revenue': return <WarehouseExpectedRevenue />;
    case 'warehouse/packout-planner': return <JobsTable jobs={JOBS.filter((j) => j.division === 'CPO' || j.division === 'CON')} onPick={openJob} columns={PACKOUT_COLS} />;
    case 'warehouse/inventory': return <WarehouseInventory />;
    case 'warehouse/inventory-system': return <WarehouseInventory system />;
    case 'warehouse/left-rack': return <WarehouseRack name="Left Rack" prefix="L" />;
    case 'warehouse/right-rack': return <WarehouseRack name="Right Rack" prefix="R" />;
    case 'warehouse/shared-space': return <WarehouseRack name="Shared Space" prefix="S" />;
    // Collections
    case 'collections/company-status': return <CollectionsStatus />;
    case 'collections/invoices-0-45': return <JobsTable jobs={collectionsRows().filter((j) => j.daysOpen <= 45)} onPick={openJob} columns={AR_COLS} />;
    case 'collections/invoices-45-plus': return <JobsTable jobs={collectionsRows().filter((j) => j.daysOpen > 45)} onPick={openJob} columns={AR_COLS} />;
    case 'collections/waiting-for-closure': return <JobsTable jobs={jobsByStatus('waiting_to_close')} onPick={openJob} columns={AR_COLS} />;
    // Insurance adjusting
    case 'insurance-adjusting/adjusters': return <AdjusterDirectory />;
    case 'insurance-adjusting/carriers': return <CarrierDirectory />;
    case 'insurance-adjusting/insight': return <CarrierInsights />;
    case 'insurance-adjusting/adjustment-analysis': return <AdjustmentAnalysis />;
    case 'insurance-adjusting/rebuttal-assistant': return <RebuttalAssistant />;
    // Sales
    case 'sales/overview': return <SalesOverview />;
    case 'sales/closing-ratios': return <ClosingRatios />;
    case 'sales/commission': return <Commission />;
    case 'sales/michael-moughrabie': return <SalespersonTab name="Michael Moughrabie" />;
    case 'sales/hunter-halliburton': return <SalespersonTab name="Hunter Halliburton" />;
    // Marketing
    case 'marketing/summary': return <MarketingSummary />;
    // Company
    case 'company-overview/overview': return <CompanyOverview />;
    case 'company-overview/brain': return <CompanyBrain />;
    case 'company-overview/ninety-io': return <Measurables />;
    case 'company-overview/financials': return <Financials />;
    case 'company-overview/labor': return <Labor />;
    case 'company-overview/cycle-time': return <CycleTime />;
    case 'company-overview/hr': return <HrTab />;
    case 'company-overview/dashboard-utilization': return <DashboardUtilization />;
    default:
      // Marketing lead-source tabs
      if (section === 'marketing') {
        const src = LEAD_SOURCES.find((s) => s.slug === tab);
        if (src) return <LeadSourceTab src={src} />;
      }
      return <Empty>This tab is part of the demo navigation.</Empty>;
  }
}

// ── Column presets ───────────────────────────────────────────────────────────
const PENDING_COLS: Column[] = [
  { key: 'jobNumber', label: 'Job #', render: (j) => <span className="cell-job-number col-mono">{j.jobNumber}</span> },
  { key: 'customer', label: 'Customer', render: (j) => <strong>{j.customer}</strong> },
  { key: 'division', label: 'Division', render: (j) => <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><DivisionDot code={j.division} />{j.division}</span> },
  { key: 'marketing', label: 'Sales Rep' },
  { key: 'daysOpen', label: 'Days Pending', render: (j) => <DayBadge days={j.daysOpen} /> },
  { key: 'estimate', label: 'Est. Value', money: true, render: (j) => <span className="cell-money">{money(j.estimate)}</span> },
];
const EST_COLS: Column[] = [
  { key: 'jobNumber', label: 'Job #', render: (j) => <span className="cell-job-number col-mono">{j.jobNumber}</span> },
  { key: 'customer', label: 'Customer', render: (j) => <strong>{j.customer}</strong> },
  { key: 'city', label: 'City', render: (j) => `${j.city}, NJ` },
  { key: 'supervisor', label: 'Estimator' },
  { key: 'daysOpen', label: 'Age', render: (j) => <DayBadge days={j.daysOpen} /> },
  { key: 'estimate', label: 'Est. Value', money: true, render: (j) => <span className="cell-money">{money(j.estimate)}</span> },
];
const PACKOUT_COLS: Column[] = [
  { key: 'jobNumber', label: 'Job #', render: (j) => <span className="cell-job-number col-mono">{j.jobNumber}</span> },
  { key: 'customer', label: 'Customer', render: (j) => <strong>{j.customer}</strong> },
  { key: 'city', label: 'City', render: (j) => `${j.city}, NJ` },
  { key: 'status', label: 'Status', render: (j) => <StatusPill status={j.status} /> },
  { key: 'photos', label: 'Items', render: (j) => `${j.photos} boxes` },
];

// ============================================================================
// OPERATIONS
// ============================================================================
function OperationsSummary({ openJob }: { openJob: (j: DemoJob) => void }) {
  const pending = pendingSalesJobs();
  const activeMit = JOBS.filter((j) => ['pre_production', 'work_in_progress'].includes(j.status) && j.division !== 'REC');
  const supervisors = Array.from(new Set(JOBS.map((j) => j.supervisor))).filter((s) => s !== 'No Supervisor');
  const revenue = JOBS.reduce((a, j) => a + j.invoiced, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <StatRow>
        <StatCard label="Pending Sales" value={pending.length} accent="yellow" />
        <StatCard label="Active MIT Jobs" value={activeMit.length} accent="blue" />
        <StatCard label="Invoiced (active)" value={money(revenue)} kind="money" />
        <StatCard label="Avg Job Size" value={money(Math.round(JOBS.reduce((a, j) => a + j.estimate, 0) / JOBS.length))} />
      </StatRow>

      <Card title="Supervisor Workload">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {supervisors.map((sup) => {
            const ps = pending.filter((j) => j.supervisor === sup).length;
            const mit = activeMit.filter((j) => j.supervisor === sup).length;
            return (
              <div key={sup} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{sup}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#b45309' }}>{ps}</div>
                    <div style={{ fontSize: 10, color: '#9a3412', textTransform: 'uppercase', fontWeight: 700 }}>Pending</div>
                  </div>
                  <div style={{ flex: 1, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#032e5b' }}>{mit}</div>
                    <div style={{ fontSize: 10, color: '#1e3a8a', textTransform: 'uppercase', fontWeight: 700 }}>Active MIT</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Operations Measurables (this week)">
        <MeasurableGrid only={['Weekly Revenue', 'Jobs Signed', 'Jobs Completed', 'Cycle Time (median, days)', 'Avg Speed to Lead']} />
      </Card>

      <Card title="Active Jobs">
        <JobsTable jobs={activeJobs()} onPick={openJob} searchable={false} />
      </Card>
    </div>
  );
}

function Dispatch({ openJob }: { openJob: (j: DemoJob) => void }) {
  const today = JOBS.filter((j) => ['pre_production', 'work_in_progress', 'pending_sales'].includes(j.status)).slice(0, 14);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Jobs on the Board" value={today.length} />
        <StatCard label="High Priority" value={today.filter((j) => j.priority === 'High').length} accent="red" />
        <StatCard label="Crews Out" value={6} />
        <StatCard label="Trucks Dispatched" value={9} />
      </StatRow>
      <Card title="Today's Dispatch Board" pad={false}>
        <JobsTable jobs={today} onPick={openJob} columns={[
          { key: 'jobNumber', label: 'Job #', render: (j) => <span className="cell-job-number col-mono">{j.jobNumber}</span> },
          { key: 'customer', label: 'Customer', render: (j) => <strong>{j.customer}</strong> },
          { key: 'address', label: 'Address', render: (j) => `${j.address}, ${j.city}` },
          { key: 'division', label: 'Division', render: (j) => <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><DivisionDot code={j.division} />{j.division}</span> },
          { key: 'supervisor', label: 'Crew Lead' },
          { key: 'priority', label: 'Priority', render: (j) => j.priority === 'High' ? <span style={{ color: '#dc2626', fontWeight: 700 }}>● High</span> : 'Normal' },
        ]} />
      </Card>
    </div>
  );
}

function WorkDayPlanner({ rebuild }: { rebuild?: boolean }) {
  const pool = rebuild ? jobsByDivision('REC') : activeJobs();
  const crews = ['Crew A', 'Crew B', 'Crew C', 'Crew D'];
  return (
    <div>
      <p className="crm-muted" style={{ marginBottom: 12 }}>Drag-and-drop crew planner — assign {rebuild ? 'rebuild' : 'mitigation'} jobs to a crew and day. (Demo view)</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {crews.map((c, ci) => (
          <Card key={c} title={c}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pool.filter((_, i) => i % crews.length === ci).slice(0, 4).map((j) => (
                <div key={j.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><DivisionDot code={j.division} /><strong style={{ fontSize: 13 }}>{j.jobNumber}</strong></div>
                  <div style={{ fontSize: 12, color: '#475569' }}>{j.customer} · {j.city}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EquipmentTracking() {
  const onJob = EQUIPMENT.reduce((a, e) => a + e.onJob, 0);
  const total = EQUIPMENT.reduce((a, e) => a + e.total, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Total Assets" value={total} />
        <StatCard label="On Job Sites" value={onJob} accent="blue" />
        <StatCard label="In Warehouse" value={total - onJob} accent="green" />
        <StatCard label="Utilization" value={`${Math.round((onJob / total) * 100)}%`} />
      </StatRow>
      <Card title="Fleet by Equipment Type" pad={false}>
        <table className="crm-table">
          <thead><tr><th>Equipment</th><th>Total</th><th>On Job</th><th>Available</th><th style={{ width: 200 }}>Utilization</th></tr></thead>
          <tbody>
            {EQUIPMENT.map((e) => (
              <tr key={e.kind}>
                <td><strong>{e.label}</strong></td>
                <td>{e.total}</td>
                <td>{e.onJob}</td>
                <td>{e.total - e.onJob}</td>
                <td><Bar value={e.onJob} max={e.total} color={e.onJob / e.total > 0.6 ? '#f97316' : '#22c55e'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ============================================================================
// REBUILD
// ============================================================================
function RebuildSummary({ openJob }: { openJob: (j: DemoJob) => void }) {
  const rec = jobsByDivision('REC');
  const toWrite = rec.filter((j) => j.status === 'pre_production' || j.status === 'pending_sales');
  const active = rec.filter((j) => j.status === 'work_in_progress');
  const pipeline = rec.reduce((a, j) => a + j.estimate, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="REC Jobs" value={rec.length} />
        <StatCard label="Estimates to Write" value={toWrite.length} accent="yellow" />
        <StatCard label="Active Rebuilds" value={active.length} accent="blue" />
        <StatCard label="Pipeline Value" value={money(pipeline)} kind="money" />
      </StatRow>
      <Card title="Reconstruction Pipeline" pad={false}>
        <JobsTable jobs={rec} onPick={openJob} columns={EST_COLS} />
      </Card>
    </div>
  );
}

// ============================================================================
// WAREHOUSE
// ============================================================================
function WarehouseStatus() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Packout Jobs On-Site" value={JOBS.filter((j) => j.division === 'CPO').length} />
        <StatCard label="Storage Bins Used" value="218 / 276" accent="blue" />
        <StatCard label="Monthly Storage Billed" value={money(4280)} kind="money" />
        <StatCard label="Pending Pack-Backs" value={4} accent="yellow" />
      </StatRow>
      <Card title="Warehouse Areas">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 12 }}>
          {['Left Rack', 'Right Rack', 'Shared Space', 'Staging'].map((a, i) => (
            <div key={a} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 }}>
              <div style={{ fontWeight: 700 }}>{a}</div>
              <Bar value={[68, 74, 52, 41][i]} max={100} color="#2563eb" />
              <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{[68, 74, 52, 41][i]}% full</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
function WarehouseExpectedRevenue() {
  const rows = JOBS.filter((j) => j.division === 'CPO' || j.division === 'CON').slice(0, 8);
  return (
    <Card title="Expected Contents Revenue" pad={false}>
      <table className="crm-table">
        <thead><tr><th>Job #</th><th>Customer</th><th>Storage Mos.</th><th className="col-money">Monthly</th><th className="col-money">Expected</th></tr></thead>
        <tbody>
          {rows.map((j, i) => (
            <tr key={j.id}>
              <td className="cell-job-number col-mono">{j.jobNumber}</td>
              <td><strong>{j.customer}</strong></td>
              <td>{2 + (i % 5)}</td>
              <td className="col-money">{money(280 + i * 40)}</td>
              <td className="col-money cell-money">{money((280 + i * 40) * (2 + (i % 5)))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
function WarehouseInventory({ system }: { system?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {system && <p className="crm-muted">Barcode/QR scan-driven inventory system — scan an asset to check it in or out. (Demo view)</p>}
      <Card title={system ? 'Inventory System — Scannable Assets' : 'Inventory Management'} pad={false}>
        <table className="crm-table">
          <thead><tr><th>Asset Tag</th><th>Equipment</th><th>Status</th><th>Location</th></tr></thead>
          <tbody>
            {EQUIPMENT.flatMap((e, ei) => Array.from({ length: 3 }, (_, i) => (
              <tr key={`${e.kind}-${i}`}>
                <td className="col-mono">PDQ-{e.kind.slice(0, 3).toUpperCase()}-{100 + ei * 10 + i}</td>
                <td>{e.label.replace(/s$/, '')}</td>
                <td>{i === 0 ? <span className="crm-pill" style={{ background: '#2563eb' }}>On Job</span> : <span className="crm-pill" style={{ background: '#16a34a' }}>Available</span>}</td>
                <td>{i === 0 ? 'Job site' : `Rack ${['L', 'R', 'S'][i % 3]}-${ei + 1}`}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
function WarehouseRack({ name, prefix }: { name: string; prefix: string }) {
  return (
    <Card title={`${name} — Bin Map`}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8 }}>
        {Array.from({ length: 24 }, (_, i) => {
          const used = (i * 7) % 5 !== 0;
          return (
            <div key={i} style={{
              border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 8px', textAlign: 'center',
              background: used ? '#eff6ff' : '#f8fafc', color: used ? '#1e3a8a' : '#94a3b8',
            }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{prefix}{String(i + 1).padStart(2, '0')}</div>
              <div style={{ fontSize: 10 }}>{used ? 'In use' : 'Empty'}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ============================================================================
// COLLECTIONS
// ============================================================================
function CollectionsStatus() {
  const rows = collectionsRows();
  const totalAr = rows.reduce((a, j) => a + j.balance, 0);
  const over45 = rows.filter((j) => j.daysOpen > 45).reduce((a, j) => a + j.balance, 0);
  const collected = JOBS.reduce((a, j) => a + j.paid, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Total Open AR" value={money(totalAr)} kind="danger" />
        <StatCard label="AR > 45 Days" value={money(over45)} accent="red" />
        <StatCard label="Cash Collected (wk)" value={money(collected)} kind="money" />
        <StatCard label="Open Invoices" value={rows.length} />
      </StatRow>
      <Card title="Collection Status by Account" pad={false}>
        <JobsTable jobs={rows} columns={AR_COLS} searchable={false} />
      </Card>
    </div>
  );
}

// ============================================================================
// INSURANCE ADJUSTING
// ============================================================================
function AdjusterDirectory() {
  return (
    <Card title="Adjuster Directory" pad={false}>
      <table className="crm-table">
        <thead><tr><th>Adjuster</th><th>Carrier</th><th>Open Claims</th><th>Avg Supplement</th><th style={{ width: 180 }}>Approval Rate</th></tr></thead>
        <tbody>
          {ADJUSTERS.map((a) => (
            <tr key={a.name}>
              <td><strong>{a.name}</strong></td>
              <td>{a.carrier}</td>
              <td>{a.openClaims}</td>
              <td>{Math.round(a.avgSupplement * 100)}%</td>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Bar value={a.approvalRate * 100} max={100} color={a.approvalRate > 0.75 ? '#22c55e' : '#f97316'} /><span style={{ fontSize: 12 }}>{Math.round(a.approvalRate * 100)}%</span></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
function CarrierDirectory() {
  return (
    <Card title="Carrier Directory" pad={false}>
      <table className="crm-table">
        <thead><tr><th>Carrier</th><th>Open Claims</th><th>Adjusters</th><th className="col-money">Open AR</th></tr></thead>
        <tbody>
          {CARRIER_LIST.map((c, i) => {
            const claims = ADJUSTERS.filter((a) => a.carrier === c);
            const open = claims.reduce((a, x) => a + x.openClaims, 0) || (3 + (i % 6));
            return (
              <tr key={c}>
                <td><strong>{c}</strong></td>
                <td>{open}</td>
                <td>{claims.length || 1}</td>
                <td className="col-money cell-balance-due">{money(open * 4200)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
function CarrierInsights() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Avg Approval Rate" value="76%" accent="green" />
        <StatCard label="Avg Supplement" value="17%" />
        <StatCard label="Avg Days to Pay" value="38" accent="yellow" />
        <StatCard label="Denials This Qtr" value={6} accent="red" />
      </StatRow>
      <Card title="Approval Rate by Carrier">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ADJUSTERS.map((a) => (
            <div key={a.name} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 48px', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{a.carrier}</span>
              <Bar value={a.approvalRate * 100} max={100} color={a.approvalRate > 0.75 ? '#22c55e' : '#f97316'} />
              <span style={{ fontSize: 12, textAlign: 'right' }}>{Math.round(a.approvalRate * 100)}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
function AdjustmentAnalysis() {
  return (
    <Card title="Adjustment Analysis — Estimate vs. Settlement" pad={false}>
      <table className="crm-table">
        <thead><tr><th>Job #</th><th>Carrier</th><th className="col-money">Our Estimate</th><th className="col-money">Carrier Offer</th><th className="col-money">Gap</th><th>Status</th></tr></thead>
        <tbody>
          {JOBS.filter((j) => j.invoiced > 0).slice(0, 8).map((j, i) => {
            const offer = Math.round(j.estimate * (0.78 + (i % 4) * 0.06));
            const gap = j.estimate - offer;
            return (
              <tr key={j.id}>
                <td className="cell-job-number col-mono">{j.jobNumber}</td>
                <td>{j.carrier}</td>
                <td className="col-money">{money(j.estimate)}</td>
                <td className="col-money">{money(offer)}</td>
                <td className="col-money cell-balance-due">{money(gap)}</td>
                <td>{gap > 3000 ? <span className="crm-pill" style={{ background: '#dc2626' }}>Rebuttal</span> : <span className="crm-pill" style={{ background: '#16a34a' }}>Accept</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
function RebuttalAssistant() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="✨ AI Rebuttal Assistant">
        <p className="crm-muted" style={{ marginBottom: 12 }}>Drafts insurance-denial rebuttals grounded in PDQ's denial library, citing IICRC standards and Xactimate line items.</p>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Denial: "Antimicrobial application not warranted"</div>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            Per <strong>IICRC S500</strong> Section 12.2.1, antimicrobial application is appropriate where Category 2/3 water
            has affected porous materials. Moisture logs (06/22–06/25) document elevated readings at the affected
            baseboard, and the loss originated from a sewage backup (Cat 3). The line item <span className="col-mono">WTR DRYHA&gt;</span> is
            consistent with the documented scope and should be reinstated.
          </p>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="crm-btn crm-btn-primary">Generate rebuttal</button>
            <button className="crm-btn crm-btn-ghost">Copy</button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// SALES
// ============================================================================
function SalesOverview() {
  const signed = JOBS.filter((j) => j.status !== 'lost' && j.status !== 'pending_sales');
  const byRep = MARKETING.map((rep) => ({
    rep,
    jobs: JOBS.filter((j) => j.marketing === rep).length,
    revenue: JOBS.filter((j) => j.marketing === rep).reduce((a, j) => a + j.estimate, 0),
  }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Jobs Signed (MTD)" value={signed.length} accent="green" />
        <StatCard label="Closing Ratio" value="38%" />
        <StatCard label="Avg Speed to Lead" value="8 min" accent="green" />
        <StatCard label="Pipeline" value={money(JOBS.reduce((a, j) => a + j.estimate, 0))} kind="money" />
      </StatRow>
      <Card title="By Sales Rep" pad={false}>
        <table className="crm-table">
          <thead><tr><th>Rep</th><th>Jobs</th><th className="col-money">Revenue</th><th style={{ width: 200 }}>Share</th></tr></thead>
          <tbody>
            {byRep.map((r) => (
              <tr key={r.rep}><td><strong>{r.rep}</strong></td><td>{r.jobs}</td><td className="col-money cell-money">{money(r.revenue)}</td>
                <td><Bar value={r.revenue} max={Math.max(...byRep.map((x) => x.revenue))} /></td></tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
function ClosingRatios() {
  return (
    <Card title="Company Closing Ratios by Lead Source" pad={false}>
      <table className="crm-table">
        <thead><tr><th>Lead Source</th><th>Leads</th><th>Jobs</th><th style={{ width: 200 }}>Close %</th></tr></thead>
        <tbody>
          {LEAD_SOURCES.map((s) => {
            const pct = Math.round((s.jobs / s.leads) * 100);
            return <tr key={s.slug}><td><strong>{s.label}</strong></td><td>{s.leads}</td><td>{s.jobs}</td>
              <td><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Bar value={pct} max={100} color={pct >= 35 ? '#22c55e' : '#f97316'} /><span style={{ fontSize: 12 }}>{pct}%</span></div></td></tr>;
          })}
        </tbody>
      </table>
    </Card>
  );
}
function Commission() {
  return (
    <Card title="Commission Report" pad={false}>
      <table className="crm-table">
        <thead><tr><th>Rep</th><th>Jobs Closed</th><th className="col-money">Revenue</th><th className="col-money">Commission</th></tr></thead>
        <tbody>
          {MARKETING.map((rep) => {
            const jobs = JOBS.filter((j) => j.marketing === rep);
            const rev = jobs.reduce((a, j) => a + j.estimate, 0);
            return <tr key={rep}><td><strong>{rep}</strong></td><td>{jobs.length}</td><td className="col-money">{money(rev)}</td><td className="col-money cell-money">{money(Math.round(rev * 0.05))}</td></tr>;
          })}
        </tbody>
      </table>
    </Card>
  );
}
function SalespersonTab({ name }: { name: string }) {
  const jobs = JOBS.filter((j) => j.marketing === name);
  const rev = jobs.reduce((a, j) => a + j.estimate, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Jobs" value={jobs.length} />
        <StatCard label="Pipeline" value={money(rev)} kind="money" />
        <StatCard label="Closing %" value={`${30 + (name.length % 12)}%`} accent="green" />
        <StatCard label="Avg Job Size" value={money(jobs.length ? Math.round(rev / jobs.length) : 0)} />
      </StatRow>
      <Card title={`${name} — Job Pipeline`} pad={false}>
        <JobsTable jobs={jobs} columns={EST_COLS} searchable={false} />
      </Card>
    </div>
  );
}

// ============================================================================
// MARKETING
// ============================================================================
function MarketingSummary() {
  const totalLeads = LEAD_SOURCES.reduce((a, s) => a + s.leads, 0);
  const totalRev = LEAD_SOURCES.reduce((a, s) => a + s.revenue, 0);
  const totalCost = LEAD_SOURCES.reduce((a, s) => a + s.cost, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Leads (MTD)" value={totalLeads} />
        <StatCard label="Attributed Revenue" value={money(totalRev)} kind="money" />
        <StatCard label="Ad Spend" value={money(totalCost)} accent="yellow" />
        <StatCard label="Blended ROAS" value={`${(totalRev / totalCost).toFixed(1)}x`} accent="green" />
      </StatRow>
      <Card title="Performance by Lead Source" pad={false}>
        <table className="crm-table">
          <thead><tr><th>Source</th><th>Leads</th><th>Jobs</th><th className="col-money">Revenue</th><th className="col-money">Cost</th><th className="col-money">ROAS</th></tr></thead>
          <tbody>
            {LEAD_SOURCES.map((s) => (
              <tr key={s.slug}><td><strong>{s.label}</strong></td><td>{s.leads}</td><td>{s.jobs}</td>
                <td className="col-money cell-money">{money(s.revenue)}</td><td className="col-money">{money(s.cost)}</td>
                <td className="col-money">{(s.revenue / s.cost).toFixed(1)}x</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
function LeadSourceTab({ src }: { src: typeof LEAD_SOURCES[number] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Leads" value={src.leads} />
        <StatCard label="Jobs" value={src.jobs} accent="green" />
        <StatCard label="Revenue" value={money(src.revenue)} kind="money" />
        <StatCard label="Cost / Lead" value={money(Math.round(src.cost / src.leads))} />
        <StatCard label="ROAS" value={`${(src.revenue / src.cost).toFixed(1)}x`} accent="blue" />
      </StatRow>
      <Card title={`${src.label} — Recent Leads`} pad={false}>
        <table className="crm-table">
          <thead><tr><th>Date</th><th>Lead</th><th>City</th><th>Status</th></tr></thead>
          <tbody>
            {JOBS.slice(0, src.jobs + 3).map((j, i) => (
              <tr key={j.id}><td>Jun {28 - i}</td><td><strong>{j.customer}</strong></td><td>{j.city}, NJ</td>
                <td>{i < src.jobs ? <span className="crm-pill" style={{ background: '#16a34a' }}>Converted</span> : <span className="crm-pill" style={{ background: '#6b7280' }}>Lead</span>}</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ============================================================================
// COMPANY
// ============================================================================
function CompanyOverview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Weekly Revenue" value={money(112400)} kind="money" sub="Target $100k" accent="green" />
        <StatCard label="Active Jobs" value={activeJobs().length + pendingSalesJobs().length} accent="blue" />
        <StatCard label="Open AR" value={money(collectionsRows().reduce((a, j) => a + j.balance, 0))} kind="danger" />
        <StatCard label="Cycle Time" value="27 days" sub="Target ≤ 30" accent="green" />
      </StatRow>
      <Card title="Company Scorecard — This Week"><MeasurableGrid /></Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
        <Card title="Jobs by Division">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DIVISIONS.filter((d) => d.code !== 'REF').map((d) => {
              const n = jobsByDivision(d.code).length;
              return <div key={d.code} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 28px', gap: 8, alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 13 }}><DivisionDot code={d.code} />{d.code}</span>
                <Bar value={n} max={Math.max(...DIVISIONS.map((x) => jobsByDivision(x.code).length))} color={d.color} />
                <span style={{ fontSize: 12, textAlign: 'right' }}>{n}</span>
              </div>;
            })}
          </div>
        </Card>
        <Card title="Jobs by Status">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['pending_sales', 'pre_production', 'work_in_progress', 'accounts_receivable', 'waiting_to_close'].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <StatusPill status={s} /><strong>{jobsByStatus(s).length}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
function CompanyBrain() {
  const examples = [
    'Which water jobs are over 30 days unbilled?',
    'How did Crew B do last month?',
    'Show me all REC jobs waiting on estimate approval.',
    'What is our open AR over 45 days by carrier?',
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="✨ Company Brain — Ask Anything">
        <p className="crm-muted" style={{ marginBottom: 12 }}>A conversational assistant grounded in your live CRM data. Ask in plain English.</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input className="crm-search" style={{ maxWidth: 'none', flex: 1 }} placeholder="Ask the Company Brain…" />
          <button className="crm-btn crm-btn-primary">Ask</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {examples.map((e) => <span key={e} className="crm-chip">{e}</span>)}
        </div>
      </Card>
      <Card title="Example Answer">
        <div style={{ fontSize: 13, lineHeight: 1.7 }}>
          <strong>Q:</strong> Which water jobs are over 30 days unbilled?<br />
          <strong>A:</strong> {JOBS.filter((j) => j.division === 'WTR' && j.daysOpen > 30 && j.invoiced === 0).length} water-mitigation jobs
          are over 30 days old without an invoice — the oldest is <span className="col-mono">{JOBS.filter((j) => j.division === 'WTR').sort((a, b) => b.daysOpen - a.daysOpen)[0]?.jobNumber}</span> at {JOBS.filter((j) => j.division === 'WTR').sort((a, b) => b.daysOpen - a.daysOpen)[0]?.daysOpen} days.
        </div>
      </Card>
    </div>
  );
}
function Measurables() {
  return (
    <Card title="Company Measurables (Ninety / EOS-style)" pad={false}>
      <table className="crm-table">
        <thead><tr><th>Measurable</th><th>Owner</th><th>Goal</th><th>Actual</th><th>Status</th></tr></thead>
        <tbody>
          {SCORECARD.map((m) => {
            const ok = measurableOnTarget(m);
            return <tr key={m.label}>
              <td><strong>{m.label}</strong></td>
              <td>{m.owner}</td>
              <td>{m.target == null ? '—' : `${m.op} ${fmtMetric(m.target, m.unit)}`}</td>
              <td>{m.actual == null ? '—' : fmtMetric(m.actual, m.unit)}</td>
              <td>{ok == null ? '—' : ok ? <span className="crm-pill" style={{ background: '#16a34a' }}>On Track</span> : <span className="crm-pill" style={{ background: '#dc2626' }}>Off Track</span>}</td>
            </tr>;
          })}
        </tbody>
      </table>
    </Card>
  );
}
function Financials() {
  const rev = 112400; const labor = 41200; const materials = 18600; const equip = 9400; const overhead = 22000;
  const gp = rev - labor - materials - equip;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Weekly Revenue" value={money(rev)} kind="money" />
        <StatCard label="Gross Profit" value={money(gp)} kind="money" sub={`${Math.round((gp / rev) * 100)}% margin`} accent="green" />
        <StatCard label="Net (est.)" value={money(gp - overhead)} kind="money" />
        <StatCard label="Open AR" value={money(collectionsRows().reduce((a, j) => a + j.balance, 0))} kind="danger" />
      </StatRow>
      <Card title="P&L Snapshot (QuickBooks sync)" pad={false}>
        <table className="crm-table">
          <thead><tr><th>Line</th><th className="col-money">Amount</th><th className="col-money">% Rev</th></tr></thead>
          <tbody>
            {[['Revenue', rev], ['Labor', -labor], ['Materials', -materials], ['Equipment', -equip], ['Overhead', -overhead]].map(([l, v]) => (
              <tr key={l as string}><td>{l}</td><td className="col-money" style={{ color: (v as number) < 0 ? '#dc2626' : '#0e9f6e', fontWeight: 600 }}>{(v as number) < 0 ? '-' : ''}{money(Math.abs(v as number))}</td><td className="col-money">{Math.round((Math.abs(v as number) / rev) * 100)}%</td></tr>
            ))}
            <tr style={{ borderTop: '2px solid #cbd5e1' }}><td><strong>Net Income</strong></td><td className="col-money cell-money"><strong>{money(gp - overhead)}</strong></td><td className="col-money">{Math.round(((gp - overhead) / rev) * 100)}%</td></tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
function Labor() {
  const crews = ['Crew A', 'Crew B', 'Crew C', 'Crew D', 'Office'];
  return (
    <Card title="Labor — Hours & Utilization (QuickBooks Time)" pad={false}>
      <table className="crm-table">
        <thead><tr><th>Team</th><th>Reg Hrs</th><th>OT Hrs</th><th style={{ width: 200 }}>Utilization</th></tr></thead>
        <tbody>
          {crews.map((c, i) => (
            <tr key={c}><td><strong>{c}</strong></td><td>{160 - i * 6}</td><td>{[12, 8, 4, 6, 0][i]}</td>
              <td><Bar value={[88, 82, 76, 71, 64][i]} max={100} color="#2563eb" /></td></tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
function CycleTime() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Median Cycle Time" value="27 days" accent="green" sub="Target ≤ 30" />
        <StatCard label="Lead → Signed" value="2.1 days" />
        <StatCard label="Signed → Started" value="3.4 days" />
        <StatCard label="Complete → Invoiced" value="6.2 days" accent="yellow" />
      </StatRow>
      <Card title="Cycle Time by Division" pad={false}>
        <table className="crm-table">
          <thead><tr><th>Division</th><th>Jobs</th><th>Median Days</th><th style={{ width: 220 }}>vs. 30-day target</th></tr></thead>
          <tbody>
            {DIVISIONS.filter((d) => ['WTR', 'MLD', 'STC', 'REC', 'CON'].includes(d.code)).map((d, i) => {
              const days = [21, 26, 19, 48, 31][i];
              return <tr key={d.code}><td><span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><DivisionDot code={d.code} />{d.label}</span></td>
                <td>{jobsByDivision(d.code).length}</td><td>{days}</td>
                <td><Bar value={days} max={60} color={days <= 30 ? '#22c55e' : '#ef4444'} /></td></tr>;
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
function HrTab() {
  const teams = ['Leadership', 'Operations', 'Rebuild', 'Sales', 'Marketing', 'Contents', 'Finance', 'Human Resources'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatRow>
        <StatCard label="Headcount" value={22} />
        <StatCard label="Teams" value={8} />
        <StatCard label="Open Seats" value={3} accent="yellow" />
        <StatCard label="Avg Tenure" value="2.8 yrs" />
      </StatRow>
      <Card title="Teams">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
          {teams.map((t, i) => (
            <div key={t} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{t}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{[3, 6, 4, 3, 2, 2, 1, 1][i]} members</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
function DashboardUtilization() {
  const dashes = Object.entries(DASH_LABEL);
  return (
    <Card title="Dashboard Utilization (last 30 days)" pad={false}>
      <table className="crm-table">
        <thead><tr><th>Dashboard</th><th>Views</th><th style={{ width: 240 }}>Activity</th></tr></thead>
        <tbody>
          {dashes.map(([k, label], i) => {
            const views = [388, 156, 132, 92, 51, 55, 23, 110][i] ?? 40;
            return <tr key={k}><td><strong>{label}</strong></td><td>{views}</td><td><Bar value={views} max={388} color="#2563eb" /></td></tr>;
          })}
        </tbody>
      </table>
    </Card>
  );
}

// Shared measurable grid (stat cards)
function MeasurableGrid({ only }: { only?: string[] }) {
  const list = only ? SCORECARD.filter((m) => only.includes(m.label)) : SCORECARD;
  return (
    <div className="crm-stats">
      {list.map((m) => {
        const ok = measurableOnTarget(m);
        return (
          <div key={m.label} className={'crm-stat ' + (ok == null ? '' : ok ? 'green-border' : 'red-border')}>
            <span className="label">{m.label}</span>
            <span className="value" style={{ color: ok === false ? '#dc2626' : undefined }}>{m.actual == null ? '—' : fmtMetric(m.actual, m.unit)}</span>
            <span className="sub">{m.target == null ? m.owner : `${m.op} ${fmtMetric(m.target, m.unit)} · ${m.owner}`}</span>
          </div>
        );
      })}
    </div>
  );
}
function fmtMetric(v: number, unit: string | null) {
  if (unit === '$') return money(v);
  if (unit === '%') return `${v}%`;
  if (unit === 'min') return `${v}m`;
  if (unit === 'days') return `${v}d`;
  return String(v);
}

// ============================================================================
// STANDALONE SECTIONS
// ============================================================================
function JobsSection({ openJob }: { openJob: (j: DemoJob) => void }) {
  return (
    <>
      <PageHead title="Jobs" tabs={[]} active="" onTab={() => {}} right={<button className="crm-btn crm-btn-primary">+ New Job</button>} />
      <div className="crm-body">
        <StatRow>
          <StatCard label="All Jobs" value={JOBS.length} />
          <StatCard label="Active" value={activeJobs().length} accent="blue" />
          <StatCard label="Pending Sales" value={pendingSalesJobs().length} accent="yellow" />
          <StatCard label="In Collections" value={collectionsRows().length} accent="red" />
        </StatRow>
        <JobsTable jobs={JOBS} onPick={openJob} />
      </div>
    </>
  );
}

function JobDetail({ job, onBack }: { job: DemoJob; onBack: () => void }) {
  return (
    <>
      <div className="crm-page-head">
        <button className="crm-btn crm-btn-ghost" style={{ marginBottom: 10 }} onClick={onBack}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <DivisionDot code={job.division} />
          <h1 className="crm-h1" style={{ fontSize: 30 }}>{job.customer}</h1>
          <StatusPill status={job.status} />
          <span className="col-mono crm-muted">{job.jobNumber}</span>
        </div>
        <p className="crm-muted" style={{ marginTop: 4 }}>{job.address}, {job.city}, NJ · {DIV_LABEL[job.division]} · {job.cause}</p>
      </div>
      <div className="crm-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StatRow>
          <StatCard label="Estimate" value={money(job.estimate)} kind="money" />
          <StatCard label="Invoiced" value={money(job.invoiced)} />
          <StatCard label="Balance Due" value={money(balanceDue(job))} kind={balanceDue(job) > 0 ? 'danger' : undefined} />
          <StatCard label="Days Open" value={job.daysOpen} />
          <StatCard label="Photos" value={job.photos} />
        </StatRow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          <Card title="Job Details">
            <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 8, fontSize: 13 }}>
              {[['Division', DIV_LABEL[job.division]], ['Status', STATUS_LABEL[job.status]], ['Supervisor', job.supervisor], ['Sales Rep', job.marketing], ['Carrier', job.carrier], ['Received', job.receivedAt], ['Cause of Loss', job.cause]].map(([k, v]) => (
                <div key={k} style={{ display: 'contents' }}><dt className="crm-muted">{k}</dt><dd style={{ fontWeight: 600 }}>{v}</dd></div>
              ))}
            </dl>
          </Card>
          <Card title="Photos">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ aspectRatio: '1', borderRadius: 8, background: 'linear-gradient(135deg,#dbeafe,#e0e7ff)', border: '1px solid #e2e8f0' }} />)}
            </div>
          </Card>
        </div>
        <Card title="Recent Notes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Note text="Set 3 air movers + 1 LGR dehu in affected area. Moisture at baseboard 38%." who={job.supervisor} time="8:46 AM" />
            <Note text="Customer signed authorization to perform. Pets secured." who="System" time="8:31 AM" />
            <Note text={`Cause of loss documented: ${job.cause}. Photos uploaded.`} who={job.supervisor} time="8:12 AM" />
          </div>
        </Card>
      </div>
    </>
  );
}
function Note({ text, who, time }: { text: string; who: string; time: string }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', background: '#fff' }}>
      <p style={{ fontSize: 13 }}>{text}</p>
      <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{who} · {time}</p>
    </div>
  );
}

function MyDay() {
  const [tasks, setTasks] = useState(COMPLIANCE_TASKS);
  const open = tasks.filter((t) => !t.done).length;
  return (
    <>
      <PageHead title="My Day" tabs={[]} active="" onTab={() => {}} />
      <div className="crm-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StatRow>
          <StatCard label="My Jobs" value={12} />
          <StatCard label="Tasks to Clear" value={open} accent="yellow" />
          <StatCard label="Rocks On Track" value="3 / 4" accent="green" />
          <StatCard label="Headlines" value={2} />
        </StatRow>
        <Card title="Today's Tasks (EOS / Ninety-style)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tasks.map((t) => (
              <button key={t.id} onClick={() => setTasks((p) => p.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid', borderColor: t.done ? '#16a34a' : '#cbd5e1', background: t.done ? '#16a34a' : '#fff', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{t.done ? '✓' : ''}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#94a3b8' : '#0f172a' }}>{t.label}</span>
                  <span style={{ display: 'block', fontSize: 11, color: '#94a3b8' }}>{t.job} · {t.role} · {t.due}</span>
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function AlertPage() {
  const [openId, setOpenId] = useState<string | null>('a1');
  return (
    <>
      <PageHead title="Alert Page" tabs={[]} active="" onTab={() => {}}
        right={<span className="crm-pill" style={{ background: '#16a34a' }}>● Live</span>} />
      <div className="crm-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p className="crm-muted">Real-time fire &amp; EMS scanner dispatches, scored by the AI Alert Qualifier. Tap "Why?" for the reasoning.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ALERTS.map((a) => {
            const isOpen = openId === a.id;
            const tone = a.verdict === 'Hot lead' ? '#dc2626' : a.verdict === 'Worth a call' ? '#d97706' : '#94a3b8';
            return (
              <button key={a.id} onClick={() => setOpenId(isOpen ? null : a.id)} className="crm-card" style={{ textAlign: 'left', cursor: 'pointer', padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{a.time} · {a.feed}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 22, fontWeight: 800, color: tone }}>{a.score}</span><span style={{ fontSize: 10, color: '#94a3b8' }}>/100</span></span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>{a.raw}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontWeight: 700, color: tone }}>{a.verdict}</span>
                  <span style={{ fontSize: 12, color: '#2563eb' }}>{isOpen ? 'Hide' : 'Why?'}</span>
                </div>
                {isOpen && <p style={{ marginTop: 8, background: '#f8fafc', borderRadius: 8, padding: 10, fontSize: 12, color: '#475569' }}><strong style={{ color: '#dc2626' }}>AI: </strong>{a.reason}</p>}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function PlumberManager() {
  return (
    <>
      <PageHead title="Plumber Manager" tabs={[]} active="" onTab={() => {}} right={<button className="crm-btn crm-btn-primary">+ Add Partner</button>} />
      <div className="crm-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StatRow>
          <StatCard label="Referral Partners" value={PLUMBERS.length} />
          <StatCard label="Referrals (MTD)" value={PLUMBERS.reduce((a, p) => a + p.referrals, 0)} accent="blue" />
          <StatCard label="Converted" value={PLUMBERS.reduce((a, p) => a + p.converted, 0)} accent="green" />
          <StatCard label="Payouts Owed" value={money(PLUMBERS.reduce((a, p) => a + p.payout, 0))} kind="money" />
        </StatRow>
        <Card title="Referral Partners" pad={false}>
          <table className="crm-table">
            <thead><tr><th>Partner</th><th>Company</th><th>Tier</th><th>Referrals</th><th>Converted</th><th className="col-money">Payout</th><th>Last</th></tr></thead>
            <tbody>
              {PLUMBERS.map((p) => (
                <tr key={p.name}>
                  <td><strong>{p.name}</strong></td><td>{p.company}</td>
                  <td><span className="crm-pill" style={{ background: p.tier === 'Gold' ? '#d97706' : p.tier === 'Silver' ? '#64748b' : '#92400e' }}>{p.tier}</span></td>
                  <td>{p.referrals}</td><td>{p.converted}</td>
                  <td className="col-money cell-money">{money(p.payout)}</td><td>{p.lastReferral}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}

function Compliance() {
  const passing = BILLING_QA.checks.filter((c) => c.ok).length;
  return (
    <>
      <PageHead title="Compliance" tabs={[]} active="" onTab={() => {}} />
      <div className="crm-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p className="crm-muted">Detection-then-execution engine — database triggers detect what happened and workflow rules auto-create the right task for the right role.</p>
        <StatRow>
          <StatCard label="Active Workflows" value={94} />
          <StatCard label="Open Tasks" value={COMPLIANCE_TASKS.filter((t) => !t.done).length} accent="yellow" />
          <StatCard label="Overdue" value={COMPLIANCE_TASKS.filter((t) => t.due === 'overdue').length} accent="red" />
          <StatCard label="Auto-created (wk)" value={216} accent="blue" />
        </StatRow>
        <Card title="Compliance Tasks" pad={false}>
          <table className="crm-table">
            <thead><tr><th>Task</th><th>Job</th><th>Role</th><th>Due</th><th>Source Rule</th></tr></thead>
            <tbody>
              {COMPLIANCE_TASKS.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.label}</strong></td><td className="col-mono">{t.job}</td><td>{t.role}</td>
                  <td>{t.due === 'overdue' ? <span className="crm-pill" style={{ background: '#dc2626' }}>Overdue</span> : t.due}</td>
                  <td className="crm-muted">{t.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title={`✨ AI Billing-Package QA — ${BILLING_QA.job}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <ScoreRing score={BILLING_QA.score} />
            <div>
              <div style={{ fontWeight: 700 }}>Almost ready to submit</div>
              <div className="crm-muted" style={{ fontSize: 13 }}>{passing} of {BILLING_QA.checks.length} checks passing · 2 items to fix</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {BILLING_QA.checks.map((c) => (
              <div key={c.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: c.ok ? '#16a34a' : '#dc2626', color: '#fff', fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.ok ? '✓' : '!'}</span>
                <span style={{ flex: 1 }}><span style={{ fontSize: 13, fontWeight: 600, display: 'block' }}>{c.label}</span><span style={{ fontSize: 12, color: c.ok ? '#94a3b8' : '#dc2626' }}>{c.note}</span></span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
function ScoreRing({ score }: { score: number }) {
  return (
    <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
      <svg viewBox="0 0 36 36" style={{ width: 64, height: 64, transform: 'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={`${(score / 100) * 97.4} 97.4`} />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#032e5b' }}>{score}%</span>
    </div>
  );
}

function Admin() {
  const items = [
    ['Users & Roles', '22 staff · 27 roles'],
    ['Workflows', '94 compliance workflows'],
    ['Playbook', 'Per-dashboard how-to guides'],
    ['Data Migration', 'CSV import from legacy Dash'],
    ['Display TV', 'Lobby scoreboard mode'],
    ['Tables', 'Raw data browser'],
    ['Verification', 'Data integrity checks'],
    ['Error Log', '3 entries'],
  ];
  return (
    <>
      <PageHead title="Admin" tabs={[]} active="" onTab={() => {}} />
      <div className="crm-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {items.map(([t, d]) => (
            <div key={t} className="crm-card" style={{ padding: 16, cursor: 'pointer' }}>
              <div style={{ fontWeight: 700, color: '#032e5b' }}>{t}</div>
              <div className="crm-muted" style={{ fontSize: 12, marginTop: 4 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
