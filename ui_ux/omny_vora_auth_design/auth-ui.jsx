/* Omnyvora Auth — shared primitives built strictly on the design-system tokens.
   Exports: Logo, AuthHeader, Spinner, SubmitButton, GhostLink, LabeledField,
   PasswordField, OtpInput, StepIndicator, StrengthBar, MatchIndicator, PurposeBadge */

const LOGO_SRC = 'ds/logo-mark-black.png';

/* ---- Brand mark + header --------------------------------------------------*/
function Logo({ size = 52 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 'var(--radius-logo)',
      background: 'var(--bg-surface)', border: '0.5px solid var(--border-default)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'
    }}>
      <img src={LOGO_SRC} alt="Omnyvora" style={{ width: size * 0.6, height: size * 0.6, objectFit: 'contain' }} />
    </div>
  );
}

function AuthHeader({ title, subtitle, align = 'center' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 'var(--space-5)' }}>
      <Logo />
      <div style={{ textAlign: align }}>
        <h2 className="ds-display-md" style={{ color: 'var(--text-primary)', margin: 0 }}>{title}</h2>
        <p className="ds-body-md" style={{ color: 'var(--text-secondary)', margin: '6px 0 0', maxWidth: 320 }}>{subtitle}</p>
      </div>
    </div>
  );
}

/* ---- Spinner + submit button ---------------------------------------------*/
function Spinner({ size = 18 }) {
  return (
    <span aria-label="loading" style={{
      width: size, height: size, display: 'inline-block',
      border: '2px solid currentColor', borderRightColor: 'transparent',
      borderRadius: '50%', opacity: 0.9, animation: 'authspin 0.7s linear infinite'
    }} />
  );
}

function SubmitButton({ loading, children, variant = 'accent', icon, ...rest }) {
  return (
    <button
      className={`btn btn--${variant} btn--lg`}
      style={{ width: '100%' }}
      disabled={loading || rest.disabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner /> : <>{children}{icon && <Icon name={icon} size={16} />}</>}
    </button>
  );
}

function GhostLink({ children, ...rest }) {
  return (
    <a {...rest} style={{ color: 'var(--accent-text)', cursor: 'pointer', fontWeight: 500, ...(rest.style || {}) }}>{children}</a>
  );
}

/* ---- Required-aware labeled field ----------------------------------------*/
function FieldLabel({ children, required, htmlFor }) {
  return (
    <label className="label" htmlFor={htmlFor} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {children}{required && <span style={{ color: 'var(--status-error)' }} aria-hidden="true">*</span>}
    </label>
  );
}

function FieldError({ children }) {
  return (
    <div className="field-error" role="alert" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <Icon name="alert" size={13} stroke={2} />{children}
    </div>
  );
}

function LabeledField({ id, label, required, error, leading, type = 'text', success, ...rest }) {
  return (
    <div className="field">
      {label && <FieldLabel required={required} htmlFor={id}>{label}</FieldLabel>}
      <div className="input-wrap">
        {leading && <span className="input-icon input-icon--lead"><Icon name={leading} size={16} /></span>}
        <input
          id={id}
          type={type}
          className={['input', leading && 'input--has-lead', error && 'input--error'].filter(Boolean).join(' ')}
          style={success ? { borderColor: 'var(--status-success)' } : undefined}
          {...rest}
        />
      </div>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

/* ---- Password field with show / hide toggle ------------------------------*/
function PasswordField({ id, label = 'Password', required, error, value, onChange, placeholder = '••••••••', defaultValue, autoComplete = 'current-password' }) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="field">
      <FieldLabel required={required} htmlFor={id}>{label}</FieldLabel>
      <div className="input-wrap">
        <span className="input-icon input-icon--lead"><Icon name="lock" size={16} /></span>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={['input', 'input--has-lead', 'input--has-trail', error && 'input--error'].filter(Boolean).join(' ')}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          style={{
            position: 'absolute', right: 8, width: 28, height: 28, display: 'flex',
            alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent',
            color: 'var(--text-tertiary)', cursor: 'pointer', borderRadius: 'var(--radius-input)'
          }}
        >
          <Icon name={show ? 'eyeOff' : 'eye'} size={16} />
        </button>
      </div>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

/* ---- OTP input: 6 square boxes, auto-advance, backspace ------------------*/
function OtpInput({ length = 6, state = 'default', defaultValue = '', onComplete }) {
  const [vals, setVals] = React.useState(() => {
    const arr = Array(length).fill('');
    for (let i = 0; i < Math.min(defaultValue.length, length); i++) arr[i] = defaultValue[i];
    return arr;
  });
  const [focusIdx, setFocusIdx] = React.useState(-1);
  const refs = React.useRef([]);

  function set(i, v) {
    if (!/^\d?$/.test(v)) return;
    const next = [...vals]; next[i] = v; setVals(next);
    if (v && i < length - 1) refs.current[i + 1] && refs.current[i + 1].focus();
    if (next.every(d => d !== '') && onComplete) onComplete(next.join(''));
  }
  function onKey(i, e) {
    if (e.key === 'Backspace' && !vals[i] && i > 0) refs.current[i - 1] && refs.current[i - 1].focus();
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1].focus();
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1].focus();
  }
  function onPaste(e) {
    const txt = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
    if (!txt) return;
    e.preventDefault();
    const next = Array(length).fill('');
    for (let i = 0; i < txt.length; i++) next[i] = txt[i];
    setVals(next);
    const last = Math.min(txt.length, length - 1);
    refs.current[last] && refs.current[last].focus();
    if (txt.length === length && onComplete) onComplete(txt);
  }

  const borderFor = (i) => {
    if (state === 'error') return 'var(--status-error)';
    if (state === 'success') return 'var(--status-success)';
    if (focusIdx === i) return 'var(--input-border-focus)';
    return 'var(--input-border)';
  };
  const ring = (i) => {
    if (state === 'error') return '0 0 0 3px color-mix(in srgb, var(--status-error) 22%, transparent)';
    if (state === 'success') return '0 0 0 3px color-mix(in srgb, var(--status-success) 22%, transparent)';
    if (focusIdx === i) return '0 0 0 3px var(--border-focus)';
    return 'none';
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }} onPaste={onPaste}>
      {vals.map((d, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          value={d}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          onChange={e => set(i, e.target.value)}
          onKeyDown={e => onKey(i, e)}
          onFocus={() => setFocusIdx(i)}
          onBlur={() => setFocusIdx(-1)}
          style={{
            width: 48, height: 48, textAlign: 'center', padding: 0,
            font: '500 20px/1 var(--font-sans)', color: 'var(--input-text)',
            background: 'var(--input-bg)', border: `1px solid ${borderFor(i)}`,
            borderRadius: 'var(--radius-input)', boxShadow: ring(i), outline: 'none',
            transition: 'border-color var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease)',
            caretColor: 'var(--accent-primary)'
          }}
        />
      ))}
    </div>
  );
}

/* ---- 3-step indicator -----------------------------------------------------*/
function StepIndicator({ current = 0, steps = ['Request OTP', 'Verify OTP', 'New password'] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
      {steps.map((s, i) => {
        const done = i < current, active = i === current;
        const circleBg = done || active ? 'var(--accent-primary)' : 'var(--bg-surface)';
        const circleBorder = done || active ? 'var(--accent-primary)' : 'var(--border-strong)';
        const circleColor = done || active ? 'var(--text-on-accent)' : 'var(--text-tertiary)';
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 'none', width: 96 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: circleBg, border: `1.5px solid ${circleBorder}`, color: circleColor,
                font: '500 13px/1 var(--font-sans)', transition: 'all var(--duration-base) var(--ease)'
              }}>
                {done ? <Icon name="check" size={15} stroke={2.4} /> : i + 1}
              </div>
              <span className="ds-label-md" style={{ color: active ? 'var(--text-primary)' : 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.3 }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < current ? 'var(--accent-primary)' : 'var(--border-default)', marginTop: 14, borderRadius: 999, transition: 'background var(--duration-base) var(--ease)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ---- Password strength: 4 segments ---------------------------------------*/
const STRENGTH = [
  { label: '', color: 'var(--border-default)' },
  { label: 'Weak', color: 'var(--status-error)' },
  { label: 'Fair', color: 'var(--status-warning)' },
  { label: 'Strong', color: 'var(--status-info)' },
  { label: 'Very strong', color: 'var(--status-success)' },
];
function scorePassword(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4) || (pw.length ? 1 : 0);
}
function StrengthBar({ score = 0 }) {
  const meta = STRENGTH[score];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4].map(seg => (
          <div key={seg} style={{
            flex: 1, height: 4, borderRadius: 999,
            background: seg <= score ? meta.color : 'var(--border-default)',
            transition: 'background var(--duration-base) var(--ease)'
          }} />
        ))}
      </div>
      {score > 0 && (
        <span className="ds-caption" style={{ color: meta.color, fontWeight: 500 }}>{meta.label}</span>
      )}
    </div>
  );
}

/* ---- Live match indicator -------------------------------------------------*/
function MatchIndicator({ match }) {
  if (match === null || match === undefined) return null;
  const color = match ? 'var(--status-success)' : 'var(--status-error)';
  return (
    <div className="ds-caption" style={{ display: 'flex', alignItems: 'center', gap: 5, color, fontWeight: 500 }}>
      <Icon name={match ? 'check' : 'x'} size={13} stroke={2.4} />
      {match ? 'Passwords match' : 'Passwords do not match'}
    </div>
  );
}

/* ---- Google brand mark + OAuth button + divider --------------------------*/
/* The Google "G" is the one place an outside brand's color is allowed in; it
   stays a self-contained mark inside a neutral secondary button (DS-compliant
   shell), per platform sign-in conventions. */
function GoogleG({ size = 18 }) {
  return React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': 'true',
    style: { flex: 'none', display: 'block' },
    dangerouslySetInnerHTML: { __html:
      '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>' +
      '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.28-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>' +
      '<path fill="#FBBC05" d="M5.85 14.1a6.6 6.6 0 0 1-.35-2.1c0-.73.13-1.44.35-2.1V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84z"/>' +
      '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.67 2.84C6.72 7.3 9.14 5.38 12 5.38z"/>'
    }
  });
}

function GoogleButton({ children, loading, ...rest }) {
  return (
    <button type="button" className="btn btn--secondary btn--lg"
      style={{ width: '100%', gap: 'var(--space-3)' }}
      disabled={loading || rest.disabled} aria-busy={loading || undefined} {...rest}>
      {loading ? <Spinner /> : <><GoogleG size={18} />{children}</>}
    </button>
  );
}

function OrDivider({ label = 'or' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }} aria-hidden="true">
      <div style={{ flex: 1, height: '0.5px', background: 'var(--border-default)' }} />
      <span className="ds-label-md" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <div style={{ flex: 1, height: '0.5px', background: 'var(--border-default)' }} />
    </div>
  );
}

/* ---- Purpose badge (read-only) -------------------------------------------*/
function PurposeBadge({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <span className="ds-label-md" style={{ color: 'var(--text-tertiary)' }}>For</span>
      <span className="badge badge--accent badge--md">{children}</span>
    </div>
  );
}

Object.assign(window, {
  Logo, AuthHeader, Spinner, SubmitButton, GhostLink, FieldLabel, FieldError,
  LabeledField, PasswordField, OtpInput, StepIndicator, StrengthBar, scorePassword,
  MatchIndicator, PurposeBadge, GoogleG, GoogleButton, OrDivider
});
