import { useState } from 'react';
import './crm.css';
import { WebCrm } from './WebCrm';
import { MobileCrm } from './MobileCrm';

type Surface = 'web' | 'mobile';

/**
 * Embedded, fully-clickable PDQ CRM demo. Reproduces the real app shell —
 * the navy-sidebar web office app (8 dashboards, every tab) and the Expo
 * mobile field/office app — running entirely on static, anonymized demo data.
 */
export default function CrmDemo({ onExit }: { onExit?: () => void }) {
  const [surface, setSurface] = useState<Surface>('web');

  return (
    <div className="crm-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div className="crm-switchbar no-print">
        {onExit && (
          <button className="crm-btn" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }} onClick={onExit}>
            ← Back to site
          </button>
        )}
        <strong style={{ fontSize: 14 }}>PDQ Restoration CRM — live demo</strong>
        <div className="crm-seg" style={{ marginLeft: 'auto' }}>
          <button className={surface === 'web' ? 'active' : ''} onClick={() => setSurface('web')}>🖥️ Web (Office)</button>
          <button className={surface === 'mobile' ? 'active' : ''} onClick={() => setSurface('mobile')}>📱 Mobile (Field)</button>
        </div>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Sample data only — no live customer data</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {surface === 'web' ? <WebCrm /> : <MobileCrm />}
      </div>
    </div>
  );
}
