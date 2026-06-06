/* Omnyvora Auth — Login, Register, Send OTP screens.
   Every screen renders into a Frame (mobile = full-bleed, desktop = centered card). */

const { useState, useEffect, useRef } = React;

/* ---- Layout frame ---------------------------------------------------------*/
function Frame({ layout, children, footer, cardWidth = 424 }) {
  if (layout === 'mobile') {
    return (
      <div style={{ width: '100%', height: '100%', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column', padding: '52px 24px 28px', boxSizing: 'border-box' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>{children}</div>
        {footer && <div style={{ paddingTop: 'var(--space-6)', textAlign: 'center' }}>{footer}</div>}
      </div>
    );
  }
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, boxSizing: 'border-box' }}>
      <div className="card card--raised" style={{ width: '100%', maxWidth: cardWidth, background: 'var(--bg-surface-raised)' }}>
        <div style={{ padding: '36px 36px 30px', display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>{children}</div>
        {footer && <div className="card__footer" style={{ justifyContent: 'center', background: 'var(--bg-surface)' }}>{footer}</div>}
      </div>
    </div>
  );
}

function FooterText({ prompt, action, onAction }) {
  return (
    <span className="ds-body-sm" style={{ color: 'var(--text-secondary)' }}>
      {prompt}{' '}<GhostLink onClick={onAction}>{action}</GhostLink>
    </span>
  );
}

/* countdown hook for resend timers */
function useCountdown(start, running) {
  const [s, setS] = useState(start);
  useEffect(() => {
    if (!running || s <= 0) return;
    const t = setTimeout(() => setS(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [s, running]);
  const reset = () => setS(start);
  return [s, reset];
}

/* ===========================================================================
   FRAME 1 — LOGIN
   ======================================================================== */
function LoginScreen({ layout = 'desktop', emailError, passwordError, loading }) {
  const [email, setEmail] = useState('');
  const [emErr, setEmErr] = useState(emailError || '');
  const [pwErr, setPwErr] = useState(passwordError || '');

  function submit(e) {
    e.preventDefault();
    let ok = true;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setEmErr('Please enter a valid email address'); ok = false; } else setEmErr('');
    if (!ok) return;
  }

  return (
    <Frame layout={layout}
      footer={<FooterText prompt="Don't have an account?" action="Register" />}>
      <AuthHeader title="Welcome back" subtitle="Sign in to your account" />
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }} noValidate>
        <LabeledField id="login-email" label="Email" required leading="mail" type="email"
          placeholder="you@example.com" value={email}
          onChange={e => { setEmail(e.target.value); setEmErr(''); }} error={emErr} autoComplete="email" />
        <div>
          <PasswordField id="login-pw" required error={pwErr} />
          <div style={{ textAlign: 'right', marginTop: 'var(--space-2)' }}>
            <GhostLink className="ds-body-sm" style={{ fontWeight: 400 }}>Forgot password?</GhostLink>
          </div>
        </div>
        <SubmitButton loading={loading} type="submit">Sign in</SubmitButton>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <OrDivider />
        <GoogleButton>Sign in with Google</GoogleButton>
      </div>
    </Frame>
  );
}

/* ===========================================================================
   FRAME 2 — REGISTER
   ======================================================================== */
function RegisterScreen({ layout = 'desktop', otpState, emailError, passwordError, loading, otpValue = '', resendStart = 42, otpSent = true }) {
  const [running] = useState(otpSent);
  const [secs, reset] = useCountdown(resendStart, running);
  const canResend = secs <= 0;

  const stacked = layout === 'mobile';

  return (
    <Frame layout={layout} cardWidth={460}
      footer={<FooterText prompt="Already have an account?" action="Sign in" />}>
      <AuthHeader title="Create your account" subtitle="Fill in the details below to get started" />
      <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }} noValidate onSubmit={e => e.preventDefault()}>
        <div style={{ display: stacked ? 'flex' : 'grid', flexDirection: 'column', gap: 'var(--space-5)', gridTemplateColumns: stacked ? undefined : '1fr 1fr' }}>
          <LabeledField id="reg-first" label="First name" required placeholder="Jordan" autoComplete="given-name" defaultValue="Jordan" />
          <LabeledField id="reg-last" label="Last name" required placeholder="Avery" autoComplete="family-name" defaultValue="Avery" />
        </div>

        <div className="field">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FieldLabel required htmlFor="reg-email">Email</FieldLabel>
            <GhostLink className="ds-label-md" style={{ letterSpacing: 'var(--label-md-tracking)' }}>Send OTP</GhostLink>
          </div>
          <div className="input-wrap">
            <span className="input-icon input-icon--lead"><Icon name="mail" size={16} /></span>
            <input id="reg-email" type="email" placeholder="you@example.com" autoComplete="email"
              defaultValue="jordan.avery@example.com"
              className={['input', 'input--has-lead', emailError && 'input--error'].filter(Boolean).join(' ')} />
          </div>
          {emailError && <FieldError>{emailError}</FieldError>}
        </div>

        <PasswordField id="reg-pw" required error={passwordError} autoComplete="new-password"
          defaultValue={passwordError ? 'abc' : ''} />

        {/* OTP block */}
        <div className="field" style={{ gap: 'var(--space-3)' }}>
          <FieldLabel required>Enter OTP</FieldLabel>
          <OtpInput state={otpState === 'error' ? 'error' : otpState === 'success' ? 'success' : 'default'}
            defaultValue={otpValue} />
          {otpState === 'error'
            ? <FieldError>That code is incorrect. Check your email and try again.</FieldError>
            : otpState === 'success'
              ? <div className="ds-caption" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--status-success)', fontWeight: 500 }}><Icon name="check" size={13} stroke={2.4} />Code verified</div>
              : <span className="ds-caption" style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="clock" size={12} />Sent to your email · Valid for 5 minutes</span>}
          <div style={{ marginTop: 2 }}>
            {canResend
              ? <GhostLink className="ds-body-sm" onClick={reset} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="refresh" size={13} />Resend OTP</GhostLink>
              : <span className="ds-body-sm" style={{ color: 'var(--text-disabled)' }}>Resend in {secs}s</span>}
          </div>
        </div>

        <SubmitButton loading={loading} type="submit">Create account</SubmitButton>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <OrDivider />
        <GoogleButton>Sign up with Google</GoogleButton>
      </div>
    </Frame>
  );
}

/* ===========================================================================
   FRAME 3 — SEND OTP
   ======================================================================== */
function SendOtpBody({ purpose = 'Account registration', prefill = 'jordan.avery@example.com', error, loading }) {
  return (
    <>
      <AuthHeader title="Verify your identity" subtitle="We'll send a one-time code to confirm it's you" />
      <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }} noValidate onSubmit={e => e.preventDefault()}>
        <LabeledField id="sendotp-email" label="Email address" required leading="mail" type="email"
          placeholder="you@example.com" defaultValue={prefill} error={error} autoComplete="email" />
        <PurposeBadge>{purpose}</PurposeBadge>
        <SubmitButton loading={loading} type="submit" icon={loading ? undefined : 'arrowRight'}>Send OTP</SubmitButton>
      </form>
      <p className="ds-caption" style={{ color: 'var(--text-tertiary)', margin: 0, textAlign: 'center', lineHeight: 1.55 }}>
        The code will be valid for 5 minutes. Check your spam folder if you don't receive it.
      </p>
    </>
  );
}

function SendOtpSuccess({ email = 'jordan.avery@example.com' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-5)', padding: '8px 0' }}>
      <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-icon)', background: 'var(--status-success-bg)', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="mailCheck" size={26} stroke={1.9} />
      </div>
      <div>
        <h2 className="ds-display-md" style={{ color: 'var(--text-primary)', margin: 0 }}>Code sent!</h2>
        <p className="ds-body-md" style={{ color: 'var(--text-secondary)', margin: '6px 0 0' }}>
          Check your inbox at <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{email}</span>
        </p>
      </div>
      <span className="ds-body-sm" style={{ color: 'var(--text-tertiary)' }}>
        Didn't receive it? <GhostLink>Resend</GhostLink>
      </span>
    </div>
  );
}

function SendOtpScreen({ layout = 'desktop', variant = 'default', purpose, error, loading }) {
  return (
    <Frame layout={layout}>
      {variant === 'success'
        ? <SendOtpSuccess />
        : <SendOtpBody purpose={purpose} error={error} loading={loading} />}
    </Frame>
  );
}

/* Modal / dialog overlay version of Send OTP */
function SendOtpModal() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'var(--bg-surface)', overflow: 'hidden' }}>
      {/* faux page behind */}
      <div style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 16, opacity: 0.6 }}>
        <div className="skel" style={{ width: 200, height: 28 }} />
        <div className="skel" style={{ width: '70%', height: 14 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 8 }}>
          {[0, 1, 2].map(i => <div key={i} className="skel" style={{ height: 96 }} />)}
        </div>
      </div>
      {/* scrim */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,17,17,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 420, background: 'var(--bg-overlay)', borderRadius: 'var(--radius-modal)', boxShadow: 'var(--shadow-3)', border: '0.5px solid var(--border-default)', overflow: 'hidden' }}>
          <div style={{ padding: '32px 36px 30px', display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>
            <SendOtpBody />
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Frame, FooterText, useCountdown,
  LoginScreen, RegisterScreen,
  SendOtpScreen, SendOtpModal, SendOtpBody, SendOtpSuccess
});
