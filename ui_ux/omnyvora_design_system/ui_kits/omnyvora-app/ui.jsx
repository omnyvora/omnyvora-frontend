/* Omnyvora UI Kit — React primitives that render the design-system classes */

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

function Field({ label, error, leading, trailing, type = 'text', className = '', ...rest }) {
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
        {trailing && <span className="input-icon input-icon--trail"><Icon name={trailing} size={16} /></span>}
      </div>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

function Badge({ tone = 'neutral', size, children }) {
  return <span className={['badge', `badge--${tone}`, size === 'md' && 'badge--md'].filter(Boolean).join(' ')}>{children}</span>;
}

function Avatar({ size = 'md', src, initials }) {
  return (
    <div className={`avatar avatar--${size}`}>
      {src ? <img src={src} alt="" /> : initials}
    </div>
  );
}

function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={e => onChange && onChange(e.target.checked)} />
      <span className="track" /><span className="thumb" />
    </label>
  );
}

function StatCard({ label, value, unit, delta, dir }) {
  return (
    <div className="stat">
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}{unit && <span style={{ fontSize: 18, color: 'var(--text-tertiary)' }}>{unit}</span>}</div>
      {delta && (
        <div className={`stat__delta ${dir === 'up' ? 'stat__delta--up' : dir === 'down' ? 'stat__delta--down' : ''}`} style={!dir ? { color: 'var(--text-tertiary)' } : undefined}>
          {dir && <Icon name={dir} size={13} />}{delta}
        </div>
      )}
    </div>
  );
}

/* Toast renderer driven by an array of {id,tone,title,msg} */
function ToastStack({ toasts, dismiss }) {
  const iconFor = { success: 'checkCircle', error: 'x', warning: 'bell', info: 'bell' };
  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 60 }}>
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

Object.assign(window, { Button, Field, Badge, Avatar, Switch, StatCard, ToastStack });
