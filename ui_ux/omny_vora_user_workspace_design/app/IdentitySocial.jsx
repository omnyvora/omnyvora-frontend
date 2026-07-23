/* Omnyvora Workspace — Identity: Social links */

function SocialPanel({ open, initial, onClose, onSave }) {
  const blank = { platform: 'GitHub', label: '', url: '' };
  const [f, setF] = React.useState(initial || blank);
  React.useEffect(() => setF(initial || blank), [initial, open]);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const valid = f.url.trim();
  return (
    <SidePanel open={open} onClose={onClose} title={initial ? 'Edit link' : 'Add link'} subtitle="Shared across every Omnyvora tool." width={440}
      footer={<React.Fragment><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!valid} onClick={() => onSave(f)}>Save link</Button></React.Fragment>}>
      <Select label="Platform" value={f.platform} onChange={v => set('platform', v)} options={PLATFORM_OPTIONS} />
      <Field label="Label" value={f.label} onChange={e => set('label', e.target.value)} placeholder="Optional display name" />
      <Field label="URL" leading="link" value={f.url} onChange={e => set('url', e.target.value)} placeholder="https://..." />
    </SidePanel>
  );
}

function IdentitySocial({ onToast, onConfirm }) {
  const [items, setItems] = React.useState(IDENTITY.socialLinks);
  const [panel, setPanel] = React.useState(null);
  const drag = useDragReorder(setItems);

  const save = (data) => {
    if (panel.item) { setItems(its => its.map(x => x.id === panel.item.id ? { ...data, id: x.id } : x)); onToast({ tone: 'success', title: 'Link updated' }); }
    else { setItems(its => [...its, { ...data, id: 'so' + Date.now() }]); onToast({ tone: 'success', title: 'Link added' }); }
    setPanel(null);
  };
  const requestDelete = (x) => onConfirm({ title: 'Delete this link?', body: `Your ${x.platform} link will be removed from your profile.`, confirmLabel: 'Delete link', tone: 'danger',
    onConfirm: () => { setItems(its => its.filter(i => i.id !== x.id)); onToast({ tone: 'error', title: 'Link removed' }); } });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="sm" leading="plus" onClick={() => setPanel({ item: null })}>Add link</Button>
      </div>
      {!items.length ? (
        <EmptyState icon="share" title="No social links added yet" desc="Add links to your profiles here. Shared across all Omnyvora services." actionLabel="Add link" onAction={() => setPanel({ item: null })} />
      ) : items.map((x, i) => (
        <div key={x.id} onDragOver={drag.onDragOver(i)} onDrop={drag.onDrop(i)}>
          <RowShell dragProps={{ onDragStart: drag.onDragStart(i) }} icon="link"
            title={x.label || x.platform} meta={<Badge tone="neutral">{x.platform}</Badge>}
            extra={<div className="ds-body-sm" style={{ color: 'var(--accent-text)', font: '400 12px var(--font-mono)', marginTop: 2 }}>{x.url.replace('https://', '')}</div>}
            actions={<RowActions onEdit={() => setPanel({ item: x })} onDelete={() => requestDelete(x)} />} />
        </div>
      ))}
      <SocialPanel open={!!panel} initial={panel && panel.item} onClose={() => setPanel(null)} onSave={save} />
    </div>
  );
}

Object.assign(window, { IdentitySocial });
