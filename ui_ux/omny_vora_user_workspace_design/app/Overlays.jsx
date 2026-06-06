/* Omnyvora Workspace — Notifications drawer + confirmation modal */

function NotificationsDrawer({ open, notifications, onClose, onMarkAll, onToast }) {
  const has = notifications.length > 0;
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(17,17,17,0.45)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity var(--duration-base) var(--ease)',
      }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, height: '100%', width: 408, zIndex: 81,
        background: 'var(--bg-overlay)', borderLeft: '0.5px solid var(--border-default)', boxShadow: 'var(--shadow-3)',
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform var(--duration-slow) var(--ease)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderBottom: '0.5px solid var(--border-default)' }}>
          <div className="ds-display-sm" style={{ flex: 1 }}>Notifications</div>
          {has && (
            <span className="link-accent ds-body-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }} onClick={onMarkAll}>
              <Icon name="checkCheck" size={15} />Mark all as read
            </span>
          )}
          <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {has ? notifications.map((n, i) => (
            <div key={n.id} style={{ borderBottom: i < notifications.length - 1 ? '0.5px solid var(--border-default)' : 'none' }}>
              <NotifItem n={n} onClick={() => onToast({ tone: 'info', title: n.title, msg: 'Opened notification.' })} />
            </div>
          )) : (
            <div style={{ paddingTop: 40 }}>
              <EmptyState icon="inbox" title="You're all caught up" desc="New notifications about your account and apps will show up here." />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function ConfirmModal({ config, onClose, onConfirm }) {
  const [typed, setTyped] = React.useState('');
  if (!config) return null;
  const danger = config.tone === 'danger';
  const warning = config.tone === 'warning';
  const blocked = config.requireType && typed.trim().toUpperCase() !== 'DELETE';

  const confirmBtn = warning ? (
    <button onClick={onConfirm} style={{ height: 38, padding: '0 16px', borderRadius: 'var(--radius-button)', cursor: 'pointer', border: 'none',
      background: 'var(--status-warning)', color: '#fff', font: '500 13px var(--font-sans)' }}>{config.confirmLabel}</button>
  ) : (
    <Button variant={danger ? 'danger' : 'accent'} disabled={blocked} onClick={onConfirm}>{config.confirmLabel}</Button>
  );

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(17,17,17,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'omFade .18s ease' }}>
      <div className="card" onClick={e => e.stopPropagation()} style={{ width: 440, background: 'var(--bg-overlay)',
        borderRadius: 'var(--radius-modal)', boxShadow: 'var(--shadow-3)', animation: 'omPop .18s cubic-bezier(.16,1,.3,1)' }}>
        <div style={{ padding: '24px 24px 20px', display: 'flex', gap: 16 }}>
          <div style={{ width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-icon)',
            background: danger ? 'var(--status-error-bg)' : 'var(--status-warning-bg)',
            color: danger ? 'var(--status-error)' : 'var(--status-warning)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="alertTriangle" size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="ds-display-sm" style={{ color: 'var(--text-primary)' }}>{config.title}</div>
            <div className="ds-body-md" style={{ color: 'var(--text-secondary)', marginTop: 6 }}>{config.body}</div>
            {config.requireType && (
              <div style={{ marginTop: 16 }}>
                <Field label='Type "DELETE" to confirm' value={typed} onChange={e => setTyped(e.target.value)} placeholder="DELETE" />
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 24px', borderTop: '0.5px solid var(--border-default)' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          {confirmBtn}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NotificationsDrawer, ConfirmModal });
