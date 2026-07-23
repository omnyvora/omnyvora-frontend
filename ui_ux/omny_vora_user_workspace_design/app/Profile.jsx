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

function Identity({ onToast, onConfirm }) {
  const [tab, setTab] = React.useState('overview');
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'layoutGrid' },
    { id: 'projects', label: 'Projects', icon: 'folder', count: IDENTITY.projects.length },
    { id: 'experience', label: 'Experience', icon: 'briefcase', count: IDENTITY.experience.length },
    { id: 'education', label: 'Education', icon: 'graduation', count: IDENTITY.education.length },
    { id: 'certifications', label: 'Certifications', icon: 'award', count: IDENTITY.certifications.length },
    { id: 'skills', label: 'Skills', icon: 'star', count: IDENTITY.skills.length },
    { id: 'social', label: 'Social links', icon: 'share', count: IDENTITY.socialLinks.length },
  ];
  return (
    <div className="card" style={{ maxWidth: 920 }}>
      <div style={{ padding: '6px 20px 0', overflowX: 'auto' }}><Tabs items={tabs} value={tab} onChange={setTab} /></div>
      <div style={{ padding: 24 }}>
        {tab === 'overview' && <IdentityOverview onNavigate={setTab} />}
        {tab === 'projects' && <IdentityProjects onToast={onToast} onConfirm={onConfirm} />}
        {tab === 'experience' && <IdentityExperience onToast={onToast} onConfirm={onConfirm} />}
        {tab === 'education' && <IdentityEducation onToast={onToast} onConfirm={onConfirm} />}
        {tab === 'certifications' && <IdentityCertifications onToast={onToast} onConfirm={onConfirm} />}
        {tab === 'skills' && <IdentitySkills onToast={onToast} onConfirm={onConfirm} />}
        {tab === 'social' && <IdentitySocial onToast={onToast} onConfirm={onConfirm} />}
      </div>
    </div>
  );
}

function Profile({ onToast, onConfirm }) {
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
          {sub === 'public' ? <PublicProfile onToast={onToast} /> : <Identity onToast={onToast} onConfirm={onConfirm} />}
        </div>
      </div>
    </Page>
  );
}

Object.assign(window, { Profile });
