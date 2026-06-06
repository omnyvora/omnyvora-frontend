# Omnyvora App — UI Kit

An interactive, click-through recreation of the **Omnyvora** application shell. It demonstrates
the design system composed into real product screens, and proves the headline promise live:
**switch tool = swap two tokens, nothing else changes.**

## Run it
Open `index.html`. It's plain React + Babel over the system's `colors_and_type.css` +
`components.css` — no build step.

## What's interactive
- **Auth** — login, "create account" → 6-digit OTP flow (mirrors the backend's email-OTP register),
  or **Continue as demo** to jump straight in.
- **Tool switcher** (sidebar) — Portfolio / Photo / Productivity. Watch the accent, active states,
  stat data, and project list re-theme instantly. This is the *only* thing that changes between tools.
- **Theme toggle** (top bar, grid/eye icon) — light ⇄ dark across the whole shell; the logo mark
  swaps black ⇄ white.
- **New project** — opens the modal, creates a project, fires a success toast.
- **Notifications**, **avatar menu** (→ log out), **settings** (profile + notification toggles),
  **starred** (empty state).

## Files
| File | Role |
|------|------|
| `index.html` | App state machine — auth gate, theme/tool/nav state, toast host |
| `icons.jsx` | `<Icon>` — inline Lucide paths (substitution; see root README ▸ Iconography) |
| `ui.jsx` | Primitives: `Button`, `Field`, `Badge`, `Avatar`, `Switch`, `StatCard`, `ToastStack` |
| `AuthScreen.jsx` | Login / register / OTP card |
| `AppShell.jsx` | `Sidebar` (tool + workspace nav) and `TopBar` |
| `Dashboard.jsx` | Overview / projects / starred / settings views + `NewProjectModal` |

## Fidelity notes
- This is a **cosmetic recreation** — no real network, auth, or persistence. The backend
  (`omnyvora/all_in_one`) ships no frontend, so screens are modeled on the design-system spec and
  the API shape in `CONTEXT.md` (auth + OTP, profiles, notifications), not on existing UI code.
- Tool names (Portfolio / Photo / Productivity) and sample content are illustrative, taken from the
  accent examples in the spec. Replace with real product data when it exists.
