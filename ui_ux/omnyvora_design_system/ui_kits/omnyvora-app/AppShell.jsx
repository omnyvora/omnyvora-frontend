/* Omnyvora UI Kit — App shell: Sidebar (tool switcher) + TopBar */

const TOOLS = [
  { id: 'portfolio', label: 'Portfolio', icon: 'layers' },
  { id: 'photo', label: 'Photo', icon: 'image' },
  { id: 'productivity', label: 'Productivity', icon: 'zap' },
];

function Sidebar({ theme, tool, setTool, nav, setNav }) {
  const logo = theme === 'dark' ? '../../assets/logo-mark-white.png' : '../../assets/logo-mark-black.png';
  const items = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'projects', label: 'Projects', icon: 'folder' },
    { id: 'starred', label: 'Starred', icon: 'star' },
  ];
  return (
    <nav style={{ width: 'var(--sidebar-width)', flex: 'none', background: 'var(--bg-surface)', borderRight: '0.5px solid var(--border-default)', display: 'flex', flexDirection: 'column', padding: '16px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 16px' }}>
        <img src={logo} style={{ width: 26, height: 26, objectFit: 'contain' }} alt="" />
        <span style={{ font: '600 16px var(--font-sans)', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>Omnyvora</span>
      </div>

      <div className="label" style={{ padding: '8px 8px 6px' }}>Tools</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {TOOLS.map(t => {
          const active = t.id === tool;
          return (
            <div key={t.id} data-tool={t.id} onClick={() => setTool(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 10px', borderRadius: 8, cursor: 'pointer',
                background: active ? 'var(--accent-subtle)' : 'transparent',
                color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
                font: active ? '500 13px var(--font-sans)' : '400 13px var(--font-sans)' }}>
              <Icon name={t.icon} size={16} />{t.label}
              {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: 3, background: 'var(--accent-primary)' }} />}
            </div>
          );
        })}
      </div>

      <div className="label" style={{ padding: '18px 8px 6px' }}>Workspace</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(it => {
          const active = nav === it.id;
          return (
            <div key={it.id} onClick={() => setNav(it.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, height: 34, padding: '0 10px', borderRadius: 7, cursor: 'pointer',
                background: active ? 'var(--bg-surface-raised)' : 'transparent',
                boxShadow: active ? 'var(--shadow-1)' : 'none',
                border: active ? '0.5px solid var(--border-default)' : '0.5px solid transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                font: active ? '500 13px var(--font-sans)' : '400 13px var(--font-sans)' }}>
              <Icon name={it.icon} size={16} />{it.label}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div onClick={() => setNav('settings')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, height: 34, padding: '0 10px', borderRadius: 7, cursor: 'pointer',
            color: nav === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)', font: '400 13px var(--font-sans)' }}>
          <Icon name="settings" size={16} />Settings
        </div>
      </div>
    </nav>
  );
}

function TopBar({ title, email, theme, setTheme, onNotify, unread, onLogout }) {
  const [menu, setMenu] = React.useState(false);
  const initials = (email || 'OV').slice(0, 2).toUpperCase();
  return (
    <header style={{ height: 60, flex: 'none', background: 'var(--bg-surface-raised)', borderBottom: '0.5px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', position: 'relative', zIndex: 20 }}>
      <div style={{ font: '500 17px var(--font-sans)', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>{title}</div>
      <div className="input-wrap" style={{ marginLeft: 8, width: 240 }}>
        <span className="input-icon input-icon--lead"><Icon name="search" size={15} /></span>
        <input className="input input--has-lead" style={{ height: 34 }} placeholder="Search…" />
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Button variant="ghost" size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ width: 34, padding: 0 }} title="Toggle theme">
          <Icon name={theme === 'dark' ? 'eye' : 'grid'} size={16} />
        </Button>
        <button className="btn btn--ghost btn--sm" onClick={onNotify} style={{ width: 34, padding: 0, position: 'relative' }}>
          <Icon name="bell" size={17} />
          {unread > 0 && <span style={{ position: 'absolute', top: 5, right: 6, width: 7, height: 7, borderRadius: 4, background: 'var(--status-error)', border: '1.5px solid var(--bg-surface-raised)' }} />}
        </button>
        <Button variant="accent" size="sm" leading="plus">New</Button>
        <div style={{ position: 'relative' }}>
          <div onClick={() => setMenu(m => !m)} style={{ cursor: 'pointer' }}><Avatar size="md" initials={initials} /></div>
          {menu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setMenu(false)} />
              <div className="menu" style={{ position: 'absolute', right: 0, top: 42, zIndex: 50, minWidth: 200 }}>
                <div style={{ padding: '6px 10px 10px', borderBottom: '0.5px solid var(--border-default)', marginBottom: 6 }}>
                  <div style={{ font: '500 13px var(--font-sans)', color: 'var(--text-primary)' }}>Signed in</div>
                  <div className="ds-body-sm" style={{ color: 'var(--text-secondary)' }}>{email}</div>
                </div>
                <div className="menu__item"><Icon name="user" size={15} />Profile</div>
                <div className="menu__item"><Icon name="settings" size={15} />Settings</div>
                <div className="menu__divider" />
                <div className="menu__item menu__item--danger" onClick={onLogout}><Icon name="logout" size={15} />Log out</div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

Object.assign(window, { Sidebar, TopBar, TOOLS });
