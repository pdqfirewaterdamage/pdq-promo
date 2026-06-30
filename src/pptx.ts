import PptxGenJS from 'pptxgenjs';
import { SLIDES, type Slide } from './data';

const NAVY = '0B1D3A';
const NAVY_DARK = '060F20';
const ACCENT = 'FF5C0A';
const WHITE = 'FFFFFF';
const MUTED = 'B9C2D6';

// Build and trigger download of a .pptx mirroring the on-screen deck.
export async function downloadPptx(): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'TLR16x9', width: 13.333, height: 7.5 });
  pptx.layout = 'TLR16x9';
  pptx.author = 'Tailr';
  pptx.company = 'Tailr';
  pptx.title = 'Tailr CRM';

  const W = 13.333;

  SLIDES.forEach((slide: Slide) => {
    const s = pptx.addSlide();
    s.background = { color: NAVY };

    // gradient-ish bottom band + accent bar
    s.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: W, h: 7.5, fill: { color: NAVY_DARK, transparency: 55 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: W, h: 0.12, fill: { color: ACCENT },
    });
    // accent corner circle
    s.addShape(pptx.ShapeType.ellipse, {
      x: W - 2.2, y: -1.4, w: 3.4, h: 3.4, fill: { color: ACCENT, transparency: 78 }, line: { type: 'none' },
    });

    // wordmark
    s.addText(
      [
        { text: 'Tailr', options: { color: WHITE, bold: true } },
        { text: ' · CRM', options: { color: ACCENT, bold: true } },
      ],
      { x: W - 2.6, y: 0.22, w: 2.3, h: 0.4, align: 'right', fontSize: 12, fontFace: 'Arial' },
    );

    const left = 0.95;
    let y = 0.95;

    if (slide.eyebrow) {
      s.addText(slide.eyebrow.toUpperCase(), {
        x: left, y, w: 11, h: 0.4, color: ACCENT, bold: true, fontSize: 14,
        charSpacing: 3, fontFace: 'Arial',
      });
      y += 0.55;
    }

    const isTitle = slide.kind === 'title';
    s.addText(slide.title, {
      x: left, y, w: 11.4, h: isTitle ? 2.0 : 1.5,
      color: WHITE, bold: true, fontSize: isTitle ? 40 : 32,
      fontFace: 'Arial', valign: 'top',
    });
    y += isTitle ? 2.0 : 1.4;

    if (slide.subtitle) {
      s.addText(slide.subtitle, {
        x: left, y, w: 10.8, h: 1.4, color: MUTED, fontSize: 18,
        fontFace: 'Arial', valign: 'top',
      });
      y += 1.4;
    }

    if (slide.bullets) {
      s.addText(
        slide.bullets.map((b) => ({
          text: b,
          options: { bullet: { code: '2022', indent: 18 }, color: WHITE, fontSize: 18, paraSpaceAfter: 8 },
        })),
        { x: left, y, w: 11, h: 4.2, fontFace: 'Arial', valign: 'top' },
      );
    }

    if (slide.metrics) {
      const gap = 0.3;
      const cardW = (11.4 - gap * 3) / 4;
      slide.metrics.forEach((m, idx) => {
        const cx = left + idx * (cardW + gap);
        s.addShape(pptx.ShapeType.roundRect, {
          x: cx, y: y + 0.1, w: cardW, h: 1.9, fill: { color: WHITE, transparency: 92 },
          line: { color: WHITE, transparency: 80, width: 1 }, rectRadius: 0.1,
        });
        s.addText(m.value, {
          x: cx, y: y + 0.3, w: cardW, h: 0.8, align: 'center',
          color: ACCENT, bold: true, fontSize: 30, fontFace: 'Arial',
        });
        s.addText(m.label, {
          x: cx + 0.1, y: y + 1.15, w: cardW - 0.2, h: 0.7, align: 'center',
          color: MUTED, fontSize: 11, fontFace: 'Arial', valign: 'top',
        });
      });
    }

    if (slide.footer) {
      s.addText(slide.footer, {
        x: left, y: 6.7, w: 11, h: 0.5, color: '8A93A8', fontSize: 12,
        bold: true, fontFace: 'Arial',
      });
    }
  });

  await pptx.writeFile({ fileName: 'Tailr-CRM.pptx' });
}
