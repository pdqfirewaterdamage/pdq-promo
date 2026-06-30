import { useState } from 'react';
import {
  DEMO_JOBS,
  DEMO_TODOS,
  DEMO_ALERTS,
  DEMO_QA,
  type DemoJob,
  type DemoTodo,
} from './data';

type Screen = 'myday' | 'dispatch' | 'job' | 'alerts' | 'qa';

const statusColor: Record<string, string> = {
  'Dispatched': 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  'In Progress': 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  'Monitoring': 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
  'Awaiting Approval': 'bg-orange-500/15 text-orange-300 ring-orange-500/30',
  'Billing': 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
};

function Pill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${
        statusColor[status] ?? 'bg-white/10 text-white ring-white/20'
      }`}
    >
      {status}
    </span>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-semibold text-white/80">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <span>Tailr Field</span>
      </div>
      <span>▮▮▮ 5G</span>
    </div>
  );
}

function TabBar({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const tabs: { key: Screen; label: string; icon: string }[] = [
    { key: 'myday', label: 'My Day', icon: '☀️' },
    { key: 'dispatch', label: 'Jobs', icon: '🗂️' },
    { key: 'alerts', label: 'Alerts', icon: '📡' },
    { key: 'qa', label: 'AI QA', icon: '✨' },
  ];
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-stretch justify-around border-t border-white/10 bg-navy-900/95 px-2 pb-5 pt-2 backdrop-blur">
      {tabs.map((t) => {
        const active = screen === t.key || (t.key === 'dispatch' && screen === 'job');
        return (
          <button
            key={t.key}
            onClick={() => go(t.key)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1 text-[10px] font-semibold transition ${
              active ? 'text-accent-400' : 'text-white/45 hover:text-white/70'
            }`}
          >
            <span className="text-base leading-none">{t.icon}</span>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ---- Screens ---------------------------------------------------------------

function MyDayScreen({ go }: { go: (s: Screen) => void }) {
  const [todos, setTodos] = useState<DemoTodo[]>(DEMO_TODOS);
  const open = todos.filter((t) => !t.done).length;
  return (
    <div className="px-4 pb-24 pt-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-400">Monday · Jun 30</p>
      <h3 className="mt-0.5 text-xl font-extrabold text-white">Good morning, Devon</h3>
      <p className="mt-0.5 text-xs text-white/55">
        {DEMO_JOBS.length} jobs on your board · {open} tasks to clear
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { v: DEMO_JOBS.length, l: 'Jobs' },
          { v: open, l: 'Tasks' },
          { v: '46mi', l: 'Route' },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-white/[0.06] px-2 py-2 text-center ring-1 ring-white/10">
            <div className="text-lg font-extrabold text-white">{s.v}</div>
            <div className="text-[9px] uppercase tracking-wide text-white/50">{s.l}</div>
          </div>
        ))}
      </div>

      <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-white/45">Compliance tasks</h4>
      <div className="mt-1.5 space-y-1.5">
        {todos.map((t) => (
          <button
            key={t.id}
            onClick={() => setTodos((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
            className="flex w-full items-start gap-2.5 rounded-xl bg-white/[0.05] px-3 py-2.5 text-left ring-1 ring-white/10 transition active:scale-[0.99]"
          >
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                t.done ? 'border-emerald-400 bg-emerald-400 text-navy-950' : 'border-white/30'
              }`}
            >
              {t.done && <span className="text-[9px] font-black">✓</span>}
            </span>
            <span className="flex-1">
              <span className={`block text-xs font-semibold ${t.done ? 'text-white/40 line-through' : 'text-white'}`}>
                {t.label}
              </span>
              <span className="text-[10px] text-white/45">{t.due} · {t.source}</span>
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => go('dispatch')}
        className="mt-4 w-full rounded-xl bg-accent-500 py-2.5 text-sm font-bold text-white shadow-glow active:scale-[0.99]"
      >
        View today&apos;s jobs →
      </button>
    </div>
  );
}

function DispatchScreen({ pick }: { pick: (j: DemoJob) => void }) {
  return (
    <div className="px-4 pb-24 pt-2">
      <h3 className="text-xl font-extrabold text-white">Dispatch</h3>
      <p className="text-xs text-white/55">Tap a job to open it</p>
      <div className="mt-3 space-y-2">
        {DEMO_JOBS.map((j) => (
          <button
            key={j.jobNumber}
            onClick={() => pick(j)}
            className="block w-full rounded-xl bg-white/[0.05] p-3 text-left ring-1 ring-white/10 transition hover:bg-white/[0.08] active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-accent-300">{j.jobNumber}</span>
              <Pill status={j.status} />
            </div>
            <div className="mt-1 text-sm font-bold text-white">{j.customer}</div>
            <div className="text-[11px] text-white/55">{j.address}</div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/50">
              <span>{j.divisionLabel}</span>
              <span className={j.priority === 'High' ? 'font-bold text-accent-400' : ''}>
                {j.priority === 'High' ? '● High priority' : `ETA ${j.eta}`}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function JobScreen({ job, back }: { job: DemoJob; back: () => void }) {
  return (
    <div className="px-4 pb-24 pt-2">
      <button onClick={back} className="text-xs font-semibold text-accent-300">← Back to jobs</button>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-accent-300">{job.jobNumber}</span>
        <Pill status={job.status} />
      </div>
      <h3 className="mt-1 text-lg font-extrabold leading-tight text-white">{job.customer}</h3>
      <p className="text-[11px] text-white/55">{job.address}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-white/[0.06] py-2 ring-1 ring-white/10">
          <div className="text-base font-extrabold text-white">{job.photos}</div>
          <div className="text-[9px] uppercase tracking-wide text-white/50">Photos</div>
        </div>
        <div className="rounded-xl bg-white/[0.06] py-2 ring-1 ring-white/10">
          <div className="text-base font-extrabold text-white">{job.amount}</div>
          <div className="text-[9px] uppercase tracking-wide text-white/50">Est. value</div>
        </div>
      </div>

      <h4 className="mt-3 text-[11px] font-bold uppercase tracking-wide text-white/45">Photos</h4>
      <div className="mt-1.5 grid grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-gradient-to-br from-navy-700 to-navy-800 ring-1 ring-white/10"
            aria-label="photo placeholder"
          />
        ))}
      </div>

      <h4 className="mt-3 text-[11px] font-bold uppercase tracking-wide text-white/45">Recent notes</h4>
      <div className="mt-1.5 space-y-1.5">
        <div className="rounded-xl bg-white/[0.05] px-3 py-2 ring-1 ring-white/10">
          <p className="text-[11px] text-white/80">
            Set 3 air movers + 1 LGR dehu in master bath. Moisture at baseboard 38%.
          </p>
          <p className="mt-0.5 text-[9px] text-white/40">D. Cruz · 8:46 AM</p>
        </div>
        <div className="rounded-xl bg-white/[0.05] px-3 py-2 ring-1 ring-white/10">
          <p className="text-[11px] text-white/80">Customer signed authorization to perform. Pets secured.</p>
          <p className="mt-0.5 text-[9px] text-white/40">System · 8:31 AM</p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button className="flex-1 rounded-xl bg-white/10 py-2.5 text-xs font-bold text-white active:scale-[0.99]">
          + Add note
        </button>
        <button className="flex-1 rounded-xl bg-accent-500 py-2.5 text-xs font-bold text-white shadow-glow active:scale-[0.99]">
          + Add photo
        </button>
      </div>
    </div>
  );
}

function AlertsScreen() {
  const [openId, setOpenId] = useState<string | null>('a1');
  return (
    <div className="px-4 pb-24 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-white">Alert Page</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
        </span>
      </div>
      <p className="text-xs text-white/55">Scanner dispatches, scored by AI</p>
      <div className="mt-3 space-y-2">
        {DEMO_ALERTS.map((a) => {
          const open = openId === a.id;
          const tone =
            a.verdict === 'Hot lead'
              ? 'text-accent-400'
              : a.verdict === 'Worth a call'
                ? 'text-amber-300'
                : 'text-white/40';
          return (
            <button
              key={a.id}
              onClick={() => setOpenId(open ? null : a.id)}
              className="block w-full rounded-xl bg-white/[0.05] p-3 text-left ring-1 ring-white/10 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-white/45">{a.time} · {a.feed}</span>
                <span className="flex items-center gap-1.5">
                  <span className={`text-lg font-extrabold ${tone}`}>{a.score}</span>
                  <span className="text-[9px] text-white/40">/100</span>
                </span>
              </div>
              <p className="mt-1 text-[11px] font-medium text-white/85">{a.raw}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className={`text-[11px] font-bold ${tone}`}>{a.verdict}</span>
                <span className="text-[10px] text-accent-300">{open ? 'Hide' : 'Why?'}</span>
              </div>
              {open && (
                <p className="mt-1.5 rounded-lg bg-navy-950/60 px-2.5 py-2 text-[10px] leading-relaxed text-white/65 ring-1 ring-white/5">
                  <span className="font-bold text-accent-300">AI: </span>
                  {a.reason}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QAScreen() {
  const passing = DEMO_QA.checks.filter((c) => c.ok).length;
  return (
    <div className="px-4 pb-24 pt-2">
      <h3 className="text-xl font-extrabold text-white">AI Billing QA</h3>
      <p className="text-xs text-white/55">Pre-submission check · {DEMO_QA.job}</p>

      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-800 p-4 ring-1 ring-white/10">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3.5" />
            <circle
              cx="18" cy="18" r="15.5" fill="none" stroke="#ff5c0a" strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${(DEMO_QA.score / 100) * 97.4} 97.4`}
            />
          </svg>
          <span className="absolute text-sm font-extrabold text-white">{DEMO_QA.score}%</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Almost ready to submit</p>
          <p className="text-[11px] text-white/55">{passing} of {DEMO_QA.checks.length} checks passing · 2 items to fix</p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {DEMO_QA.checks.map((c) => (
          <div key={c.label} className="flex items-start gap-2.5 rounded-xl bg-white/[0.05] px-3 py-2 ring-1 ring-white/10">
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black ${
                c.ok ? 'bg-emerald-400 text-navy-950' : 'bg-accent-500 text-white'
              }`}
            >
              {c.ok ? '✓' : '!'}
            </span>
            <span className="flex-1">
              <span className="block text-[11px] font-semibold text-white">{c.label}</span>
              <span className={`text-[10px] ${c.ok ? 'text-white/45' : 'text-accent-300'}`}>{c.note}</span>
            </span>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full rounded-xl bg-white/10 py-2.5 text-xs font-bold text-white/80 active:scale-[0.99]">
        Re-run check after fixes
      </button>
    </div>
  );
}

// ---- Frame -----------------------------------------------------------------

export default function PhonePrototype() {
  const [screen, setScreen] = useState<Screen>('myday');
  const [job, setJob] = useState<DemoJob>(DEMO_JOBS[0]);

  const go = (s: Screen) => setScreen(s);
  const pick = (j: DemoJob) => {
    setJob(j);
    setScreen('job');
  };

  return (
    <div className="relative mx-auto w-[300px] shrink-0">
      {/* glow */}
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-accent-500/20 blur-3xl" />
      {/* device */}
      <div className="relative rounded-[2.6rem] border-[10px] border-navy-800 bg-navy-950 shadow-2xl ring-1 ring-white/10">
        {/* notch */}
        <div className="absolute left-1/2 top-2 z-20 h-5 w-28 -translate-x-1/2 rounded-full bg-navy-800" />
        {/* screen */}
        <div className="relative h-[600px] overflow-hidden rounded-[2rem] bg-gradient-to-b from-navy-900 to-navy-950">
          <StatusBar />
          <div className="h-[calc(600px-32px)] overflow-y-auto">
            {screen === 'myday' && <MyDayScreen go={go} />}
            {screen === 'dispatch' && <DispatchScreen pick={pick} />}
            {screen === 'job' && <JobScreen job={job} back={() => setScreen('dispatch')} />}
            {screen === 'alerts' && <AlertsScreen />}
            {screen === 'qa' && <QAScreen />}
          </div>
          <TabBar screen={screen} go={go} />
        </div>
      </div>
    </div>
  );
}
