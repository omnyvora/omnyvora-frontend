/* Omnyvora UI Kit — Dashboard views (overview / projects / starred / settings) + modal */

const TOOL_META = {
  portfolio: { label: 'Portfolio', tagline: 'Showcase your work', stats: [['Live projects', '12', '', '8.2%', 'up'], ['Total views', '48.6', 'k', '12.4%', 'up'], ['Avg. time', '2', 'm', '3.1%', 'down']] },
  photo: { label: 'Photo', tagline: 'Organize every shoot', stats: [['Albums', '34', '', '5 new', 'up'], ['Storage used', '64', 'GB', '3.1%', 'down'], ['Shared', '9', '/12', '', '']] },
  productivity: { label: 'Productivity', tagline: 'Get things done', stats: [['Open tasks', '27', '', '4 today', 'up'], ['Completed', '143', '', '18%', 'up'], ['Focus time', '6.2', 'h', '0.4h', 'down']] },
};

const SAMPLE_PROJECTS = {
  portfolio: [['Q3 Launch site', 'Live', 'success', '2d ago'], ['Brand refresh', 'Draft', 'neutral', '5d ago'], ['Case study — Acme', 'Live', 'success', '1w ago'], ['Portfolio v4', 'Review', 'warning', '2w ago']],
  photo: [['Tokyo 2026', 'Shared', 'accent', '1d ago'], ['Studio — June', 'Private', 'neutral', '3d ago'], ['Product shots', 'Shared', 'accent', '6d ago'], ['Wedding — M&K', 'Archived', 'neutral', '3w ago']],
  productivity: [['Sprint 24 board', 'Active', 'success', '1h ago'], ['Roadmap Q3', 'Active', 'success', '1d ago'], ['Hiring pipeline', 'Paused', 'warning', '4d ago'], ['Personal OKRs', 'Active', 'success', '1w ago']],
};

function Dashboard({ tool, nav, onNewProject, onDeleteProject }) {
  const meta = TOOL_META[tool];
  const projects = SAMPLE_PROJECTS[tool];

  if (nav === 'settings') return <SettingsView tool={tool} />;
  if (nav === 'starred') {
    return (
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', width: '100%', padding: '32px' }}>
        <div className="card" style={{ background: 'var(--bg-surface-raised)' }}>
          <div className="empty">
            <div className="empty__icon"><Icon name="star" size={24} stroke={1.75} /></div>
            <div className="empty__title">Nothing starred yet</div>
            <div className="empty__desc">Star a {meta.label.toLowerCase()} project to pin it here for quick access.</div>
            <Button variant="accent" size="sm" leading="plus" onClick={onNewProject} style={{ marginTop: 4 }}>New project</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', width: '100%', padding: '32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {nav === 'overview' && (
        <>
          <div>
            <div className="label" style={{ color: 'var(--accent-text)' }}>{meta.label}</div>
            <div className="ds-display-lg" style={{ color: 'var(--text-primary)', marginTop: 4 }}>Good morning, Alex</div>
            <div className="ds-body-md" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{meta.tagline} — here’s what’s happening today.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--grid-gutter)' }}>
            {meta.stats.map((s, i) => <StatCard key={i} label={s[0]} value={s[1]} unit={s[2]} delta={s[3]} dir={s[4]} />)}
          </div>
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="ds-display-sm" style={{ color: 'var(--text-primary)' }}>{nav === 'overview' ? 'Recent projects' : 'All projects'}</div>
        <Button variant="secondary" size="sm" leading="plus" onClick={onNewProject}>New project</Button>
      </div>

      <div className="card" style={{ background: 'var(--bg-surface-raised)' }}>
        {projects.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < projects.length - 1 ? '0.5px solid var(--border-default)' : 'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-icon)', background: 'var(--accent-subtle)', color: 'var(--accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <Icon name={TOOLS.find(t => t.id === tool).icon} size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '500 14px var(--font-sans)', color: 'var(--text-primary)' }}>{p[0]}</div>
              <div className="ds-body-sm" style={{ color: 'var(--text-tertiary)' }}>Updated {p[3]}</div>
            </div>
            <Badge tone={p[2]}>{p[1]}</Badge>
            <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} onClick={() => onDeleteProject(p[0])}><Icon name="more" size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView({ tool }) {
  const [notif, setNotif] = React.useState(true);
  const [weekly, setWeekly] = React.useState(false);
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', padding: '32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="ds-display-md" style={{ color: 'var(--text-primary)' }}>Settings</div>
      <div className="card" style={{ background: 'var(--bg-surface-raised)' }}>
        <div className="card__header"><div className="ds-display-sm">Profile</div></div>
        <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar size="xl" initials="AM" />
            <div><Button variant="secondary" size="sm">Change photo</Button></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Full name" defaultValue="Alex Morgan" />
            <Field label="Email" leading="mail" defaultValue="alex@omnyvora.io" />
          </div>
        </div>
      </div>
      <div className="card" style={{ background: 'var(--bg-surface-raised)' }}>
        <div className="card__header"><div className="ds-display-sm">Notifications</div></div>
        <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Row title="Push notifications" desc="Get notified about activity in your workspace." el={<Switch checked={notif} onChange={setNotif} />} border />
          <Row title="Weekly digest" desc="A Monday summary of everything that changed." el={<Switch checked={weekly} onChange={setWeekly} />} />
        </div>
      </div>
    </div>
  );
}

function Row({ title, desc, el, border }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: border ? '0.5px solid var(--border-default)' : 'none' }}>
      <div style={{ flex: 1 }}>
        <div style={{ font: '500 14px var(--font-sans)', color: 'var(--text-primary)' }}>{title}</div>
        <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{desc}</div>
      </div>
      {el}
    </div>
  );
}

function NewProjectModal({ tool, onClose, onCreate }) {
  const [name, setName] = React.useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(17,17,17,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'omFade .18s ease' }} onClick={onClose}>
      <div className="card" onClick={e => e.stopPropagation()} style={{ width: 420, background: 'var(--bg-overlay)', borderRadius: 'var(--radius-modal)', boxShadow: 'var(--shadow-3)', animation: 'omPop .18s cubic-bezier(.16,1,.3,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '0.5px solid var(--border-default)' }}>
          <div className="ds-display-sm">New {TOOL_META[tool].label.toLowerCase()} project</div>
          <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ padding: 20 }}>
          <Field label="Project name" placeholder="Untitled project" autoFocus value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 20px', borderTop: '0.5px solid var(--border-default)' }}>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="accent" size="sm" onClick={() => onCreate(name || 'Untitled project')}>Create project</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, NewProjectModal, TOOL_META });
