/* Omnyvora Workspace — Section 1: Dashboard (standard + hub variants) */

const TODAY = 'Thursday, June 5, 2026';

function WelcomeBanner() {
  return (
    <div>
      <div className="ds-display-lg" style={{ color: 'var(--text-primary)' }}>Welcome back, {USER.first}</div>
      <div className="ds-body-md" style={{ color: 'var(--text-secondary)', marginTop: 6 }}>{TODAY}</div>
    </div>
  );
}

function RecentNotifications({ notifications, onViewAll, onOpenNotifs }) {
  const recent = notifications.slice(0, 4);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <SectionRow title="Recent notifications" linkLabel="View all" onLink={onViewAll} />
      <div className="card">
        {recent.map((n, i) => (
          <div key={n.id} style={{ borderBottom: i < recent.length - 1 ? '0.5px solid var(--border-default)' : 'none' }}>
            <NotifItem n={n} compact onClick={onOpenNotifs} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ dash, unread, notifications, onNav, onOpenApp, onOpenNotifs }) {
  const apps = APPS;

  if (dash === 'hub') {
    return (
      <Page>
        <WelcomeBanner />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 28, alignItems: 'start' }}>
          {/* main column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionRow title="Your applications" linkLabel="View all" onLink={() => onNav('applications')} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {apps.map(a => <AppCard key={a.id} app={a} onOpen={onOpenApp} />)}
            </div>
          </div>
          {/* right rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 36 }}>
            <RingStat percent={USER.completion} label="Profile completion" sub="Add experience to reach 100%." />
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: '0.5px solid var(--border-default)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-icon)', background: 'var(--accent-subtle)', color: 'var(--accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="grid" size={19} stroke={1.85} /></div>
                <div style={{ flex: 1 }}><div style={{ font: '600 20px var(--font-sans)', color: 'var(--text-primary)' }}>{apps.length}</div><div className="label" style={{ color: 'var(--text-tertiary)', marginTop: 2 }}>Apps available</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-icon)', background: 'var(--red-50)', color: 'var(--status-error)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="bell" size={19} stroke={1.85} /></div>
                <div style={{ flex: 1 }}><div style={{ font: '600 20px var(--font-sans)', color: 'var(--text-primary)' }}>{unread}</div><div className="label" style={{ color: 'var(--text-tertiary)', marginTop: 2 }}>Unread alerts</div></div>
              </div>
            </div>
            <RecentNotifications notifications={notifications} onViewAll={onOpenNotifs} onOpenNotifs={onOpenNotifs} />
          </div>
        </div>
      </Page>
    );
  }

  /* standard */
  return (
    <Page>
      <WelcomeBanner />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--grid-gutter)' }}>
        <MiniStat icon="grid" value={apps.length} label="Applications available" />
        <MiniStat icon="bell" value={unread} label="Unread notifications" bg="var(--red-50)" fg="var(--status-error)" />
        <MiniStat icon="user" value={USER.completion + '%'} label="Profile completion" bg="var(--green-50)" fg="#0b7a52" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SectionRow title="Your applications" linkLabel="View all" onLink={() => onNav('applications')} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {apps.map(a => <AppCard key={a.id} app={a} onOpen={onOpenApp} />)}
        </div>
      </div>

      <RecentNotifications notifications={notifications} onViewAll={onOpenNotifs} onOpenNotifs={onOpenNotifs} />
    </Page>
  );
}

Object.assign(window, { Dashboard });
