/* Omnyvora Workspace — Identity: Skills (grouped by category, inline proficiency sliders) */

function SkillAddRow({ onAdd }) {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('Tools');
  const [prof, setProf] = React.useState(60);
  const [open, setOpen] = React.useState(false);
  const filtered = SKILL_CATALOG.filter(s => s.name.toLowerCase().includes(name.toLowerCase())).slice(0, 6);
  const pick = (s) => { setName(s.name); setCategory(s.category); setOpen(false); };
  const submit = () => { if (!name.trim()) return; onAdd({ name: name.trim(), category, proficiency: prof }); setName(''); setProf(60); };
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr auto', gap: 14, alignItems: 'end' }}>
        <div className="field" style={{ position: 'relative' }}>
          <label className="label">Skill</label>
          <input className="input" value={name} onChange={e => { setName(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 120)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }} placeholder="e.g. TypeScript" />
          {open && name && filtered.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: 'var(--bg-overlay)', border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-input)', boxShadow: 'var(--shadow-2)', zIndex: 5, overflow: 'hidden' }}>
              {filtered.map(s => (
                <div key={s.name} onMouseDown={() => pick(s)} style={{ padding: '9px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', gap: 10 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-raised)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span className="ds-body-sm" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                  <span className="ds-caption" style={{ color: 'var(--text-tertiary)' }}>{s.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Select label="Category" value={category} onChange={setCategory} options={SKILL_CATEGORIES} />
        <Button variant="secondary" size="sm" leading="plus" onClick={submit} style={{ height: 38 }}>Add</Button>
      </div>
      <div style={{ marginTop: 14 }}>
        <label className="label">Proficiency</label>
        <div style={{ marginTop: 8 }}><ProficiencySlider value={prof} onChange={setProf} /></div>
      </div>
    </div>
  );
}

function SkillRow({ s, onChangeProf, onDelete }) {
  return (
    <div className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-card)', background: 'var(--bg-surface-raised)' }}>
      <span title="Drag to reorder" style={{ flex: 'none', color: 'var(--text-tertiary)', cursor: 'grab', display: 'flex' }}><Icon name="grip" size={15} /></span>
      <div style={{ width: 150, flex: 'none', font: '500 13px var(--font-sans)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
      <ProficiencySlider value={s.proficiency} onChange={onChangeProf} />
      <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0, flex: 'none' }} title="Remove" onClick={onDelete}><Icon name="trash" size={15} /></button>
    </div>
  );
}

function IdentitySkills({ onToast, onConfirm }) {
  const [skills, setSkills] = React.useState(IDENTITY.skills);
  const drag = useDragReorder(setSkills);

  const add = (s) => { setSkills(ss => [...ss, { ...s, id: 'sk' + Date.now() }]); onToast({ tone: 'success', title: 'Skill added' }); };
  const changeProf = (id, v) => setSkills(ss => ss.map(s => s.id === id ? { ...s, proficiency: v } : s));
  const requestDelete = (s) => onConfirm({ title: 'Remove this skill?', body: `"${s.name}" will be removed from your profile.`, confirmLabel: 'Remove skill', tone: 'danger',
    onConfirm: () => { setSkills(ss => ss.filter(x => x.id !== s.id)); onToast({ tone: 'error', title: 'Skill removed' }); } });

  if (!skills.length) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SkillAddRow onAdd={add} />
      <EmptyState icon="star" title="No skills added yet" desc="Use the field above to add your first skill." />
    </div>
  );

  const grouped = SKILL_CATEGORIES.map(cat => ({ cat, items: skills.map((s, i) => ({ ...s, _i: i })).filter(s => s.category === cat) })).filter(g => g.items.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SkillAddRow onAdd={add} />
      {grouped.map(g => (
        <div key={g.cat} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="label" style={{ color: 'var(--text-tertiary)' }}>{g.cat}</div>
          {g.items.map(s => (
            <div key={s.id} draggable onDragStart={drag.onDragStart(s._i)} onDragOver={drag.onDragOver(s._i)} onDrop={drag.onDrop(s._i)}>
              <SkillRow s={s} onChangeProf={v => changeProf(s.id, v)} onDelete={() => requestDelete(s)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { IdentitySkills });
