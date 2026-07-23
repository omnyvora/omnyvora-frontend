/* Omnyvora Workspace — Identity: Education */

function EducationPanel({ open, initial, onClose, onSave }) {
  const blank = { degree: '', institution: '', department: '', start_date: '', end_date: '', gpa: '', gpa_scale: '4.00', certification_id: '' };
  const [f, setF] = React.useState(initial || blank);
  React.useEffect(() => setF(initial ? { ...initial, certification_id: initial.certification_id || '' } : blank), [initial, open]);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const valid = f.degree.trim() && f.institution.trim();
  return (
    <SidePanel open={open} onClose={onClose} title={initial ? 'Edit education' : 'Add education'} subtitle="Shared across every Omnyvora tool."
      footer={<React.Fragment><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!valid} onClick={() => onSave({ ...f, certification_id: f.certification_id || null })}>Save education</Button></React.Fragment>}>
      <Field label="Degree" value={f.degree} onChange={e => set('degree', e.target.value)} placeholder="B.S. Computer Science" />
      <Field label="Institution" value={f.institution} onChange={e => set('institution', e.target.value)} placeholder="University name" />
      <Field label="Department" value={f.department} onChange={e => set('department', e.target.value)} placeholder="Optional" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Field label="Start date" type="date" value={f.start_date} onChange={e => set('start_date', e.target.value)} />
        <Field label="End date" type="date" value={f.end_date} onChange={e => set('end_date', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Field label="GPA" value={f.gpa} onChange={e => set('gpa', e.target.value)} placeholder="3.59" />
        <Field label="GPA scale" value={f.gpa_scale} onChange={e => set('gpa_scale', e.target.value)} placeholder="4.00" />
      </div>
      <Select label="Linked certification" placeholder="None" value={f.certification_id || ''} onChange={v => set('certification_id', v)}
        options={IDENTITY.certifications.map(c => ({ value: c.id, label: c.title }))} hint="Optional — link a certification earned through this program." />
    </SidePanel>
  );
}

function IdentityEducation({ onToast, onConfirm }) {
  const [items, setItems] = React.useState(IDENTITY.education);
  const [panel, setPanel] = React.useState(null);
  const drag = useDragReorder(setItems);

  const save = (data) => {
    if (panel.item) { setItems(its => its.map(x => x.id === panel.item.id ? { ...data, id: x.id } : x)); onToast({ tone: 'success', title: 'Education updated' }); }
    else { setItems(its => [...its, { ...data, id: 'ed' + Date.now() }]); onToast({ tone: 'success', title: 'Education added' }); }
    setPanel(null);
  };
  const requestDelete = (x) => onConfirm({ title: 'Delete this education entry?', body: `"${x.degree}" will be removed from your profile.`, confirmLabel: 'Delete entry', tone: 'danger',
    onConfirm: () => { setItems(its => its.filter(i => i.id !== x.id)); onToast({ tone: 'error', title: 'Education removed' }); } });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="sm" leading="plus" onClick={() => setPanel({ item: null })}>Add education</Button>
      </div>
      {!items.length ? (
        <EmptyState icon="graduation" title="No education added yet" desc="Add your education here. Shared across all Omnyvora services." actionLabel="Add education" onAction={() => setPanel({ item: null })} />
      ) : items.map((x, i) => (
        <div key={x.id} onDragOver={drag.onDragOver(i)} onDrop={drag.onDrop(i)}>
          <RowShell dragProps={{ onDragStart: drag.onDragStart(i) }} icon="graduation"
            title={x.degree}
            meta={x.gpa && <Badge tone="neutral">GPA {x.gpa}/{x.gpa_scale}</Badge>}
            extra={<React.Fragment>
              <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{x.institution}{x.department ? ` · ${x.department}` : ''}</div>
              <div className="ds-body-sm" style={{ color: 'var(--text-tertiary)', marginTop: 2 }}>{fmtMonthYear(x.start_date)} — {fmtMonthYear(x.end_date) || 'Present'}</div>
            </React.Fragment>}
            actions={<RowActions onEdit={() => setPanel({ item: x })} onDelete={() => requestDelete(x)} />} />
        </div>
      ))}
      <EducationPanel open={!!panel} initial={panel && panel.item} onClose={() => setPanel(null)} onSave={save} />
    </div>
  );
}

Object.assign(window, { IdentityEducation });
