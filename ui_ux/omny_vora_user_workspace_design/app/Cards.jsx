/* Omnyvora Workspace — shared cards: AppCard, MiniStat, RingStat, NotifItem */

function MiniStat({ icon, value, label, bg, fg }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg-surface-raised)',
      border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-card)', padding: '18px 20px' }}>
      <div style={{ width: 44, height: 44, flex: 'none', borderRadius: 'var(--radius-icon)', background: bg || 'var(--accent-subtle)', color: fg || 'var(--accent-text)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={21} stroke={1.85} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ font: '600 28px/1 var(--font-sans)', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>{value}</div>
        <div className="label" style={{ color: 'var(--text-tertiary)', marginTop: 6 }}>{label}</div>
      </div>
    </div>
  );
}

/* Profile-completion ring (conic gradient) */
function RingStat({ percent, label, sub }) {
  const deg = Math.round(percent * 3.6);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: 'var(--bg-surface-raised)',
      border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-card)', padding: '18px 20px' }}>
      <div style={{ width: 56, height: 56, flex: 'none', borderRadius: '50%',
        background: `conic-gradient(var(--accent-primary) ${deg}deg, var(--accent-subtle) 0)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--bg-surface-raised)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', font: '600 14px var(--font-sans)', color: 'var(--text-primary)' }}>{percent}%</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ font: '500 15px var(--font-sans)', color: 'var(--text-primary)' }}>{label}</div>
        <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}

function AppCard({ app, showCategory, onOpen }) {
  return (
    <div className="app-card" style={{ display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--bg-surface-raised)',
      border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-card)', padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-icon)', background: app.bg, color: app.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={app.icon} size={24} stroke={1.75} />
        </div>
        {showCategory && <Badge tone="neutral">{app.category}</Badge>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ font: '600 15px var(--font-sans)', color: 'var(--text-primary)' }}>{app.name}</div>
        <div className="ds-body-sm clamp-2" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{app.desc}</div>
      </div>
      <div>
        <Button variant="secondary" size="sm" trailing="arrowRight" onClick={() => onOpen && onOpen(app)}>
          {showCategory ? 'Open app' : 'Open'}
        </Button>
      </div>
    </div>
  );
}

function NotifItem({ n, onClick, compact }) {
  return (
    <div className="notif-item" onClick={onClick} style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: compact ? '14px 20px' : '16px 20px', cursor: 'pointer',
      background: !n.read ? 'var(--accent-subtle)' : 'transparent',
      transition: 'background var(--duration-fast) var(--ease)',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, flex: 'none', marginTop: 6,
        background: !n.read ? 'var(--accent-primary)' : 'var(--border-strong)' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div style={{ font: `${n.read ? 400 : 500} 14px var(--font-sans)`, color: 'var(--text-primary)', flex: 1, minWidth: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</div>
          <div className="ds-caption" style={{ color: 'var(--text-tertiary)', flex: 'none' }}>{n.time}</div>
        </div>
        <div className="ds-body-sm clamp-2" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{n.body}</div>
      </div>
    </div>
  );
}

Object.assign(window, { MiniStat, RingStat, AppCard, NotifItem });
