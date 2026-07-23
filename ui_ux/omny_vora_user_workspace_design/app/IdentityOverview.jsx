/* Omnyvora Workspace — My Data overview (6-category summary) */

function CategoryCard({ icon, label, count, complete, onManage }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-icon)', background: 'var(--accent-subtle)', color: 'var(--accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={21} stroke={1.85} />
        </div>
        <Badge tone={complete ? 'success' : 'neutral'}>{complete ? 'Added' : 'Not started'}</Badge>
      </div>
      <div>
        <div style={{ font: '600 15px var(--font-sans)', color: 'var(--text-primary)' }}>{label}</div>
        <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{count} {count === 1 ? 'entry' : 'entries'}</div>
      </div>
      <Button variant="secondary" size="sm" trailing="arrowRight" onClick={onManage}>Manage</Button>
    </div>
  );
}

function IdentityOverview({ onNavigate }) {
  const cats = [
    { id: 'projects', icon: 'folder', label: 'Projects', count: IDENTITY.projects.length },
    { id: 'experience', icon: 'briefcase', label: 'Experience', count: IDENTITY.experience.length },
    { id: 'education', icon: 'graduation', label: 'Education', count: IDENTITY.education.length },
    { id: 'certifications', icon: 'award', label: 'Certifications', count: IDENTITY.certifications.length },
    { id: 'skills', icon: 'star', label: 'Skills', count: IDENTITY.skills.length },
    { id: 'social', icon: 'share', label: 'Social links', count: IDENTITY.socialLinks.length },
  ];
  const filled = cats.filter(c => c.count > 0).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="ds-display-sm" style={{ color: 'var(--text-primary)' }}>My Data</div>
          <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>The facts about you, used across every Omnyvora tool.</div>
        </div>
        <Badge tone="neutral" size="md">{filled} of {cats.length} started</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {cats.map(c => <CategoryCard key={c.id} {...c} complete={c.count > 0} onManage={() => onNavigate(c.id)} />)}
      </div>
    </div>
  );
}

Object.assign(window, { IdentityOverview });
