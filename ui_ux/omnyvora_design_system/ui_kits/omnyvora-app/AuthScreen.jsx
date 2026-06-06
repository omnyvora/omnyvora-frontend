/* Omnyvora UI Kit — Auth screen (login + OTP register flow) */

function AuthScreen({ theme, tool, onAuthed }) {
  const [mode, setMode] = React.useState('login'); // login | register | otp
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [err, setErr] = React.useState('');
  const otpRefs = React.useRef([]);
  const logo = theme === 'dark' ? '../../assets/logo-mark-white.png' : '../../assets/logo-mark-black.png';

  function submitLogin(e) {
    e.preventDefault();
    if (!email.includes('@')) { setErr('Enter a valid email'); return; }
    if (pw.length < 4) { setErr('Password is too short'); return; }
    onAuthed(email);
  }
  function startRegister(e) {
    e.preventDefault();
    if (!email.includes('@')) { setErr('Enter a valid email'); return; }
    setErr(''); setMode('otp');
    setTimeout(() => otpRefs.current[0] && otpRefs.current[0].focus(), 50);
  }
  function setOtpDigit(i, v) {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1] && otpRefs.current[i + 1].focus();
  }
  const otpComplete = otp.every(d => d !== '');

  return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)', padding: 24 }}>
      <div className="card card--raised" style={{ width: 392, background: 'var(--bg-surface-raised)' }}>
        <div style={{ padding: '32px 32px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-logo)', background: 'var(--bg-surface)', border: '0.5px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={logo} style={{ width: 32, height: 32, objectFit: 'contain' }} alt="Omnyvora" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="ds-display-md" style={{ color: 'var(--text-primary)' }}>
              {mode === 'otp' ? 'Check your email' : mode === 'login' ? 'Welcome back' : 'Create your account'}
            </div>
            <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
              {mode === 'otp' ? <>We sent a 6-digit code to <span style={{ color: 'var(--text-primary)' }}>{email}</span></>
                : mode === 'login' ? 'Sign in to your Omnyvora workspace'
                : 'One account for every Omnyvora tool'}
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 32px 28px' }}>
          {mode === 'otp' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {otp.map((d, i) => (
                  <input key={i} ref={el => otpRefs.current[i] = el} value={d}
                    onChange={e => setOtpDigit(i, e.target.value)}
                    onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) otpRefs.current[i - 1].focus(); }}
                    className="input" inputMode="numeric" maxLength={1}
                    style={{ width: 44, height: 52, textAlign: 'center', fontSize: 20, fontWeight: 500, padding: 0 }} />
                ))}
              </div>
              <Button variant="accent" size="lg" disabled={!otpComplete} onClick={() => onAuthed(email)} style={{ width: '100%' }}>Verify & continue</Button>
              <div className="ds-caption" style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                Didn’t get it? <a style={{ color: 'var(--accent-text)', cursor: 'pointer' }}>Resend code</a>
              </div>
            </div>
          ) : (
            <form onSubmit={mode === 'login' ? submitLogin : startRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Email" leading="mail" type="email" placeholder="you@company.com"
                value={email} onChange={e => { setEmail(e.target.value); setErr(''); }} />
              {mode === 'login' && (
                <Field label="Password" leading="lock" trailing="eye" type="password" placeholder="••••••••"
                  value={pw} onChange={e => { setPw(e.target.value); setErr(''); }} error={err} />
              )}
              {mode === 'register' && err && <div className="field-error">{err}</div>}
              {mode === 'login' && !err && (
                <div style={{ textAlign: 'right', marginTop: -6 }}>
                  <a className="ds-body-sm" style={{ color: 'var(--accent-text)', cursor: 'pointer' }}>Forgot password?</a>
                </div>
              )}
              <Button variant="accent" size="lg" type="submit" style={{ width: '100%' }}>
                {mode === 'login' ? 'Sign in' : 'Send verification code'}
              </Button>
            </form>
          )}

          {mode !== 'otp' && <div className="divider--labeled" style={{ margin: '20px 0' }}><span>or</span></div>}
          {mode !== 'otp' && (
            <Button variant="secondary" size="lg" style={{ width: '100%' }} onClick={() => onAuthed('demo@omnyvora.io')}>
              Continue as demo
            </Button>
          )}
        </div>

        <div className="card__footer" style={{ justifyContent: 'center', background: 'var(--bg-surface)' }}>
          <span className="ds-body-sm" style={{ color: 'var(--text-secondary)' }}>
            {mode === 'login' ? 'New to Omnyvora?' : 'Already have an account?'}{' '}
            <a style={{ color: 'var(--accent-text)', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => { setErr(''); setMode(mode === 'login' ? 'register' : 'login'); }}>
              {mode === 'login' ? 'Create account' : 'Sign in'}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AuthScreen });
