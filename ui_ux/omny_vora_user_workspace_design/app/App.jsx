/* Omnyvora Workspace — App shell, state wiring, Tweaks */

const { useState, useCallback, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "sidebarStyle": "Brand",
  "dashLayout": "Hub",
  "accent": "Account",
  "collapsed": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [nav, setNav] = useState('dashboard');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [drawer, setDrawer] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toasts, setToasts] = useState([]);

  const unread = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const tool = t.accent.toLowerCase();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-tool', tool);
  }, [tool]);

  const pushToast = useCallback((cfg) => {
    const id = Date.now() + Math.random();
    setToasts(ts => [...ts, { id, ...cfg }]);
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 3600);
  }, []);
  const dismiss = useCallback(id => setToasts(ts => ts.filter(x => x.id !== id)), []);

  const openApp = (app) => pushToast({ tone: 'info', title: `Opening ${app.name}`, msg: 'Launching the app in this preview is a placeholder.' });
  const markAll = () => { setNotifications(ns => ns.map(n => ({ ...n, read: true }))); pushToast({ tone: 'success', title: 'All caught up', msg: 'Marked everything as read.' }); };

  const runConfirm = () => {
    const cfg = confirm; setConfirm(null);
    if (!cfg) return;
    if (cfg.onConfirm) { cfg.onConfirm(); return; }
    if (cfg.tone === 'danger') pushToast({ tone: 'error', title: 'Account deleted', msg: 'Your account and data were removed.' });
    else pushToast({ tone: 'warning', title: 'Account deactivated', msg: 'Log back in any time to reactivate.' });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-page)' }}>
      <Sidebar
        variant={t.sidebarStyle.toLowerCase()}
        nav={nav} setNav={(id) => { setNav(id); }}
        collapsed={t.collapsed} setCollapsed={(fn) => setTweak('collapsed', typeof fn === 'function' ? fn(t.collapsed) : fn)}
        unread={unread} onNotify={() => setDrawer(true)}
        onLogout={() => pushToast({ tone: 'info', title: 'Logged out', msg: 'You have signed out of Omnyvora.' })}
      />

      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        {nav === 'dashboard' && <Dashboard dash={t.dashLayout.toLowerCase()} unread={unread} notifications={notifications} onNav={setNav} onOpenApp={openApp} onOpenNotifs={() => setDrawer(true)} />}
        {nav === 'applications' && <Applications onOpenApp={openApp} />}
        {nav === 'profile' && <Profile onToast={pushToast} onConfirm={setConfirm} />}
        {nav === 'account' && <Account onToast={pushToast} onConfirm={setConfirm} />}
      </main>

      <NotificationsDrawer open={drawer} notifications={notifications} onClose={() => setDrawer(false)} onMarkAll={markAll} onToast={pushToast} />
      <ConfirmModal config={confirm} onClose={() => setConfirm(null)} onConfirm={runConfirm} />
      <ToastStack toasts={toasts} dismiss={dismiss} />

      <TweaksPanel>
        <TweakSection label="Layout" />
        <TweakRadio label="Sidebar" value={t.sidebarStyle} options={['Profile', 'Brand']} onChange={v => setTweak('sidebarStyle', v)} />
        <TweakRadio label="Dashboard" value={t.dashLayout} options={['Standard', 'Hub']} onChange={v => setTweak('dashLayout', v)} />
        <TweakToggle label="Collapse sidebar" value={t.collapsed} onChange={v => setTweak('collapsed', v)} />
        <TweakSection label="Theme" />
        <TweakSelect label="Accent" value={t.accent} options={['Account', 'Portfolio', 'Photo', 'Productivity']} onChange={v => setTweak('accent', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
