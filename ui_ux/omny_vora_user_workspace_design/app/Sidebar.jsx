/* Omnyvora Workspace — Sidebar (profile-led [spec] + brand variants, collapsible) */

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'applications', label: 'Applications', icon: 'grid' },
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'account', label: 'Account', icon: 'shield' },
];

function NavItem({ item, active, collapsed, onClick }) {
  return (
    <button onClick={onClick} title={collapsed ? item.label : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, width: '100%',
        height: 40, padding: collapsed ? 0 : '0 11px', justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 'var(--radius-button)', border: '0.5px solid transparent', cursor: 'pointer',
        background: active ? 'var(--accent-subtle)' : 'transparent',
        color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
        font: `${active ? 500 : 400} 14px var(--font-sans)`,
        transition: 'background var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease)',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-surface-raised)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}>
      <Icon name={item.icon} size={18} stroke={active ? 2 : 1.85} />
      {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
      {!collapsed && active && <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--accent-primary)' }} />}
    </button>
  );
}

function AvatarSlot({ size, collapsed }) {
  /* Droppable photo avatar (shared id so it persists & shows across the app) */
  return (
    <image-slot id="om-user-avatar" shape="circle" placeholder="Photo"
      style={{ width: size, height: size, flex: 'none', display: 'block', borderRadius: '50%', border: '0.5px solid var(--border-default)' }} />
  );
}

function NotifRow({ collapsed, unread, onClick }) {
  return (
    <button onClick={onClick} title={collapsed ? 'Notifications' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, width: '100%', height: 40,
        padding: collapsed ? 0 : '0 11px', justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 'var(--radius-button)', border: '0.5px solid transparent', cursor: 'pointer',
        background: 'transparent', color: 'var(--text-secondary)', font: '400 14px var(--font-sans)',
        transition: 'background var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease)', position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-raised)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
      <span style={{ position: 'relative', display: 'flex' }}>
        <Icon name="bell" size={18} stroke={1.85} />
        {unread > 0 && <span style={{ position: 'absolute', top: -3, right: -3, width: 7, height: 7, borderRadius: 4, background: 'var(--status-error)', border: '1.5px solid var(--bg-surface)' }} />}
      </span>
      {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>Notifications</span>}
      {!collapsed && unread > 0 && (
        <span style={{ minWidth: 20, height: 20, padding: '0 6px', borderRadius: 'var(--radius-pill)', background: 'var(--status-error)', color: '#fff',
          font: '500 11px var(--font-sans)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>
      )}
    </button>
  );
}

function LogoutRow({ collapsed, onClick }) {
  return (
    <button onClick={onClick} title={collapsed ? 'Log out' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, width: '100%', height: 40,
        padding: collapsed ? 0 : '0 11px', justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 'var(--radius-button)', border: '0.5px solid transparent', cursor: 'pointer',
        background: 'transparent', color: 'var(--text-secondary)', font: '400 14px var(--font-sans)',
        transition: 'background var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--status-error-bg)'; e.currentTarget.style.color = 'var(--status-error)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
      <Icon name="logout" size={18} stroke={1.85} />
      {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>Log out</span>}
    </button>
  );
}

function Sidebar({ variant, nav, setNav, collapsed, setCollapsed, unread, onNotify, onLogout }) {
  const W = collapsed ? 76 : 256;
  const pad = collapsed ? 12 : 16;
  const brand = variant === 'brand';

  return (
    <nav style={{
      width: W, flex: 'none', height: '100%', background: 'var(--bg-surface)',
      borderRight: '0.5px solid var(--border-default)', display: 'flex', flexDirection: 'column',
      padding: pad, gap: 4, transition: 'width var(--duration-base) var(--ease)', position: 'relative',
    }}>

      {/* ---- TOP ---- */}
      {brand ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '4px 0 12px' : '4px 8px 14px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <img src="assets/logo-mark-black.png" alt="" style={{ width: 26, height: 26, objectFit: 'contain', flex: 'none' }} />
          {!collapsed && <span style={{ font: '600 17px var(--font-sans)', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>Omnyvora</span>}
        </div>
      ) : (
        <div style={{
          display: 'flex', flexDirection: collapsed ? 'column' : 'row', alignItems: 'center',
          gap: collapsed ? 0 : 11, padding: collapsed ? '4px 0 10px' : '6px 8px 14px',
        }}>
          <AvatarSlot size={collapsed ? 40 : 40} collapsed={collapsed} />
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '600 14px var(--font-sans)', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{USER.name}</div>
              <div style={{ font: '400 12px var(--font-sans)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{USER.email}</div>
            </div>
          )}
        </div>
      )}

      <div style={{ height: '0.5px', background: 'var(--border-default)', margin: collapsed ? '0 0 8px' : '0 0 10px' }} />

      {brand && !collapsed && <div className="label" style={{ padding: '2px 10px 6px', color: 'var(--text-tertiary)' }}>Menu</div>}

      {/* ---- NAV ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV.map(it => <NavItem key={it.id} item={it} active={nav === it.id} collapsed={collapsed} onClick={() => setNav(it.id)} />)}
      </div>

      {/* ---- BOTTOM ---- */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {brand && (
          <div style={{ height: '0.5px', background: 'var(--border-default)', margin: '6px 0 8px' }} />
        )}
        {brand && !collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 10px 8px' }}>
            <AvatarSlot size={32} collapsed={false} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '500 13px var(--font-sans)', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{USER.name}</div>
              <div style={{ font: '400 11px var(--font-sans)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{USER.email}</div>
            </div>
          </div>
        )}
        {!brand && <div style={{ height: '0.5px', background: 'var(--border-default)', margin: '6px 0 8px' }} />}
        <NotifRow collapsed={collapsed} unread={unread} onClick={onNotify} />
        <LogoutRow collapsed={collapsed} onClick={onLogout} />
      </div>

      {/* ---- COLLAPSE TOGGLE ---- */}
      <button onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand' : 'Collapse'}
        style={{
          position: 'absolute', top: 18, right: -11, width: 22, height: 22, borderRadius: '50%',
          background: 'var(--bg-surface-raised)', border: '0.5px solid var(--border-strong)', boxShadow: 'var(--shadow-1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', zIndex: 5, padding: 0,
        }}>
        <Icon name="chevronRight" size={13} style={{ transform: collapsed ? 'none' : 'rotate(180deg)', transition: 'transform var(--duration-base) var(--ease)' }} />
      </button>
    </nav>
  );
}

Object.assign(window, { Sidebar, NAV });
