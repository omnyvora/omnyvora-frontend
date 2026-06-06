/* Omnyvora Auth — Frame 4: Reset Password (3-step flow + success terminal) */

/* ---- Step 1: Request OTP --------------------------------------------------*/
function ResetStep1({ onNext, error, loading }) {
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h2 className="ds-display-md" style={{ color: 'var(--text-primary)', margin: 0 }}>Reset your password</h2>
        <p className="ds-body-md" style={{ color: 'var(--text-secondary)', margin: '6px 0 0' }}>Enter your email to receive a reset code</p>
      </div>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }} noValidate onSubmit={e => { e.preventDefault(); onNext && onNext(); }}>
        <LabeledField id="reset-email" label="Email" required leading="mail" type="email"
          placeholder="you@example.com" defaultValue="jordan.avery@example.com" error={error} autoComplete="email" />
        <SubmitButton loading={loading} type="submit">Send reset code</SubmitButton>
      </form>
    </>
  );
}

/* ---- Step 2: Verify OTP ---------------------------------------------------*/
function ResetStep2({ onNext, onBack, otpState = 'default', otpValue = '', resendStart = 42 }) {
  const [secs, reset] = useCountdown(resendStart, true);
  const canResend = secs <= 0;
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h2 className="ds-display-md" style={{ color: 'var(--text-primary)', margin: 0 }}>Enter your code</h2>
        <p className="ds-body-md" style={{ color: 'var(--text-secondary)', margin: '6px 0 0' }}>
          We sent a 6-digit code to <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>jo***@example.com</span>
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <OtpInput state={otpState} defaultValue={otpValue} />
          {otpState === 'error' && <FieldError>Invalid or expired code. Request a new one.</FieldError>}
          <div style={{ textAlign: 'center', marginTop: 2 }}>
            {canResend
              ? <GhostLink className="ds-body-sm" onClick={reset} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="refresh" size={13} />Resend OTP</GhostLink>
              : <span className="ds-body-sm" style={{ color: 'var(--text-disabled)' }}>Resend in {secs}s</span>}
          </div>
        </div>
        <SubmitButton type="button" onClick={onNext}>Verify code</SubmitButton>
        <div style={{ textAlign: 'center' }}>
          <GhostLink className="ds-body-sm" onClick={onBack} style={{ fontWeight: 400, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Icon name="arrowLeft" size={14} />Change email
          </GhostLink>
        </div>
      </div>
    </>
  );
}

/* ---- Step 3: New Password -------------------------------------------------*/
function ResetStep3({ onNext, loading }) {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const score = scorePassword(pw);
  const match = confirm.length === 0 ? null : pw === confirm;

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h2 className="ds-display-md" style={{ color: 'var(--text-primary)', margin: 0 }}>Set a new password</h2>
        <p className="ds-body-md" style={{ color: 'var(--text-secondary)', margin: '6px 0 0' }}>Choose a strong password you don't use elsewhere</p>
      </div>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }} noValidate onSubmit={e => { e.preventDefault(); onNext && onNext(); }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <PasswordField id="reset-new" label="New password" required value={pw}
            onChange={e => setPw(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
          <StrengthBar score={score} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <PasswordField id="reset-confirm" label="Confirm password" required value={confirm}
            onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" autoComplete="new-password" />
          <MatchIndicator match={match} />
        </div>
        <SubmitButton loading={loading} type="submit" disabled={!pw || pw !== confirm}>Reset password</SubmitButton>
      </form>
    </>
  );
}

/* ---- Success terminal -----------------------------------------------------*/
function ResetSuccess() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-6)', padding: '12px 0' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--status-success-bg)', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="checkCircle" size={30} stroke={1.9} />
      </div>
      <div>
        <h2 className="ds-display-md" style={{ color: 'var(--text-primary)', margin: 0 }}>Password reset successfully!</h2>
        <p className="ds-body-md" style={{ color: 'var(--text-secondary)', margin: '6px 0 0', maxWidth: 320 }}>
          Your password has been updated. You can now sign in with your new credentials.
        </p>
      </div>
      <SubmitButton type="button">Go to login</SubmitButton>
    </div>
  );
}

/* ---- Orchestrator ---------------------------------------------------------*/
function ResetPasswordScreen({ layout = 'desktop', forceStep, forceSuccess, otpState, otpValue, stepLoading }) {
  const [step, setStep] = useState(forceStep ?? 0);
  const [done, setDone] = useState(!!forceSuccess);

  const showSuccess = forceSuccess || done;
  const current = forceStep ?? step;

  return (
    <Frame layout={layout} cardWidth={layout === 'mobile' ? undefined : 520}>
      {!showSuccess && (
        <div style={{ padding: layout === 'mobile' ? '4px 0 4px' : '0 4px' }}>
          <StepIndicator current={current} />
        </div>
      )}
      {showSuccess ? <ResetSuccess />
        : current === 0 ? <ResetStep1 onNext={() => setStep(1)} loading={stepLoading} />
          : current === 1 ? <ResetStep2 onNext={() => setStep(2)} onBack={() => setStep(0)} otpState={otpState || 'default'} otpValue={otpValue} />
            : <ResetStep3 onNext={() => setDone(true)} loading={stepLoading} />}
    </Frame>
  );
}

Object.assign(window, {
  ResetStep1, ResetStep2, ResetStep3, ResetSuccess, ResetPasswordScreen
});
