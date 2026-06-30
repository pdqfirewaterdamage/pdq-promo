import { useCallback, useEffect, useState } from 'react';
import { SLIDES, type Slide } from './data';

const NAVY = '#0b1d3a';
const ACCENT = '#ff5c0a';

function SlideBody({ slide, large }: { slide: Slide; large?: boolean }) {
  const h1 = large ? 'text-[2.6rem] leading-[1.08]' : 'text-2xl sm:text-3xl';
  const sub = large ? 'text-xl' : 'text-sm sm:text-base';

  return (
    <div className="flex h-full w-full flex-col justify-center px-[7%] py-[6%] text-left">
      {slide.eyebrow && (
        <div
          className={`font-bold uppercase tracking-[0.18em] ${large ? 'text-base' : 'text-xs'}`}
          style={{ color: ACCENT }}
        >
          {slide.eyebrow}
        </div>
      )}
      <h2 className={`mt-3 font-extrabold text-white ${h1}`}>{slide.title}</h2>

      {slide.subtitle && (
        <p className={`mt-4 max-w-3xl text-white/70 ${sub}`}>{slide.subtitle}</p>
      )}

      {slide.bullets && (
        <ul className={`mt-6 space-y-2.5 ${large ? 'text-lg' : 'text-sm'}`}>
          {slide.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-white/85">
              <span
                className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {slide.metrics && (
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {slide.metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10">
              <div
                className={`font-extrabold ${large ? 'text-4xl' : 'text-2xl'}`}
                style={{ color: ACCENT }}
              >
                {m.value}
              </div>
              <div className={`mt-1 text-white/60 ${large ? 'text-sm' : 'text-[11px]'}`}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {slide.footer && (
        <div className={`mt-auto pt-6 font-semibold text-white/40 ${large ? 'text-sm' : 'text-[11px]'}`}>
          {slide.footer}
        </div>
      )}
    </div>
  );
}

function SlideCanvas({ slide, large }: { slide: Slide; large?: boolean }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #060f20 100%)` }}
    >
      {/* accent corner */}
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-2xl"
        style={{ backgroundColor: ACCENT }}
      />
      <div
        className="absolute left-0 top-0 h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }}
      />
      {/* wordmark */}
      <div className="absolute right-6 top-5 z-10 text-xs font-black tracking-tight text-white/80">
        Tailr
      </div>
      <SlideBody slide={slide} large={large} />
    </div>
  );
}

export default function PitchDeck() {
  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);
  const total = SLIDES.length;

  const next = useCallback(() => setI((v) => Math.min(v + 1, total - 1)), [total]);
  const prev = useCallback(() => setI((v) => Math.max(v - 1, 0)), []);

  // keyboard nav (only when deck is roughly in view / focused area)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.getElementById('deck');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const visible = r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.2;
      if (!visible) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const printPdf = () => {
    document.body.classList.add('printing-deck');
    const cleanup = () => {
      document.body.classList.remove('printing-deck');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    // fallback cleanup if afterprint never fires
    setTimeout(cleanup, 4000);
    window.print();
  };

  const exportPptx = async () => {
    setBusy(true);
    try {
      const { downloadPptx } = await import('./pptx');
      await downloadPptx();
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="deck" className="container-pdq scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">The pitch</p>
        <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">The Tailr CRM story, in {total} slides</h2>
        <p className="mt-3 text-white/60">
          Navigate with the arrows or your keyboard. Export it as a PDF or a real PowerPoint.
        </p>
      </div>

      {/* on-screen deck */}
      <div className="mx-auto mt-10 max-w-4xl">
        <div className="deck-slide overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          <SlideCanvas slide={SLIDES[i]} large />
        </div>

        {/* controls */}
        <div className="no-print mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              disabled={i === 0}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white disabled:opacity-30"
            >
              ← Prev
            </button>
            <span className="text-sm tabular-nums text-white/60">
              {i + 1} / {total}
            </span>
            <button
              onClick={next}
              disabled={i === total - 1}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white disabled:opacity-30"
            >
              Next →
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={printPdf}
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              ⬇ Download PDF
            </button>
            <button
              onClick={exportPptx}
              disabled={busy}
              className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-bold text-white shadow-glow hover:bg-accent-600 disabled:opacity-60"
            >
              {busy ? 'Building…' : '⬇ Download PPTX'}
            </button>
          </div>
        </div>

        {/* thumbnails */}
        <div className="no-print mt-5 flex flex-wrap justify-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? 'w-7 bg-accent-500' : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* print-only container: every slide, one per page */}
      <div id="deck-print" className="hidden">
        {SLIDES.map((s, idx) => (
          <div key={idx} className="print-slide">
            <SlideCanvas slide={s} large />
          </div>
        ))}
      </div>
    </section>
  );
}
