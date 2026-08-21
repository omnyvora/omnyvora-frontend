/* @ds-bundle: {"format":3,"namespace":"OmnyvoraDesignSystem_8e4cc7","components":[],"sourceHashes":{"ui_kits/omnyvora-app/AppShell.jsx":"189fe0ffec06","ui_kits/omnyvora-app/AuthScreen.jsx":"ddf3920b4330","ui_kits/omnyvora-app/Dashboard.jsx":"2cd47615f561","ui_kits/omnyvora-app/icons.jsx":"e4c5df9e3f00","ui_kits/omnyvora-app/ui.jsx":"7e1778463a0e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.OmnyvoraDesignSystem_8e4cc7 = window.OmnyvoraDesignSystem_8e4cc7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/omnyvora-app/AppShell.jsx
try { (() => {
/* Omnyvora UI Kit — App shell: Sidebar (tool switcher) + TopBar */

const TOOLS = [{
  id: 'portfolio',
  label: 'Portfolio',
  icon: 'layers'
}, {
  id: 'photo',
  label: 'Photo',
  icon: 'image'
}, {
  id: 'productivity',
  label: 'Productivity',
  icon: 'zap'
}];
function Sidebar({
  theme,
  tool,
  setTool,
  nav,
  setNav
}) {
  const logo = theme === 'dark' ? '../../assets/logo-mark-white.png' : '../../assets/logo-mark-black.png';
  const items = [{
    id: 'overview',
    label: 'Overview',
    icon: 'home'
  }, {
    id: 'projects',
    label: 'Projects',
    icon: 'folder'
  }, {
    id: 'starred',
    label: 'Starred',
    icon: 'star'
  }];
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      width: 'var(--sidebar-width)',
      flex: 'none',
      background: 'var(--bg-surface)',
      borderRight: '0.5px solid var(--border-default)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '4px 8px 16px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    style: {
      width: 26,
      height: 26,
      objectFit: 'contain'
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 16px var(--font-sans)',
      letterSpacing: '-0.3px',
      color: 'var(--text-primary)'
    }
  }, "Omnyvora")), /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      padding: '8px 8px 6px'
    }
  }, "Tools"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, TOOLS.map(t => {
    const active = t.id === tool;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      "data-tool": t.id,
      onClick: () => setTool(t.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 36,
        padding: '0 10px',
        borderRadius: 8,
        cursor: 'pointer',
        background: active ? 'var(--accent-subtle)' : 'transparent',
        color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
        font: active ? '500 13px var(--font-sans)' : '400 13px var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 16
    }), t.label, active && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        width: 6,
        height: 6,
        borderRadius: 3,
        background: 'var(--accent-primary)'
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      padding: '18px 8px 6px'
    }
  }, "Workspace"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, items.map(it => {
    const active = nav === it.id;
    return /*#__PURE__*/React.createElement("div", {
      key: it.id,
      onClick: () => setNav(it.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 34,
        padding: '0 10px',
        borderRadius: 7,
        cursor: 'pointer',
        background: active ? 'var(--bg-surface-raised)' : 'transparent',
        boxShadow: active ? 'var(--shadow-1)' : 'none',
        border: active ? '0.5px solid var(--border-default)' : '0.5px solid transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        font: active ? '500 13px var(--font-sans)' : '400 13px var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 16
    }), it.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setNav('settings'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 34,
      padding: '0 10px',
      borderRadius: 7,
      cursor: 'pointer',
      color: nav === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
      font: '400 13px var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 16
  }), "Settings")));
}
function TopBar({
  title,
  email,
  theme,
  setTheme,
  onNotify,
  unread,
  onLogout
}) {
  const [menu, setMenu] = React.useState(false);
  const initials = (email || 'OV').slice(0, 2).toUpperCase();
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 60,
      flex: 'none',
      background: 'var(--bg-surface-raised)',
      borderBottom: '0.5px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 20px',
      position: 'relative',
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 17px var(--font-sans)',
      letterSpacing: '-0.3px',
      color: 'var(--text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "input-wrap",
    style: {
      marginLeft: 8,
      width: 240
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "input-icon input-icon--lead"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15
  })), /*#__PURE__*/React.createElement("input", {
    className: "input input--has-lead",
    style: {
      height: 34
    },
    placeholder: "Search\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    style: {
      width: 34,
      padding: 0
    },
    title: "Toggle theme"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: theme === 'dark' ? 'eye' : 'grid',
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    onClick: onNotify,
    style: {
      width: 34,
      padding: 0,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 17
  }), unread > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 5,
      right: 6,
      width: 7,
      height: 7,
      borderRadius: 4,
      background: 'var(--status-error)',
      border: '1.5px solid var(--bg-surface-raised)'
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm",
    leading: "plus"
  }, "New"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setMenu(m => !m),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: "md",
    initials: initials
  })), menu && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 40
    },
    onClick: () => setMenu(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "menu",
    style: {
      position: 'absolute',
      right: 0,
      top: 42,
      zIndex: 50,
      minWidth: 200
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 10px 10px',
      borderBottom: '0.5px solid var(--border-default)',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 13px var(--font-sans)',
      color: 'var(--text-primary)'
    }
  }, "Signed in"), /*#__PURE__*/React.createElement("div", {
    className: "ds-body-sm",
    style: {
      color: 'var(--text-secondary)'
    }
  }, email)), /*#__PURE__*/React.createElement("div", {
    className: "menu__item"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 15
  }), "Profile"), /*#__PURE__*/React.createElement("div", {
    className: "menu__item"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 15
  }), "Settings"), /*#__PURE__*/React.createElement("div", {
    className: "menu__divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "menu__item menu__item--danger",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "logout",
    size: 15
  }), "Log out"))))));
}
Object.assign(window, {
  Sidebar,
  TopBar,
  TOOLS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/omnyvora-app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/omnyvora-app/AuthScreen.jsx
try { (() => {
/* Omnyvora UI Kit — Auth screen (login + OTP register flow) */

function AuthScreen({
  theme,
  tool,
  onAuthed
}) {
  const [mode, setMode] = React.useState('login'); // login | register | otp
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [err, setErr] = React.useState('');
  const otpRefs = React.useRef([]);
  const logo = theme === 'dark' ? '../../assets/logo-mark-white.png' : '../../assets/logo-mark-black.png';
  function submitLogin(e) {
    e.preventDefault();
    if (!email.includes('@')) {
      setErr('Enter a valid email');
      return;
    }
    if (pw.length < 4) {
      setErr('Password is too short');
      return;
    }
    onAuthed(email);
  }
  function startRegister(e) {
    e.preventDefault();
    if (!email.includes('@')) {
      setErr('Enter a valid email');
      return;
    }
    setErr('');
    setMode('otp');
    setTimeout(() => otpRefs.current[0] && otpRefs.current[0].focus(), 50);
  }
  function setOtpDigit(i, v) {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1] && otpRefs.current[i + 1].focus();
  }
  const otpComplete = otp.every(d => d !== '');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-surface)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card--raised",
    style: {
      width: 392,
      background: 'var(--bg-surface-raised)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px 32px 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-logo)',
      background: 'var(--bg-surface)',
      border: '0.5px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    style: {
      width: 32,
      height: 32,
      objectFit: 'contain'
    },
    alt: "Omnyvora"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-display-md",
    style: {
      color: 'var(--text-primary)'
    }
  }, mode === 'otp' ? 'Check your email' : mode === 'login' ? 'Welcome back' : 'Create your account'), /*#__PURE__*/React.createElement("div", {
    className: "ds-body-sm",
    style: {
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, mode === 'otp' ? /*#__PURE__*/React.createElement(React.Fragment, null, "We sent a 6-digit code to ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-primary)'
    }
  }, email)) : mode === 'login' ? 'Sign in to your Omnyvora workspace' : 'One account for every Omnyvora tool'))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 32px 28px'
    }
  }, mode === 'otp' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      justifyContent: 'center'
    }
  }, otp.map((d, i) => /*#__PURE__*/React.createElement("input", {
    key: i,
    ref: el => otpRefs.current[i] = el,
    value: d,
    onChange: e => setOtpDigit(i, e.target.value),
    onKeyDown: e => {
      if (e.key === 'Backspace' && !d && i > 0) otpRefs.current[i - 1].focus();
    },
    className: "input",
    inputMode: "numeric",
    maxLength: 1,
    style: {
      width: 44,
      height: 52,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 500,
      padding: 0
    }
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    disabled: !otpComplete,
    onClick: () => onAuthed(email),
    style: {
      width: '100%'
    }
  }, "Verify & continue"), /*#__PURE__*/React.createElement("div", {
    className: "ds-caption",
    style: {
      textAlign: 'center',
      color: 'var(--text-tertiary)'
    }
  }, "Didn\u2019t get it? ", /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'var(--accent-text)',
      cursor: 'pointer'
    }
  }, "Resend code"))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: mode === 'login' ? submitLogin : startRegister,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    leading: "mail",
    type: "email",
    placeholder: "you@company.com",
    value: email,
    onChange: e => {
      setEmail(e.target.value);
      setErr('');
    }
  }), mode === 'login' && /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    leading: "lock",
    trailing: "eye",
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: pw,
    onChange: e => {
      setPw(e.target.value);
      setErr('');
    },
    error: err
  }), mode === 'register' && err && /*#__PURE__*/React.createElement("div", {
    className: "field-error"
  }, err), mode === 'login' && !err && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      marginTop: -6
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "ds-body-sm",
    style: {
      color: 'var(--accent-text)',
      cursor: 'pointer'
    }
  }, "Forgot password?")), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    type: "submit",
    style: {
      width: '100%'
    }
  }, mode === 'login' ? 'Sign in' : 'Send verification code')), mode !== 'otp' && /*#__PURE__*/React.createElement("div", {
    className: "divider--labeled",
    style: {
      margin: '20px 0'
    }
  }, /*#__PURE__*/React.createElement("span", null, "or")), mode !== 'otp' && /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    style: {
      width: '100%'
    },
    onClick: () => onAuthed('demo@omnyvora.io')
  }, "Continue as demo")), /*#__PURE__*/React.createElement("div", {
    className: "card__footer",
    style: {
      justifyContent: 'center',
      background: 'var(--bg-surface)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-body-sm",
    style: {
      color: 'var(--text-secondary)'
    }
  }, mode === 'login' ? 'New to Omnyvora?' : 'Already have an account?', ' ', /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'var(--accent-text)',
      cursor: 'pointer',
      fontWeight: 500
    },
    onClick: () => {
      setErr('');
      setMode(mode === 'login' ? 'register' : 'login');
    }
  }, mode === 'login' ? 'Create account' : 'Sign in')))));
}
Object.assign(window, {
  AuthScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/omnyvora-app/AuthScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/omnyvora-app/Dashboard.jsx
try { (() => {
/* Omnyvora UI Kit — Dashboard views (overview / projects / starred / settings) + modal */

const TOOL_META = {
  portfolio: {
    label: 'Portfolio',
    tagline: 'Showcase your work',
    stats: [['Live projects', '12', '', '8.2%', 'up'], ['Total views', '48.6', 'k', '12.4%', 'up'], ['Avg. time', '2', 'm', '3.1%', 'down']]
  },
  photo: {
    label: 'Photo',
    tagline: 'Organize every shoot',
    stats: [['Albums', '34', '', '5 new', 'up'], ['Storage used', '64', 'GB', '3.1%', 'down'], ['Shared', '9', '/12', '', '']]
  },
  productivity: {
    label: 'Productivity',
    tagline: 'Get things done',
    stats: [['Open tasks', '27', '', '4 today', 'up'], ['Completed', '143', '', '18%', 'up'], ['Focus time', '6.2', 'h', '0.4h', 'down']]
  }
};
const SAMPLE_PROJECTS = {
  portfolio: [['Q3 Launch site', 'Live', 'success', '2d ago'], ['Brand refresh', 'Draft', 'neutral', '5d ago'], ['Case study — Acme', 'Live', 'success', '1w ago'], ['Portfolio v4', 'Review', 'warning', '2w ago']],
  photo: [['Tokyo 2026', 'Shared', 'accent', '1d ago'], ['Studio — June', 'Private', 'neutral', '3d ago'], ['Product shots', 'Shared', 'accent', '6d ago'], ['Wedding — M&K', 'Archived', 'neutral', '3w ago']],
  productivity: [['Sprint 24 board', 'Active', 'success', '1h ago'], ['Roadmap Q3', 'Active', 'success', '1d ago'], ['Hiring pipeline', 'Paused', 'warning', '4d ago'], ['Personal OKRs', 'Active', 'success', '1w ago']]
};
function Dashboard({
  tool,
  nav,
  onNewProject,
  onDeleteProject
}) {
  const meta = TOOL_META[tool];
  const projects = SAMPLE_PROJECTS[tool];
  if (nav === 'settings') return /*#__PURE__*/React.createElement(SettingsView, {
    tool: tool
  });
  if (nav === 'starred') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--content-max)',
        margin: '0 auto',
        width: '100%',
        padding: '32px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        background: 'var(--bg-surface-raised)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty"
    }, /*#__PURE__*/React.createElement("div", {
      className: "empty__icon"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 24,
      stroke: 1.75
    })), /*#__PURE__*/React.createElement("div", {
      className: "empty__title"
    }, "Nothing starred yet"), /*#__PURE__*/React.createElement("div", {
      className: "empty__desc"
    }, "Star a ", meta.label.toLowerCase(), " project to pin it here for quick access."), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "sm",
      leading: "plus",
      onClick: onNewProject,
      style: {
        marginTop: 4
      }
    }, "New project"))));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      width: '100%',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, nav === 'overview' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      color: 'var(--accent-text)'
    }
  }, meta.label), /*#__PURE__*/React.createElement("div", {
    className: "ds-display-lg",
    style: {
      color: 'var(--text-primary)',
      marginTop: 4
    }
  }, "Good morning, Alex"), /*#__PURE__*/React.createElement("div", {
    className: "ds-body-md",
    style: {
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, meta.tagline, " \u2014 here\u2019s what\u2019s happening today.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--grid-gutter)'
    }
  }, meta.stats.map((s, i) => /*#__PURE__*/React.createElement(StatCard, {
    key: i,
    label: s[0],
    value: s[1],
    unit: s[2],
    delta: s[3],
    dir: s[4]
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-display-sm",
    style: {
      color: 'var(--text-primary)'
    }
  }, nav === 'overview' ? 'Recent projects' : 'All projects'), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    leading: "plus",
    onClick: onNewProject
  }, "New project")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      background: 'var(--bg-surface-raised)'
    }
  }, projects.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 20px',
      borderBottom: i < projects.length - 1 ? '0.5px solid var(--border-default)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-icon)',
      background: 'var(--accent-subtle)',
      color: 'var(--accent-text)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: TOOLS.find(t => t.id === tool).icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 14px var(--font-sans)',
      color: 'var(--text-primary)'
    }
  }, p[0]), /*#__PURE__*/React.createElement("div", {
    className: "ds-body-sm",
    style: {
      color: 'var(--text-tertiary)'
    }
  }, "Updated ", p[3])), /*#__PURE__*/React.createElement(Badge, {
    tone: p[2]
  }, p[1]), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    style: {
      width: 32,
      padding: 0
    },
    onClick: () => onDeleteProject(p[0])
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "more",
    size: 16
  }))))));
}
function SettingsView({
  tool
}) {
  const [notif, setNotif] = React.useState(true);
  const [weekly, setWeekly] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      width: '100%',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-display-md",
    style: {
      color: 'var(--text-primary)'
    }
  }, "Settings"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      background: 'var(--bg-surface-raised)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-display-sm"
  }, "Profile")), /*#__PURE__*/React.createElement("div", {
    className: "card__body",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: "xl",
    initials: "AM"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "Change photo"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    defaultValue: "Alex Morgan"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    leading: "mail",
    defaultValue: "alex@omnyvora.io"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      background: 'var(--bg-surface-raised)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card__header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-display-sm"
  }, "Notifications")), /*#__PURE__*/React.createElement("div", {
    className: "card__body",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }
  }, /*#__PURE__*/React.createElement(Row, {
    title: "Push notifications",
    desc: "Get notified about activity in your workspace.",
    el: /*#__PURE__*/React.createElement(Switch, {
      checked: notif,
      onChange: setNotif
    }),
    border: true
  }), /*#__PURE__*/React.createElement(Row, {
    title: "Weekly digest",
    desc: "A Monday summary of everything that changed.",
    el: /*#__PURE__*/React.createElement(Switch, {
      checked: weekly,
      onChange: setWeekly
    })
  }))));
}
function Row({
  title,
  desc,
  el,
  border
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '14px 0',
      borderBottom: border ? '0.5px solid var(--border-default)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 14px var(--font-sans)',
      color: 'var(--text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "ds-body-sm",
    style: {
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, desc)), el);
}
function NewProjectModal({
  tool,
  onClose,
  onCreate
}) {
  const [name, setName] = React.useState('');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 70,
      background: 'rgba(17,17,17,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'omFade .18s ease'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    onClick: e => e.stopPropagation(),
    style: {
      width: 420,
      background: 'var(--bg-overlay)',
      borderRadius: 'var(--radius-modal)',
      boxShadow: 'var(--shadow-3)',
      animation: 'omPop .18s cubic-bezier(.16,1,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 20px',
      borderBottom: '0.5px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-display-sm"
  }, "New ", TOOL_META[tool].label.toLowerCase(), " project"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    style: {
      width: 32,
      padding: 0
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Project name",
    placeholder: "Untitled project",
    autoFocus: true,
    value: name,
    onChange: e => setName(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: '16px 20px',
      borderTop: '0.5px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm",
    onClick: () => onCreate(name || 'Untitled project')
  }, "Create project"))));
}
Object.assign(window, {
  Dashboard,
  NewProjectModal,
  TOOL_META
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/omnyvora-app/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/omnyvora-app/icons.jsx
try { (() => {
/* Omnyvora UI Kit — Icon component (Lucide paths, substitution flagged in README) */
const ICONS = {
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
  up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  down: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  logout: '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.84z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
};
function Icon({
  name,
  size = 16,
  stroke = 2,
  style,
  className
}) {
  return React.createElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    style,
    dangerouslySetInnerHTML: {
      __html: ICONS[name] || ''
    }
  });
}
Object.assign(window, {
  Icon,
  ICONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/omnyvora-app/icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/omnyvora-app/ui.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Omnyvora UI Kit — React primitives that render the design-system classes */

function Button({
  variant = 'primary',
  size = 'md',
  leading,
  trailing,
  children,
  className = '',
  ...rest
}) {
  const cls = ['btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, rest), leading && /*#__PURE__*/React.createElement(Icon, {
    name: leading,
    size: size === 'sm' ? 15 : 16
  }), children, trailing && /*#__PURE__*/React.createElement(Icon, {
    name: trailing,
    size: size === 'sm' ? 15 : 16
  }));
}
function Field({
  label,
  error,
  leading,
  trailing,
  type = 'text',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "input-wrap"
  }, leading && /*#__PURE__*/React.createElement("span", {
    className: "input-icon input-icon--lead"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: leading,
    size: 16
  })), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    className: ['input', leading && 'input--has-lead', trailing && 'input--has-trail', error && 'input--error', className].filter(Boolean).join(' ')
  }, rest)), trailing && /*#__PURE__*/React.createElement("span", {
    className: "input-icon input-icon--trail"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: trailing,
    size: 16
  }))), error && /*#__PURE__*/React.createElement("div", {
    className: "field-error"
  }, error));
}
function Badge({
  tone = 'neutral',
  size,
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: ['badge', `badge--${tone}`, size === 'md' && 'badge--md'].filter(Boolean).join(' ')
  }, children);
}
function Avatar({
  size = 'md',
  src,
  initials
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `avatar avatar--${size}`
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: ""
  }) : initials);
}
function Switch({
  checked,
  onChange
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "switch"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    onChange: e => onChange && onChange(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", {
    className: "track"
  }), /*#__PURE__*/React.createElement("span", {
    className: "thumb"
  }));
}
function StatCard({
  label,
  value,
  unit,
  delta,
  dir
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "stat__value"
  }, value, unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      color: 'var(--text-tertiary)'
    }
  }, unit)), delta && /*#__PURE__*/React.createElement("div", {
    className: `stat__delta ${dir === 'up' ? 'stat__delta--up' : dir === 'down' ? 'stat__delta--down' : ''}`,
    style: !dir ? {
      color: 'var(--text-tertiary)'
    } : undefined
  }, dir && /*#__PURE__*/React.createElement(Icon, {
    name: dir,
    size: 13
  }), delta));
}

/* Toast renderer driven by an array of {id,tone,title,msg} */
function ToastStack({
  toasts,
  dismiss
}) {
  const iconFor = {
    success: 'checkCircle',
    error: 'x',
    warning: 'bell',
    info: 'bell'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 20,
      bottom: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      zIndex: 60
    }
  }, toasts.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: `toast toast--${t.tone}`,
    style: {
      animation: 'omToastIn .3s cubic-bezier(.16,1,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "toast__icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: iconFor[t.tone] || 'bell',
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "toast__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "toast__title"
  }, t.title), t.msg && /*#__PURE__*/React.createElement("div", {
    className: "toast__msg"
  }, t.msg)), /*#__PURE__*/React.createElement("button", {
    className: "toast__close",
    onClick: () => dismiss(t.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  })))));
}
Object.assign(window, {
  Button,
  Field,
  Badge,
  Avatar,
  Switch,
  StatCard,
  ToastStack
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/omnyvora-app/ui.jsx", error: String((e && e.message) || e) }); }

})();
