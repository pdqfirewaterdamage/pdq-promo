import { useState } from 'react';
import PhonePrototype from './PhonePrototype';
import PitchDeck from './PitchDeck';
import CrmDemo from './crm/CrmDemo';
import { FEATURES, AI_FEATURES } from './data';

function Wordmark() {
  return (
    <span className="text-lg font-black tracking-tight text-white">
      Tailr
    </span>
  );
}

function Nav({ onOpenCrm }: { onOpenCrm: () => void }) {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-navy-950/80 backdrop-blur">
      <div className="container-pdq flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-sm font-black text-white">
            T
          </span>
          <Wordmark />
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-white/70 md:flex">
          <a href="#features" className="hover:text-white">Platform</a>
          <a href="#ai" className="hover:text-white">AI</a>
          <button onClick={onOpenCrm} className="font-medium text-white/70 hover:text-white">Live CRM</button>
          <a href="#prototype" className="hover:text-white">Mobile app</a>
          <a href="#deck" className="hover:text-white">Pitch deck</a>
        </nav>
        <button
          onClick={onOpenCrm}
          className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:bg-accent-600"
        >
          Open the CRM
        </button>
      </div>
    </header>
  );
}

function Hero({ onOpenCrm }: { onOpenCrm: () => void }) {
  return (
    <section id="top" className="hero-mesh relative overflow-hidden">
      <div className="grid-overlay pointer-events-none absolute inset-0" />
      <div className="container-pdq relative grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400" />
            Now with AI built in
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            One operating system for the{' '}
            <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              whole restoration business
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/70">
            Tailr CRM is the source of truth for jobs, customers, claims, and compliance —
            from water, fire, and mold mitigation to reconstruction and contents. A mobile app for the
            field, live dashboards for the office, and AI that does the heavy lifting.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCrm}
              className="rounded-xl bg-accent-500 px-6 py-3 text-base font-bold text-white shadow-glow transition hover:bg-accent-600"
            >
              Open the live CRM demo
            </button>
            <a
              href="#deck"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              View the pitch deck
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/50">
            <span>✔ Replaces spreadsheets &amp; legacy Dash</span>
            <span>✔ Field-to-billing in one place</span>
          </div>
        </div>

        {/* phone peeking into hero */}
        <div className="flex justify-center lg:justify-end">
          <PhonePrototype />
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: '8', l: 'Live dashboards' },
    { v: '6', l: 'AI features built in' },
    { v: '4', l: 'Core integrations' },
    { v: '< 1 min', l: 'Alert → qualified lead' },
  ];
  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="container-pdq grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="text-center">
            <div className="text-3xl font-extrabold text-white sm:text-4xl">{s.v}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-white/50">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="container-pdq scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">The platform</p>
        <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          Everything the restoration back office needs
        </h2>
        <p className="mt-3 text-white/60">
          Built by people who run the trucks — to replace the spreadsheets and the tool nobody liked.
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="card-surface group p-5 transition hover:border-accent-500/40 hover:bg-white/[0.05]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/15 text-2xl ring-1 ring-accent-500/30">
              {f.icon}
            </div>
            <h3 className="mt-4 text-base font-bold text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/60">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section id="ai" className="relative scroll-mt-20 overflow-hidden border-y border-white/10 bg-gradient-to-b from-navy-900/60 to-navy-950 py-20 sm:py-28">
      <div className="absolute left-1/2 top-0 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-accent-500/15 blur-3xl" />
      <div className="container-pdq">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">AI built in — not bolted on</p>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            Six places AI does the work for you
          </h2>
          <p className="mt-3 text-white/60">
            From the first scanner alert to the final billing package, AI is woven into the workflow
            crews and the office already use.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {AI_FEATURES.map((a) => (
            <div
              key={a.title}
              className="card-surface relative overflow-hidden p-6 transition hover:-translate-y-0.5 hover:border-accent-500/40"
            >
              <span className="inline-flex rounded-full bg-accent-500/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent-300 ring-1 ring-accent-500/30">
                {a.badge}
              </span>
              <h3 className="mt-3 text-lg font-extrabold text-white">{a.title}</h3>
              <p className="mt-2 text-sm font-medium text-white/80">{a.benefit}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">{a.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Prototype() {
  return (
    <section id="prototype" className="container-pdq scroll-mt-20 py-20 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Clickable demo</p>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            The mobile dispatch app, in your browser
          </h2>
          <p className="mt-4 text-white/65">
            This is a live, tappable prototype with sample data — tap through it just like the real
            Expo app the crews carry into the field.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/75">
            {[
              ['My Day', 'Today’s jobs, route, and the compliance tasks to clear — tap a task to check it off.'],
              ['Dispatch', 'The full job board. Tap any job to open it.'],
              ['Job detail', 'Status, photo grid, notes, and quick actions for the truck.'],
              ['Alert Page', 'Live scanner dispatches scored by the AI Alert Qualifier — tap "Why?" for the reasoning.'],
              ['AI Billing QA', 'A pre-submission completeness score with exactly what to fix.'],
            ].map(([k, v]) => (
              <li key={k} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent-500" />
                <span>
                  <span className="font-bold text-white">{k}.</span> {v}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-white/40">
            Sample data only. The prototype makes no network calls — nothing here touches a real system.
          </p>
        </div>
        <div className="flex justify-center">
          <PhonePrototype />
        </div>
      </div>
    </section>
  );
}

function Integrations() {
  const items = [
    ['QuickBooks', 'Accounting + QuickBooks Time'],
    ['Microsoft 365', 'Calendar & email'],
    ['RingCentral', 'Calls, recordings, transcripts'],
    ['Encircle', 'Field docs & equipment data'],
  ];
  return (
    <section className="container-pdq py-16">
      <div className="card-surface px-6 py-10 sm:px-10">
        <div className="text-center">
          <p className="eyebrow">Integrations</p>
          <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
            Plugs into the tools you already run
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([k, v]) => (
            <div key={k} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center">
              <div className="text-base font-bold text-white">{k}</div>
              <div className="mt-1 text-xs text-white/55">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CrmBanner({ onOpenCrm }: { onOpenCrm: () => void }) {
  return (
    <section id="crm" className="container-pdq scroll-mt-20 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#082A4E] to-[#04152A] px-6 py-12 sm:px-12">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow text-emerald-300">The actual app — in your browser</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              Click through the real Tailr CRM
            </h2>
            <p className="mt-4 max-w-xl text-white/70">
              The full office web app — all eight dashboards and every tab — plus the mobile
              field app, running on sample data. Open every menu, search the job board, drill into
              a job, and flip between Office and Field. No login required.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={onOpenCrm} className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white shadow-glow transition hover:bg-emerald-600">
                Open the live CRM →
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
              <span>Operations · Rebuild · Warehouse · Collections</span>
              <span>Insurance · Sales · Marketing · Company</span>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {[
              ['8', 'Live dashboards'],
              ['40+', 'Menu tabs'],
              ['Web', '+ Mobile app'],
              ['0', 'Network calls'],
            ].map(([v, l]) => (
              <li key={l} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-5 text-center">
                <div className="text-2xl font-extrabold text-white">{v}</div>
                <div className="mt-1 text-xs text-white/55">{l}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CTA({ onOpenCrm }: { onOpenCrm: () => void }) {
  return (
    <section className="container-pdq py-16">
      <div className="relative overflow-hidden rounded-3xl border border-accent-500/30 bg-gradient-to-br from-navy-800 to-navy-950 px-6 py-14 text-center sm:px-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
        <h2 className="relative text-3xl font-extrabold text-white sm:text-4xl">
          Run the whole business from one place
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/70">
          Field to billing, with AI built in. Open the live CRM demo, then walk through the pitch.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={onOpenCrm} className="rounded-xl bg-accent-500 px-6 py-3 font-bold text-white shadow-glow hover:bg-accent-600">
            Open the live CRM
          </button>
          <a href="#deck" className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10">
            Open the pitch deck
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="no-print border-t border-white/10 py-10">
      <div className="container-pdq flex flex-col items-center justify-between gap-4 text-sm text-white/45 sm:flex-row">
        <Wordmark />
        <p>Tailr CRM — promotional demo. Sample data only; no real customer data.</p>
        <p>© {new Date().getFullYear()} Tailr</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [showCrm, setShowCrm] = useState(false);
  const openCrm = () => {
    setShowCrm(true);
    window.scrollTo(0, 0);
  };

  if (showCrm) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <CrmDemo onExit={() => setShowCrm(false)} />
      </div>
    );
  }

  return (
    <>
      <Nav onOpenCrm={openCrm} />
      <main>
        <Hero onOpenCrm={openCrm} />
        <Stats />
        <Features />
        <AISection />
        <CrmBanner onOpenCrm={openCrm} />
        <Prototype />
        <PitchDeck />
        <Integrations />
        <CTA onOpenCrm={openCrm} />
      </main>
      <Footer />
    </>
  );
}
