/* Omnyvora Workspace — Identity: Projects */

function ProjectPanel({ open, initial, onClose, onSave }) {
  const blank = { title: '', short_description: '', description: '', achievements: [''], technologies: [], github_url: '', live_url: '', is_featured: false, images: [] };
  const [f, setF] = React.useState(initial || blank);
  React.useEffect(() => { setF(initial || blank); }, [initial, open]);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const setAch = (i, v) => setF(s => ({ ...s, achievements: s.achievements.map((a, idx) => idx === i ? v : a) }));
  const addAch = () => setF(s => ({ ...s, achievements: [...s.achievements, ''] }));
  const removeAch = (i) => setF(s => ({ ...s, achievements: s.achievements.filter((_, idx) => idx !== i) }));
  const valid = f.title.trim().length > 0;
  return (
    <SidePanel open={open} onClose={onClose} title={initial ? 'Edit project' : 'Add project'} subtitle="Shared across every Omnyvora tool."
      footer={<React.Fragment><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!valid} onClick={() => onSave({ ...f, achievements: f.achievements.filter(a => a.trim()) })}>Save project</Button></React.Fragment>}>
      <Field label="Title" value={f.title} onChange={e => set('title', e.target.value)} placeholder="Project title" />
      <Field label="Short description" value={f.short_description} onChange={e => set('short_description', e.target.value.slice(0, 300))} placeholder="One line, shown on the project card" hint={`${f.short_description.length}/300`} />
      <Textarea label="Description" value={f.description} onChange={e => set('description', e.target.value)} style={{ minHeight: 96 }} placeholder="Full write-up" />
      <div className="field">
        <label className="label">Achievements</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {f.achievements.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              <input className="input" value={a} onChange={e => setAch(i, e.target.value)} placeholder="Shipped a feature that..." style={{ flex: 1 }} />
              <button type="button" className="btn btn--ghost btn--sm" style={{ width: 36, padding: 0, flex: 'none' }} onClick={() => removeAch(i)}><Icon name="x" size={14} /></button>
            </div>
          ))}
          <Button variant="ghost" size="sm" leading="plus" onClick={addAch} style={{ alignSelf: 'flex-start' }}>Add achievement</Button>
        </div>
      </div>
      <TagInput label="Technologies" value={f.technologies} onChange={v => set('technologies', v)} suggestions={TECH_SUGGESTIONS} placeholder="Add a technology and press Enter" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Field label="GitHub URL" leading="link" value={f.github_url} onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/..." />
        <Field label="Live URL" leading="externalLink" value={f.live_url} onChange={e => set('live_url', e.target.value)} placeholder="https://..." />
      </div>
      <GalleryField images={f.images} onChange={v => set('images', v)} projectId={initial ? initial.id : 'new'} />
      <Checkbox label="Feature this project on my public profile" checked={f.is_featured} onChange={v => set('is_featured', v)} />
    </SidePanel>
  );
}

function IdentityProjects({ onToast, onConfirm }) {
  const [items, setItems] = React.useState(IDENTITY.projects);
  const [panel, setPanel] = React.useState(null); // {mode:'add'|'edit', item}
  const drag = useDragReorder(setItems);

  const save = (data) => {
    if (panel.item) { setItems(its => its.map(x => x.id === panel.item.id ? { ...data, id: x.id } : x)); onToast({ tone: 'success', title: 'Project updated' }); }
    else { setItems(its => [...its, { ...data, id: 'pr' + Date.now() }]); onToast({ tone: 'success', title: 'Project added' }); }
    setPanel(null);
  };
  const requestDelete = (p) => onConfirm({ title: 'Delete this project?', body: `"${p.title}" will be removed from your profile and every tool that references it.`, confirmLabel: 'Delete project', tone: 'danger',
    onConfirm: () => { setItems(its => its.filter(x => x.id !== p.id)); onToast({ tone: 'error', title: 'Project removed' }); } });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="sm" leading="plus" onClick={() => setPanel({ item: null })}>Add project</Button>
      </div>
      {!items.length ? (
        <EmptyState icon="folder" title="No projects added yet" desc="Add your projects here. Shared across all Omnyvora services." actionLabel="Add project" onAction={() => setPanel({ item: null })} />
      ) : items.map((p, i) => (
        <div key={p.id} onDragOver={drag.onDragOver(i)} onDrop={drag.onDrop(i)}>
          <RowShell dragProps={{ onDragStart: drag.onDragStart(i) }} icon="folder"
            title={p.title}
            meta={<React.Fragment>{p.is_featured && <Badge tone="accent">Featured</Badge>}{p.images.length > 0 && <Badge tone="neutral">{p.images.length} photo{p.images.length > 1 ? 's' : ''}</Badge>}</React.Fragment>}
            extra={<React.Fragment>
              <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{p.short_description}</div>
              {p.technologies.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>{p.technologies.map(t => <Badge key={t} tone="neutral">{t}</Badge>)}</div>}
              {(p.github_url || p.live_url) && <div style={{ marginTop: 8, display: 'flex', gap: 14 }}>
                {p.github_url && <span className="ds-body-sm" style={{ color: 'var(--accent-text)', font: '400 12px var(--font-mono)' }}>{p.github_url.replace('https://', '')}</span>}
                {p.live_url && <span className="ds-body-sm" style={{ color: 'var(--accent-text)', font: '400 12px var(--font-mono)' }}>{p.live_url.replace('https://', '')}</span>}
              </div>}
            </React.Fragment>}
            actions={<RowActions onEdit={() => setPanel({ item: p })} onDelete={() => requestDelete(p)} />} />
        </div>
      ))}
      <ProjectPanel open={!!panel} initial={panel && panel.item} onClose={() => setPanel(null)} onSave={save} />
    </div>
  );
}

Object.assign(window, { IdentityProjects });
