/* Omnyvora Workspace — Section 3: Profile (Public profile + Identity) */

function AvatarUpload() {
  const ref = React.useRef(null);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <image-slot ref={ref} id="om-user-avatar" shape="circle" placeholder="Drop photo"
        style={{ width: 96, height: 96, flex: 'none', display: 'block', borderRadius: '50%', border: '0.5px solid var(--border-default)' }} />
      <div>
        <Button variant="secondary" size="sm" leading="upload" onClick={() => ref.current && ref.current.click()}>Upload photo</Button>
        <div className="ds-caption" style={{ color: 'var(--text-tertiary)', marginTop: 8 }}>Drag an image onto the circle, or click to browse.<br />JPG or PNG, up to 5 MB.</div>
      </div>
    </div>
  );
}

function PublicProfile({ onToast }) {
  const [form, setForm] = React.useState({ first: USER.first, last: USER.last, phone: USER.phone, dob: USER.dob, bio: USER.bio });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="card" style={{ maxWidth: 760 }}>
      <div className="card__header"><div className="ds-display-sm">Public profile</div></div>
      <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <AvatarUpload />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Field label="First name" value={form.first} onChange={e => set('first', e.target.value)} />
          <Field label="Last name" value={form.last} onChange={e => set('last', e.target.value)} />
          <Field label="Phone" leading="phone" value={form.phone} onChange={e => set('phone', e.target.value)} />
          <Field label="Date of birth" type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
        </div>
        <Textarea label="Bio" value={form.bio} onChange={e => set('bio', e.target.value)} style={{ minHeight: 104 }}
          hint="Shared across all Omnyvora services." />
      </div>
      <div className="card__footer">
        <Button variant="primary" onClick={() => onToast({ tone: 'success', title: 'Profile saved', msg: 'Your changes are live.' })}>Save changes</Button>
      </div>
    </div>
  );
}

function ProjectCard({ p, onDelete }) {
  return (
    <div className="row-hover" style={{ display: 'flex', gap: 16, padding: 18, border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-card)', background: 'var(--bg-surface-raised)' }}>
      <div style={{ width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-icon)', background: 'var(--accent-subtle)', color: 'var(--accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="folder" size={19} stroke={1.85} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ font: '600 14px var(--font-sans)', color: 'var(--text-primary)' }}>{p.title}</div>
          <Badge tone="neutral">{p.period}</Badge>
        </div>
        <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{p.role}</div>
        <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>{p.desc}</div>
        {p.link && (
          <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent-text)', font: '400 13px var(--font-mono)' }}>
            <Icon name="link" size={13} />{p.link}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 4, flex: 'none' }}>
        <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} title="Edit"><Icon name="pencil" size={15} /></button>
        <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} title="Remove" onClick={() => onDelete(p.id)}><Icon name="trash" size={15} /></button>
      </div>
    </div>
  );
}

function IdentityProjects({ onToast }) {
  const [items, setItems] = React.useState(IDENTITY.projects);
  if (!items.length) return <EmptyState icon="folder" title="No projects added yet" desc="Add your projects here. Shared across all Omnyvora services." actionLabel="Add project" onAction={() => onToast({ tone: 'info', title: 'Add project', msg: 'This flow is a placeholder in the preview.' })} />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="sm" leading="plus" onClick={() => onToast({ tone: 'info', title: 'Add project', msg: 'This flow is a placeholder in the preview.' })}>Add project</Button>
      </div>
      {items.map(p => <ProjectCard key={p.id} p={p} onDelete={id => { setItems(its => its.filter(x => x.id !== id)); onToast({ tone: 'error', title: 'Project removed' }); }} />)}
    </div>
  );
}

function IdentitySkills({ onToast }) {
  const [skills, setSkills] = React.useState(IDENTITY.skills);
  if (!skills.length) return <EmptyState icon="star" title="No skills added yet" desc="Add your skills here. Shared across all Omnyvora services." actionLabel="Add skill" onAction={() => onToast({ tone: 'info', title: 'Add skill', msg: 'This flow is a placeholder in the preview.' })} />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="sm" leading="plus" onClick={() => onToast({ tone: 'info', title: 'Add skill', msg: 'This flow is a placeholder in the preview.' })}>Add skill</Button>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {skills.map(s => (
          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 34, padding: '0 6px 0 14px', borderRadius: 'var(--radius-pill)',
            background: 'var(--bg-surface-raised)', border: '0.5px solid var(--border-default)', color: 'var(--text-primary)', font: '400 13px var(--font-sans)' }}>
            {s}
            <button onClick={() => setSkills(ss => ss.filter(x => x !== s))} title="Remove"
              style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={13} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function Identity({ onToast }) {
  const [tab, setTab] = React.useState('projects');
  const tabs = [
    { id: 'projects', label: 'Projects', icon: 'folder', count: IDENTITY.projects.length },
    { id: 'education', label: 'Education', icon: 'graduation', count: IDENTITY.education.length },
    { id: 'experience', label: 'Experience', icon: 'briefcase', count: IDENTITY.experience.length },
    { id: 'skills', label: 'Skills', icon: 'star', count: IDENTITY.skills.length },
  ];
  return (
    <div className="card" style={{ maxWidth: 820 }}>
      <div style={{ padding: '6px 20px 0' }}><Tabs items={tabs} value={tab} onChange={setTab} /></div>
      <div style={{ padding: 24 }}>
        {tab === 'projects' && <IdentityProjects onToast={onToast} />}
        {tab === 'education' && <EmptyState icon="graduation" title="No education added yet" desc="Add your education here. Shared across all Omnyvora services." actionLabel="Add education" onAction={() => onToast({ tone: 'info', title: 'Add education', msg: 'This flow is a placeholder in the preview.' })} />}
        {tab === 'experience' && <EmptyState icon="briefcase" title="No experience added yet" desc="Add your experience here. Shared across all Omnyvora services." actionLabel="Add experience" onAction={() => onToast({ tone: 'info', title: 'Add experience', msg: 'This flow is a placeholder in the preview.' })} />}
        {tab === 'skills' && <IdentitySkills onToast={onToast} />}
      </div>
    </div>
  );
}

function Profile({ onToast }) {
  const [sub, setSub] = React.useState('public');
  return (
    <Page>
      <PageHead title="Profile" subtitle="Manage how you appear across Omnyvora." />
      <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start' }}>
        <SubNav width={200} value={sub} onChange={setSub} items={[
          { id: 'public', label: 'Public profile', icon: 'user' },
          { id: 'identity', label: 'Identity', icon: 'star' },
        ]} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {sub === 'public' ? <PublicProfile onToast={onToast} /> : <Identity onToast={onToast} />}
        </div>
      </div>
    </Page>
  );
}

Object.assign(window, { Profile });
