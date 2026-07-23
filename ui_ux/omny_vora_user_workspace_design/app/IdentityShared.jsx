/* Omnyvora Workspace — Identity shared building blocks: SidePanel, form controls, drag reorder, row shell */

function SidePanel({ open, title, subtitle, onClose, children, footer, width = 520 }) {
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 88, background: 'rgba(17,17,17,0.45)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity var(--duration-base) var(--ease)' }} />
      <aside style={{ position: 'fixed', top: 0, right: 0, height: '100%', width, maxWidth: '92vw', zIndex: 89,
        background: 'var(--bg-overlay)', borderLeft: '0.5px solid var(--border-default)', boxShadow: 'var(--shadow-3)',
        display: 'flex', flexDirection: 'column', transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform var(--duration-slow) var(--ease)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '0.5px solid var(--border-default)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ds-display-sm">{title}</div>
            {subtitle && <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{subtitle}</div>}
          </div>
          <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0, flex: 'none' }} onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 24px', borderTop: '0.5px solid var(--border-default)' }}>{footer}</div>}
      </aside>
    </React.Fragment>
  );
}

function Select({ label, value, onChange, options, placeholder, hint }) {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <select className="input" value={value} onChange={e => onChange(e.target.value)} style={{ cursor: 'pointer' }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <div className="ds-caption" style={{ color: 'var(--text-tertiary)' }}>{hint}</div>}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent-primary)' }} />
      <span className="ds-body-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </label>
  );
}

function TagInput({ label, value = [], onChange, suggestions = [], placeholder = 'Add and press Enter', hint }) {
  const [text, setText] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const filtered = suggestions.filter(s => s.toLowerCase().includes(text.toLowerCase()) && !value.includes(s)).slice(0, 6);
  const add = (v) => { const s = v.trim(); if (!s || value.includes(s)) return; onChange([...value, s]); setText(''); setOpen(false); };
  return (
    <div className="field" style={{ position: 'relative' }}>
      {label && <label className="label">{label}</label>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, minHeight: 42, border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-input)', background: 'var(--bg-surface)' }}>
        {value.map(v => (
          <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 4px 0 10px', borderRadius: 'var(--radius-pill)', background: 'var(--accent-subtle)', color: 'var(--accent-text)', font: '500 12px var(--font-sans)' }}>
            {v}
            <button type="button" onClick={() => onChange(value.filter(x => x !== v))} style={{ width: 18, height: 18, border: 'none', background: 'transparent', borderRadius: '50%', cursor: 'pointer', color: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="x" size={11} /></button>
          </span>
        ))}
        <input value={text} onChange={e => { setText(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(text); } }}
          placeholder={value.length ? '' : placeholder}
          style={{ flex: 1, minWidth: 120, border: 'none', outline: 'none', background: 'transparent', font: '400 13px var(--font-sans)', color: 'var(--text-primary)' }} />
      </div>
      {open && text && filtered.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: 'var(--bg-overlay)', border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-input)', boxShadow: 'var(--shadow-2)', zIndex: 5, overflow: 'hidden' }}>
          {filtered.map(f => (
            <div key={f} onMouseDown={() => add(f)} style={{ padding: '9px 12px', cursor: 'pointer', font: '400 13px var(--font-sans)', color: 'var(--text-primary)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-raised)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{f}</div>
          ))}
        </div>
      )}
      {hint && <div className="ds-caption" style={{ color: 'var(--text-tertiary)' }}>{hint}</div>}
    </div>
  );
}

function ProficiencySlider({ value, onChange }) {
  const [dragging, setDragging] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
      <input type="range" min={0} max={100} value={value}
        onChange={e => onChange(Number(e.target.value))}
        onMouseDown={() => setDragging(true)} onMouseUp={() => setDragging(false)} onTouchStart={() => setDragging(true)} onTouchEnd={() => setDragging(false)}
        style={{ flex: 1, accentColor: 'var(--accent-primary)', height: 4, cursor: 'pointer' }} />
      <span style={{ width: 36, flex: 'none', textAlign: 'right', font: '500 12px var(--font-mono)', color: dragging ? 'var(--accent-text)' : 'var(--text-secondary)' }}>{value}%</span>
    </div>
  );
}

/* Whole-row native drag reorder (visual + functional) */
function useDragReorder(setItems) {
  const dragIndex = React.useRef(null);
  return {
    onDragStart: i => e => { dragIndex.current = i; e.dataTransfer.effectAllowed = 'move'; },
    onDragOver: i => e => e.preventDefault(),
    onDrop: i => e => {
      e.preventDefault();
      const from = dragIndex.current;
      if (from === null || from === i) return;
      setItems(arr => { const copy = [...arr]; const [moved] = copy.splice(from, 1); copy.splice(i, 0, moved); return copy; });
      dragIndex.current = null;
    },
  };
}

function RowShell({ dragProps, icon, thumb, title, meta, extra, actions }) {
  return (
    <div className="row-hover" draggable {...dragProps} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-card)', background: 'var(--bg-surface-raised)' }}>
      <span title="Drag to reorder" style={{ flex: 'none', color: 'var(--text-tertiary)', cursor: 'grab', display: 'flex', alignItems: 'center', height: 40 }}><Icon name="grip" size={15} /></span>
      {thumb || (
        <div style={{ width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-icon)', background: 'var(--accent-subtle)', color: 'var(--accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={19} stroke={1.85} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ font: '600 14px var(--font-sans)', color: 'var(--text-primary)' }}>{title}</div>
          {meta}
        </div>
        {extra}
      </div>
      <div style={{ display: 'flex', gap: 4, flex: 'none' }}>{actions}</div>
    </div>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <React.Fragment>
      <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} title="Edit" onClick={onEdit}><Icon name="pencil" size={15} /></button>
      <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} title="Remove" onClick={onDelete}><Icon name="trash" size={15} /></button>
    </React.Fragment>
  );
}

function fmtMonthYear(iso) {
  if (!iso) return '';
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = new Date(iso + 'T00:00:00');
  return `${m[d.getMonth()]} ${d.getFullYear()}`;
}

/* Multi-image gallery manager (Projects) — upload slots, captions, cover toggle, reorder, remove */
function GalleryField({ images, onChange, projectId }) {
  const drag = useDragReorder(onChange);
  const addImage = () => onChange([...images, { id: 'im' + Date.now(), slotId: `proj-${projectId}-${Date.now()}`, caption: '', isCover: images.length === 0 }]);
  const setCover = (id) => onChange(images.map(im => ({ ...im, isCover: im.id === id })));
  const setCaption = (id, caption) => onChange(images.map(im => im.id === id ? { ...im, caption } : im));
  const remove = (id) => onChange(images.filter(im => im.id !== id));
  return (
    <div className="field">
      <label className="label">Images</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 14 }}>
        {images.map((im, i) => (
          <div key={im.id} draggable onDragStart={drag.onDragStart(i)} onDragOver={drag.onDragOver(i)} onDrop={drag.onDrop(i)}
            style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ position: 'relative' }}>
              <image-slot id={im.slotId} shape="rounded" placeholder="Photo" style={{ width: '100%', aspectRatio: '1/1', display: 'block', borderRadius: 'var(--radius-card)', border: '0.5px solid var(--border-default)' }} />
              <button type="button" title="Remove image" onClick={() => remove(im.id)}
                style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'rgba(17,17,17,0.55)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="x" size={12} /></button>
              <button type="button" title={im.isCover ? 'Cover image' : 'Set as cover'} onClick={() => setCover(im.id)}
                style={{ position: 'absolute', bottom: 6, left: 6, height: 22, padding: '0 8px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
                  background: im.isCover ? 'var(--accent-primary)' : 'rgba(17,17,17,0.55)', color: '#fff', font: '500 10px var(--font-sans)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Icon name="star" size={11} />{im.isCover ? 'Cover' : 'Set cover'}
              </button>
            </div>
            <input value={im.caption} onChange={e => setCaption(im.id, e.target.value)} placeholder="Caption"
              className="input" style={{ height: 32, font: '400 12px var(--font-sans)', padding: '0 8px' }} />
          </div>
        ))}
        <button type="button" onClick={addImage} style={{ aspectRatio: '1/1', borderRadius: 'var(--radius-card)', border: '1px dashed var(--border-strong)', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name="plus" size={18} /><span className="ds-caption">Add image</span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { SidePanel, Select, Checkbox, TagInput, ProficiencySlider, useDragReorder, RowShell, RowActions, fmtMonthYear, GalleryField });
