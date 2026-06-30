import { useState, type ReactNode } from 'react';
import {
  type DemoJob, DIV_COLOR, DIV_LABEL, STATUS_LABEL, STATUS_COLOR, money, moneyFull, balanceDue,
} from './data';

export function PageHead({ title, tabs, active, onTab, right }: {
  title: string;
  tabs: { key: string; label: string }[];
  active: string;
  onTab: (k: string) => void;
  right?: ReactNode;
}) {
  return (
    <div className="crm-page-head">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <h1 className="crm-h1">{title}</h1>
        {right}
      </div>
      {tabs.length > 0 && (
        <nav className="crm-tabs scroll" style={{ marginTop: 12 }}>
          {tabs.map((t) => (
            <button key={t.key} className={'crm-tab' + (active === t.key ? ' active' : '')} onClick={() => onTab(t.key)}>
              {t.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export function StatCard({ label, value, sub, kind, accent }: {
  label: string; value: ReactNode; sub?: string;
  kind?: 'money' | 'danger'; accent?: 'green' | 'yellow' | 'red' | 'blue';
}) {
  return (
    <div className={'crm-stat' + (accent ? ` ${accent}-border` : '')}>
      <span className="label">{label}</span>
      <span className={'value' + (kind ? ` ${kind}` : '')}>{value}</span>
      {sub && <span className="sub">{sub}</span>}
    </div>
  );
}

export function StatRow({ children }: { children: ReactNode }) {
  return <div className="crm-stats" style={{ marginBottom: 18 }}>{children}</div>;
}

export function DivisionDot({ code }: { code: string }) {
  return <span className="crm-div-dot" style={{ background: DIV_COLOR[code] ?? '#94a3b8' }} title={DIV_LABEL[code]} />;
}

export function StatusPill({ status }: { status: string }) {
  return <span className="crm-pill" style={{ background: STATUS_COLOR[status] ?? '#6b7280' }}>{STATUS_LABEL[status] ?? status}</span>;
}

export function Card({ title, right, children, pad = true }: { title?: string; right?: ReactNode; children: ReactNode; pad?: boolean }) {
  return (
    <div className="crm-card">
      {title && <div className="crm-card-header"><span>{title}</span>{right}</div>}
      <div style={pad ? undefined : { padding: 0 }} className={pad ? 'crm-card-body' : ''}>{children}</div>
    </div>
  );
}

export interface Column { key: string; label: string; render?: (j: DemoJob) => ReactNode; money?: boolean; }

export function JobsTable({ jobs, columns, onPick, searchable = true }: {
  jobs: DemoJob[];
  columns?: Column[];
  onPick?: (j: DemoJob) => void;
  searchable?: boolean;
}) {
  const [q, setQ] = useState('');
  const [div, setDiv] = useState('all');
  const cols: Column[] = columns ?? DEFAULT_COLS;
  const term = q.trim().toLowerCase();
  const rows = jobs.filter((j) =>
    (div === 'all' || j.division === div) &&
    (!term || j.jobNumber.toLowerCase().includes(term) || j.customer.toLowerCase().includes(term) || j.city.toLowerCase().includes(term)),
  );
  const divs = Array.from(new Set(jobs.map((j) => j.division)));
  return (
    <div className="crm-table-wrap">
      {searchable && (
        <div className="crm-toolbar">
          <input className="crm-search" placeholder="Search jobs, customers, cities" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="crm-select" value={div} onChange={(e) => setDiv(e.target.value)}>
            <option value="all">All divisions</option>
            {divs.map((d) => <option key={d} value={d}>{DIV_LABEL[d]}</option>)}
          </select>
          <span className="crm-muted" style={{ marginLeft: 'auto', fontSize: 13 }}>{rows.length} job{rows.length === 1 ? '' : 's'}</span>
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="crm-table">
          <thead>
            <tr>{cols.map((c) => <th key={c.key} className={c.money ? 'col-money' : ''}>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((j) => (
              <tr key={j.id} className={onPick ? 'clickable' : ''} onClick={onPick ? () => onPick(j) : undefined}>
                {cols.map((c) => <td key={c.key} className={c.money ? 'col-money' : ''}>{c.render ? c.render(j) : (j as never)[c.key]}</td>)}
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={cols.length} className="crm-empty">No matching jobs.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const DEFAULT_COLS: Column[] = [
  { key: 'jobNumber', label: 'Job #', render: (j) => <span className="cell-job-number col-mono">{j.jobNumber}</span> },
  { key: 'customer', label: 'Customer', render: (j) => <strong>{j.customer}</strong> },
  { key: 'division', label: 'Division', render: (j) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><DivisionDot code={j.division} />{DIV_LABEL[j.division]}</span> },
  { key: 'city', label: 'City', render: (j) => `${j.city}, NJ` },
  { key: 'status', label: 'Status', render: (j) => <StatusPill status={j.status} /> },
  { key: 'supervisor', label: 'Supervisor' },
  { key: 'estimate', label: 'Est. Value', money: true, render: (j) => <span className="cell-money">{money(j.estimate)}</span> },
];

export const AR_COLS: Column[] = [
  { key: 'jobNumber', label: 'Job #', render: (j) => <span className="cell-job-number col-mono">{j.jobNumber}</span> },
  { key: 'customer', label: 'Customer', render: (j) => <strong>{j.customer}</strong> },
  { key: 'carrier', label: 'Carrier' },
  { key: 'invoiced', label: 'Invoiced', money: true, render: (j) => <span className="col-money">{money(j.invoiced)}</span> },
  { key: 'paid', label: 'Paid', money: true, render: (j) => <span className="col-money">{money(j.paid)}</span> },
  { key: 'balance', label: 'Balance Due', money: true, render: (j) => <span className="cell-balance-due">{moneyFull(balanceDue(j))}</span> },
  { key: 'age', label: 'Age', render: (j) => <DayBadge days={j.daysOpen} /> },
];

export function DayBadge({ days }: { days: number }) {
  const c = days >= 45 ? { bg: '#fee2e2', fg: '#991b1b' } : days >= 21 ? { bg: '#ffedd5', fg: '#9a3412' } : days >= 8 ? { bg: '#fef3c7', fg: '#92400e' } : { bg: '#dcfce7', fg: '#166534' };
  return <span className="crm-pill" style={{ background: c.bg, color: c.fg }}>{days}d</span>;
}

export function Bar({ value, max, color = '#22c55e' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ background: '#eef2f6', borderRadius: 999, height: 8, overflow: 'hidden', minWidth: 80 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999 }} />
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="crm-empty">{children}</div>;
}
