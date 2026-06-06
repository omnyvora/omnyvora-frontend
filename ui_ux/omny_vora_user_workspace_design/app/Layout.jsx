/* Omnyvora Workspace — layout helpers shared across sections */

function Page({ children, max = 'var(--content-max)' }) {
  return (
    <div style={{ maxWidth: max, margin: '0 auto', width: '100%', padding: '36px 40px 56px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {children}
    </div>
  );
}

/* Page header: optional eyebrow + title + subtitle */
function PageHead({ eyebrow, title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
      <div>
        {eyebrow && <div className="label" style={{ color: 'var(--accent-text)', marginBottom: 6 }}>{eyebrow}</div>}
        <div className="ds-display-lg" style={{ color: 'var(--text-primary)' }}>{title}</div>
        {subtitle && <div className="ds-body-md" style={{ color: 'var(--text-secondary)', marginTop: 6 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

/* Row with a section title + optional "View all" link */
function SectionRow({ title, linkLabel, onLink }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="ds-display-sm" style={{ color: 'var(--text-primary)' }}>{title}</div>
      {linkLabel && (
        <span className="link-accent ds-body-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={onLink}>
          {linkLabel}<Icon name="arrowRight" size={14} />
        </span>
      )}
    </div>
  );
}

/* Vertical sub-nav (Profile / Account two-panel pattern) */
function SubNav({ items, value, onChange, width = 200 }) {
  return (
    <div style={{ width, flex: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {items.map(it => {
        const active = it.id === value;
        return (
          <button key={it.id} onClick={() => onChange(it.id)}
            className="subnav-item"
            style={{
              display: 'flex', alignItems: 'center', gap: 11, height: 40, padding: '0 12px', width: '100%',
              borderRadius: 'var(--radius-button)', border: '0.5px solid transparent', cursor: 'pointer', textAlign: 'left',
              background: active ? 'var(--accent-subtle)' : 'transparent',
              color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
              font: `${active ? 500 : 400} 14px var(--font-sans)`,
              transition: 'background var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease)',
            }}
            data-active={active ? '1' : '0'}>
            {it.icon && <Icon name={it.icon} size={17} stroke={active ? 2 : 1.85} />}
            <span style={{ flex: 1 }}>{it.label}</span>
            {active && <Icon name="chevronRight" size={15} />}
          </button>
        );
      })}
    </div>
  );
}

/* Horizontal underline tabs (Identity) */
function Tabs({ items, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '0.5px solid var(--border-default)' }}>
      {items.map(it => {
        const active = it.id === value;
        return (
          <button key={it.id} onClick={() => onChange(it.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, height: 42, padding: '0 14px', cursor: 'pointer',
              background: 'transparent', border: 'none', borderBottom: `2px solid ${active ? 'var(--accent-primary)' : 'transparent'}`,
              marginBottom: '-0.5px', color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              font: `${active ? 500 : 400} 14px var(--font-sans)`,
              transition: 'color var(--duration-fast) var(--ease), border-color var(--duration-fast) var(--ease)',
            }}>
            {it.icon && <Icon name={it.icon} size={16} stroke={1.85} />}{it.label}
            {typeof it.count === 'number' && it.count > 0 && (
              <span style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: 'var(--radius-pill)', background: 'var(--bg-surface)', border: '0.5px solid var(--border-default)',
                color: 'var(--text-secondary)', font: '500 11px var(--font-sans)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{it.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* Empty state (DS .empty) with optional action */
function EmptyState({ icon, title, desc, actionLabel, onAction }) {
  return (
    <div className="empty">
      <div className="empty__icon" style={{ width: 52, height: 52 }}><Icon name={icon} size={24} stroke={1.75} /></div>
      <div className="empty__title">{title}</div>
      <div className="empty__desc">{desc}</div>
      {actionLabel && <Button variant="secondary" size="sm" leading="plus" onClick={onAction} style={{ marginTop: 4 }}>{actionLabel}</Button>}
    </div>
  );
}

Object.assign(window, { Page, PageHead, SectionRow, SubNav, Tabs, EmptyState });
