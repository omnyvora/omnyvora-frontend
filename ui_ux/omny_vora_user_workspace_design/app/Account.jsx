/* Omnyvora Workspace — Section 4: Account (General / Security / Danger zone) */

function fmtDate(iso) {
  const m = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const d = new Date(iso + 'T00:00:00');
  return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function AccountGeneral() {
  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <div className="card__header"><div className="ds-display-sm">General</div></div>
      <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ReadonlyField label="Email" leading="mail" value={USER.email} note="Contact support to change your email address." />
        <ReadonlyField label="Account created" leading="calendar" value={fmtDate(USER.createdIso)} />
        <div className="field">
          <label className="label">Account status</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38 }}>
            <Badge tone="success" size="md">Active</Badge>
            <span className="ds-body-sm" style={{ color: 'var(--text-secondary)' }}>Your account is in good standing.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountSecurity({ onToast }) {
  const [cur, setCur] = React.useState('');
  const [nw, setNw] = React.useState('');
  const [cf, setCf] = React.useState('');
  const [err, setErr] = React.useState('');
  function save() {
    if (!cur) return setErr('Enter your current password.');
    if (nw.length < 8) return setErr('New password must be at least 8 characters.');
    if (nw !== cf) return setErr('New passwords do not match.');
    setErr(''); setCur(''); setNw(''); setCf('');
    onToast({ tone: 'success', title: 'Password updated', msg: 'Use your new password next time you sign in.' });
  }
  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <div className="card__header"><div className="ds-display-sm">Change password</div></div>
      <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <PasswordField label="Current password" placeholder="••••••••" value={cur} onChange={e => { setCur(e.target.value); setErr(''); }} />
        <PasswordField label="New password" placeholder="At least 8 characters" value={nw} onChange={e => { setNw(e.target.value); setErr(''); }} />
        <PasswordField label="Confirm new password" placeholder="Re-enter new password" value={cf} onChange={e => { setCf(e.target.value); setErr(''); }} error={err} />
        <div className="ds-caption" style={{ color: 'var(--text-tertiary)' }}>Other sessions will remain active.</div>
      </div>
      <div className="card__footer">
        <Button variant="primary" onClick={save}>Save password</Button>
      </div>
    </div>
  );
}

function DangerRow({ title, desc, button, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '18px 20px', borderBottom: last ? 'none' : '0.5px solid color-mix(in srgb, var(--status-error) 22%, transparent)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '500 14px var(--font-sans)', color: 'var(--text-primary)' }}>{title}</div>
        <div className="ds-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{desc}</div>
      </div>
      {button}
    </div>
  );
}

function AccountDanger({ onConfirm }) {
  const deactivateBtn = (
    <button onClick={() => onConfirm({
      title: 'Deactivate account?', body: 'Your account will be disabled and hidden across Omnyvora. You can reactivate it any time by logging back in.',
      confirmLabel: 'Deactivate', tone: 'warning',
    })}
      style={{ flex: 'none', height: 36, padding: '0 16px', borderRadius: 'var(--radius-button)', cursor: 'pointer',
        background: 'var(--bg-surface-raised)', border: '0.5px solid var(--status-warning)', color: '#92600c',
        font: '500 13px var(--font-sans)', transition: 'background var(--duration-fast) var(--ease)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--status-warning-bg)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface-raised)'}>Deactivate account</button>
  );
  const deleteBtn = (
    <Button variant="danger" size="sm" leading="trash" onClick={() => onConfirm({
      title: 'Delete account?', body: 'This is permanent and cannot be undone. All your data across every Omnyvora service will be removed.',
      confirmLabel: 'Delete account', tone: 'danger', requireType: true,
    })}>Delete account</Button>
  );
  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="ds-display-sm" style={{ color: 'var(--status-error)' }}>Danger zone</div>
      <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden',
        border: '0.5px solid color-mix(in srgb, var(--status-error) 35%, transparent)',
        background: 'color-mix(in srgb, var(--status-error) 5%, var(--bg-surface-raised))' }}>
        <DangerRow title="Deactivate account" desc="Your account will be disabled. Reactivate by logging in." button={deactivateBtn} />
        <DangerRow title="Delete account" desc="Permanent. Cannot be undone. All data removed." button={deleteBtn} last />
      </div>
    </div>
  );
}

function Account({ onToast, onConfirm }) {
  const [sub, setSub] = React.useState('general');
  return (
    <Page>
      <PageHead title="Account" subtitle="Security and account settings." />
      <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start' }}>
        <SubNav width={200} value={sub} onChange={setSub} items={[
          { id: 'general', label: 'General', icon: 'shield' },
          { id: 'security', label: 'Security', icon: 'lock' },
          { id: 'danger', label: 'Danger zone', icon: 'alertTriangle' },
        ]} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {sub === 'general' && <AccountGeneral />}
          {sub === 'security' && <AccountSecurity onToast={onToast} />}
          {sub === 'danger' && <AccountDanger onConfirm={onConfirm} />}
        </div>
      </div>
    </Page>
  );
}

Object.assign(window, { Account });
