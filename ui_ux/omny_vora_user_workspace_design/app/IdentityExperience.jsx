/* Omnyvora Workspace — Identity: Experience */

function ExperiencePanel({ open, initial, onClose, onSave }) {
  const blank = { job_title: '', company_name: '', company_url: '', location: '', description: '', technologies: [], start_date: '', end_date: '', current: false };
  const [f, setF] = React.useState(initial || blank);
  React.useEffect(() => setF(initial || blank), [initial, open]);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const valid = f.job_title.trim() && f.company_name.trim() && f.start_date;
  return (
    <SidePanel open={open} onClose={onClose} title={initial ? 'Edit experience' : 'Add experience'} subtitle="Shared across every Omnyvora tool."
      footer={<React.Fragment><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!valid} onClick={() => onSave(f)}>Save experience</Button></React.Fragment>}>
      <Field label="Job title" value={f.job_title} onChange={e => set('job_title', e.target.value)} placeholder="Senior Product Designer" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Field label="Company" value={f.company_name} onChange={e => set('company_name', e.target.value)} placeholder="Company name" />
        <Field label="Company URL" leading="link" value={f.company_url} onChange={e => set('company_url', e.target.value)} placeholder="https://..." />
      </div>
      <Field label="Location" leading="mapPin" value={f.location} onChange={e => set('location', e.target.value)} placeholder="City, Country / Remote" />
      <Textarea label="Description" value={f.description} onChange={e => set('description', e.target.value)} style={{ minHeight: 88 }} placeholder="What you worked on" />
      <TagInput label="Technologies" value={f.technologies} onChange={v => set('technologies', v)} suggestions={TECH_SUGGESTIONS} placeholder="Add a technology and press Enter" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Field label="Start date" type="date" value={f.start_date} onChange={e => set('start_date', e.target.value)} />
        <Field label="End date" type="date" value={f.end_date} onChange={e => set('end_date', e.target.value)} disabled={f.current} />
      </div>
      <Checkbox label="I currently work here" checked={f.current} onChange={v => set('current', v) || (v && set('end_date', ''))} />
    </SidePanel>
  );
}

function IdentityExperience({ onToast, onConfirm }) {
  const [items, setItems] = React.useState(IDENTITY.experience);
  const [panel, setPanel] = React.useState(null);
  const drag = useDragReorder(setItems);

  const save = (data) => {
    if (panel.item) { setItems(its => its.map(x => x.id === panel.item.id ? { ...data, id: x.id } : x)); onToast({ tone: 'success', title: 'Experience updated' }); }
    else { setItems(its => [...its, { ...data, id: 'ex' + Date.now() }]); onToast({ tone: 'success', title: 'Experience added' }); }
    setPanel(null);
  };
  const requestDelete = (x) => onConfirm({ title: 'Delete this experience?', body: `"${x.job_title} @ ${x.company_name}" will be removed from your profile.`, confirmLabel: 'Delete experience', tone: 'danger',
    onConfirm: () => { setItems(its => its.filter(i => i.id !== x.id)); onToast({ tone: 'error', title: 'Experience removed' }); } });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="sm" leading="plus" onClick={() => setPanel({ item: null })}>Add experience</Button>
      </div>
      {!items.length ? (
        <EmptyState icon="briefcase" title="No experience added yet" desc="Add your work experience here. Shared across all Omnyvora services." actionLabel="Add experience" onAction={() => setPanel({ item: null })} />
      ) : items.map((x, i) => (
        <div key={x.id} onDragOver={drag.onDragOver(i)} onDrop={drag.onDrop(i)}>
          <RowShell dragProps={{ onDragStart: drag.onDragStart(i) }} icon="briefcase"
            title={`${x.job_title} @ ${x.company_name}`}
            meta={x.current && <Badge tone="success">Current</Badge>}
            extra={<React.Fragment>
              <div className="ds-body-sm" style={{ color: 'var(--text-tertiary)', marginTop: 2 }}>{fmtMonthYear(x.start_date)} — {x.current ? 'Present' : fmtMonthYear(x.end_date)}{x.location ? ` · ${x.location}` : ''}</div>
              <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>{x.description}</div>
              {x.technologies.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>{x.technologies.map(t => <Badge key={t} tone="neutral">{t}</Badge>)}</div>}
            </React.Fragment>}
            actions={<RowActions onEdit={() => setPanel({ item: x })} onDelete={() => requestDelete(x)} />} />
        </div>
      ))}
      <ExperiencePanel open={!!panel} initial={panel && panel.item} onClose={() => setPanel(null)} onSave={save} />
    </div>
  );
}

Object.assign(window, { IdentityExperience });
