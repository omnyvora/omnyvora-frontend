/* Omnyvora Workspace — Identity: Certifications */

function CertificationPanel({ open, initial, onClose, onSave }) {
  const blank = { title: '', issuer: '', issue_date: '', credential_url: '', slotId: 'cert-' + Date.now() };
  const [f, setF] = React.useState(initial || blank);
  React.useEffect(() => setF(initial || { ...blank, slotId: 'cert-' + Date.now() }), [initial, open]);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const valid = f.title.trim() && f.issuer.trim();
  return (
    <SidePanel open={open} onClose={onClose} title={initial ? 'Edit certification' : 'Add certification'} subtitle="Shared across every Omnyvora tool."
      footer={<React.Fragment><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!valid} onClick={() => onSave(f)}>Save certification</Button></React.Fragment>}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <image-slot id={f.slotId} shape="rounded" placeholder="Certificate" style={{ width: 84, height: 84, flex: 'none', display: 'block', borderRadius: 'var(--radius-card)', border: '0.5px solid var(--border-default)' }} />
        <div className="ds-caption" style={{ color: 'var(--text-tertiary)' }}>Drop the certificate image, or click to browse.</div>
      </div>
      <Field label="Title" value={f.title} onChange={e => set('title', e.target.value)} placeholder="Certified Kubernetes Administrator" />
      <Field label="Issuer" value={f.issuer} onChange={e => set('issuer', e.target.value)} placeholder="Issuing organization" />
      <Field label="Issue date" type="date" value={f.issue_date} onChange={e => set('issue_date', e.target.value)} />
      <Field label="Credential URL" leading="link" value={f.credential_url} onChange={e => set('credential_url', e.target.value)} placeholder="https://..." />
    </SidePanel>
  );
}

function IdentityCertifications({ onToast, onConfirm }) {
  const [items, setItems] = React.useState(IDENTITY.certifications);
  const [panel, setPanel] = React.useState(null);
  const drag = useDragReorder(setItems);

  const save = (data) => {
    if (panel.item) { setItems(its => its.map(x => x.id === panel.item.id ? { ...data, id: x.id } : x)); onToast({ tone: 'success', title: 'Certification updated' }); }
    else { setItems(its => [...its, { ...data, id: 'ce' + Date.now() }]); onToast({ tone: 'success', title: 'Certification added' }); }
    setPanel(null);
  };
  const requestDelete = (x) => onConfirm({ title: 'Delete this certification?', body: `"${x.title}" will be removed from your profile.`, confirmLabel: 'Delete certification', tone: 'danger',
    onConfirm: () => { setItems(its => its.filter(i => i.id !== x.id)); onToast({ tone: 'error', title: 'Certification removed' }); } });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="sm" leading="plus" onClick={() => setPanel({ item: null })}>Add certification</Button>
      </div>
      {!items.length ? (
        <EmptyState icon="award" title="No certifications added yet" desc="Add your certifications here. Shared across all Omnyvora services." actionLabel="Add certification" onAction={() => setPanel({ item: null })} />
      ) : items.map((x, i) => (
        <div key={x.id} onDragOver={drag.onDragOver(i)} onDrop={drag.onDrop(i)}>
          <RowShell dragProps={{ onDragStart: drag.onDragStart(i) }}
            thumb={<image-slot id={x.slotId} shape="rounded" placeholder="Certificate" style={{ width: 40, height: 40, flex: 'none', display: 'block', borderRadius: 'var(--radius-icon)', border: '0.5px solid var(--border-default)' }} />}
            title={x.title}
            extra={<React.Fragment>
              <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{x.issuer}{x.issue_date ? ` · Issued ${fmtMonthYear(x.issue_date)}` : ''}</div>
              {x.credential_url && <div className="ds-body-sm" style={{ color: 'var(--accent-text)', font: '400 12px var(--font-mono)', marginTop: 4 }}>{x.credential_url.replace('https://', '')}</div>}
            </React.Fragment>}
            actions={<RowActions onEdit={() => setPanel({ item: x })} onDelete={() => requestDelete(x)} />} />
        </div>
      ))}
      <CertificationPanel open={!!panel} initial={panel && panel.item} onClose={() => setPanel(null)} onSave={save} />
    </div>
  );
}

Object.assign(window, { IdentityCertifications });
