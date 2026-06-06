/* Omnyvora Workspace — React primitives rendering the design-system classes */

function Button({ variant = 'primary', size = 'md', leading, trailing, children, className = '', ...rest }) {
  const cls = ['btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {leading && <Icon name={leading} size={size === 'sm' ? 15 : 16} />}
      {children}
      {trailing && <Icon name={trailing} size={size === 'sm' ? 15 : 16} />}
    </button>
  );
}

function Field({ label, hint, error, leading, trailing, onTrailingClick, type = 'text', className = '', ...rest }) {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <div className="input-wrap">
        {leading && <span className="input-icon input-icon--lead"><Icon name={leading} size={16} /></span>}
        <input
          type={type}
          className={['input', leading && 'input--has-lead', trailing && 'input--has-trail', error && 'input--error', className].filter(Boolean).join(' ')}
          {...rest}
        />
        {trailing && (
          <span className="input-icon input-icon--trail" style={onTrailingClick ? { pointerEvents: 'auto', cursor: 'pointer' } : undefined} onClick={onTrailingClick}>
            <Icon name={trailing} size={16} />
          </span>
        )}
      </div>
      {error ? <div className="field-error">{error}</div>
        : hint ? <div className="ds-caption" style={{ color: 'var(--text-tertiary)' }}>{hint}</div> : null}
    </div>
  );
}

/* Password field with reveal toggle */
function PasswordField({ label, value, onChange, placeholder, error, hint, ...rest }) {
  const [show, setShow] = React.useState(false);
  return (
    <Field label={label} value={value} onChange={onChange} placeholder={placeholder} error={error} hint={hint}
      type={show ? 'text' : 'password'} leading="lock" trailing={show ? 'eyeOff' : 'eye'}
      onTrailingClick={() => setShow(s => !s)} {...rest} />
  );
}

function Textarea({ label, hint, className = '', ...rest }) {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <textarea className={['input', 'textarea', className].filter(Boolean).join(' ')} {...rest} />
      {hint && <div className="ds-caption" style={{ color: 'var(--text-tertiary)' }}>{hint}</div>}
    </div>
  );
}

/* Read-only field — a labelled value chip (used in Account › General) */
function ReadonlyField({ label, value, leading, mono, note, action }) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38, padding: '0 12px',
        background: 'var(--bg-surface)', border: '0.5px solid var(--border-default)', borderRadius: 'var(--radius-input)' }}>
        {leading && <span style={{ color: 'var(--text-tertiary)', display: 'flex', flex: 'none' }}><Icon name={leading} size={16} /></span>}
        <span style={{ flex: 1, minWidth: 0, color: 'var(--text-secondary)',
          font: mono ? '400 13px var(--font-mono)' : '400 14px var(--font-sans)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        {action}
      </div>
      {note && <div className="ds-caption" style={{ color: 'var(--text-tertiary)' }}>{note}</div>}
    </div>
  );
}

function Badge({ tone = 'neutral', size, children, leading }) {
  return (
    <span className={['badge', `badge--${tone}`, size === 'md' && 'badge--md'].filter(Boolean).join(' ')}>
      {leading && <Icon name={leading} size={11} />}{children}
    </span>
  );
}

function Avatar({ size = 'md', src, initials }) {
  return (
    <div className={`avatar avatar--${size}`}>
      {src ? <img src={src} alt="" /> : initials}
    </div>
  );
}

function Switch({ checked, onChange, disabled }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} disabled={disabled} onChange={e => onChange && onChange(e.target.checked)} />
      <span className="track" /><span className="thumb" />
    </label>
  );
}

/* Toast stack driven by [{id,tone,title,msg}] */
function ToastStack({ toasts, dismiss }) {
  const iconFor = { success: 'checkCircle', error: 'alertTriangle', warning: 'alertTriangle', info: 'bell' };
  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 90 }}>
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.tone}`} style={{ animation: 'omToastIn .3s cubic-bezier(.16,1,.3,1)' }}>
          <span className="toast__icon"><Icon name={iconFor[t.tone] || 'bell'} size={18} /></span>
          <div className="toast__body">
            <div className="toast__title">{t.title}</div>
            {t.msg && <div className="toast__msg">{t.msg}</div>}
          </div>
          <button className="toast__close" onClick={() => dismiss(t.id)}><Icon name="x" size={18} /></button>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Button, Field, PasswordField, Textarea, ReadonlyField, Badge, Avatar, Switch, ToastStack });
