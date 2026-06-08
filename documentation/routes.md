# Omnyvora Frontend — Route Reference

All routes are defined using the **Next.js App Router** under `src/app/`.
Routes are split into two layout groups: `(public)` (no authentication) and `(workspace)` (requires authentication).

---

## How to search this document

Use your editor's find (`Ctrl+F` / `Cmd+F`) or GitHub's in-page search to jump to any route or keyword.
Every route has its own heading anchor — e.g. `#dashboard` — usable as a deep link.

---

## Table of Contents

### Public Routes
- [/ — Landing page](#-landing-page)
- [/login](#login)
- [/register](#register)
- [/forgot-password](#forgot-password)
- [/reset-password](#reset-password)

### Workspace Routes
- [/dashboard](#dashboard)
- [/applications](#applications)
- [/profile](#profile)
- [/account](#account)
- [/cv-builder](#cv-builder)
- [/portfolio](#portfolio)
- [/image-enhancer](#image-enhancer)

### API Routes
- [/api/auth/logout](#apiauthlogout)

---

## Layout Groups

### `(public)` — No authentication required
- **Layout file:** `src/app/(public)/layout.tsx`
- **Auth guard:** `GuestGuard` — redirects already-authenticated users to `/dashboard`
- **Rendering:** Static or server-rendered (SSG/SSR) — suitable for SEO
- **Includes:** `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`

### `(workspace)` — Authentication required
- **Layout file:** `src/app/(workspace)/layout.tsx`
- **Auth guard:** `AuthGuard` — redirects unauthenticated users to `/login`
- **Rendering:** `force-dynamic` — rendered on demand, never cached
- **Shell:** Sidebar + `NotificationsDrawer` mounted at layout level
- **Includes:** All `/dashboard`, `/applications`, `/profile`, `/account`, and tool routes

---

## Public Routes

### `/` — Landing page

| Property | Value |
|---|---|
| File | `src/app/(public)/page.tsx` |
| Auth | None |
| Guard | `GuestGuard` (via layout) |
| Rendering | Static |

The public-facing landing page of the Omnyvora platform. Entry point for unauthenticated visitors. Directs users to sign up or log in.

---

### `/login`

| Property | Value |
|---|---|
| File | `src/app/(public)/login/page.tsx` |
| Page component | `src/features/auth/pages/LoginPage.tsx` |
| Auth | None |
| Guard | `GuestGuard` — redirects to `/dashboard` if already logged in |
| Data hooks | `useLogin()` from `features/auth/hooks.ts` |
| Backend endpoint | `POST /v1/auth/login/` |

Renders the email + password login form. On success, stores the JWT access token in memory and the refresh token in a cookie, then navigates the user to `/dashboard`.

---

### `/register`

| Property | Value |
|---|---|
| File | `src/app/(public)/register/page.tsx` |
| Page component | `src/features/auth/pages/RegisterPage.tsx` |
| Auth | None |
| Guard | `GuestGuard` — redirects to `/dashboard` if already logged in |
| Data hooks | `useRequestOtp()`, `useRegister()` from `features/auth/hooks.ts` |
| Backend endpoints | `POST /v1/otp/get-otp/`, `POST /v1/auth/register/` |

Two-step registration flow:
1. User enters email → OTP is dispatched to that email address.
2. User fills in full name, password, and the received OTP → account is created and the user is logged in automatically.

---

### `/forgot-password`

| Property | Value |
|---|---|
| File | `src/app/(public)/forgot-password/page.tsx` |
| Page component | `src/features/auth/pages/ForgotPasswordPage.tsx` |
| Auth | None |
| Data hooks | `useRequestOtp()` from `features/auth/hooks.ts` |
| Backend endpoint | `POST /v1/otp/get-otp/` |

Step 1 of the password reset flow. User enters their email address to receive a one-time password. On success, redirects to `/reset-password`.

---

### `/reset-password`

| Property | Value |
|---|---|
| File | `src/app/(public)/reset-password/page.tsx` |
| Page component | `src/features/auth/pages/ResetPasswordPage.tsx` |
| Auth | None |
| Data hooks | `useResetPassword()` from `features/auth/hooks.ts` |
| Backend endpoint | `POST /v1/auth/password/reset/` |

Step 2 of the password reset flow. User enters the OTP received by email, their email address, and a new password. On success, redirects to `/login`.

---

## Workspace Routes

All workspace routes share the layout defined in `src/app/(workspace)/layout.tsx`. This layout:
- Wraps all children in `AuthGuard`
- Renders the collapsible `Sidebar` (256 px expanded / 76 px collapsed)
- Mounts the `NotificationsDrawer` (slides in from the right)

---

### `/dashboard`

| Property | Value |
|---|---|
| File | `src/app/(workspace)/dashboard/page.tsx` |
| Page component | `src/features/dashboard/pages/DashboardPage.tsx` |
| Loading UI | `src/app/(workspace)/dashboard/loading.tsx` |
| Error UI | `src/app/(workspace)/dashboard/error.tsx` |
| Auth | Required |
| Data hooks | `useDashboardServices()`, `useDashboardNotifications()`, `useDashboardUnreadCount()` from `features/dashboard/hooks.ts` |
| Backend endpoints | `GET /v1/catalog/services/`, `GET /v1/notifications/`, `GET /v1/notifications/unread-count/` |

The user's home screen after login. Displays:
- A personalised welcome banner with today's date.
- Three stat cards: total available applications, unread notification count, and profile completion percentage.
- A grid of all available platform services (links to each tool).
- A panel showing the four most recent notifications.

---

### `/applications`

| Property | Value |
|---|---|
| File | `src/app/(workspace)/applications/page.tsx` |
| Page component | `src/features/catalog/pages/ApplicationsPage.tsx` |
| Loading UI | `src/app/(workspace)/applications/loading.tsx` |
| Auth | Required |
| Data hooks | `usePlatformServices()` from `features/catalog/hooks.ts` |
| Backend endpoint | `GET /v1/catalog/services/` |

Full catalog of all active platform services. Features:
- Category filter chips derived dynamically from the service data returned by the backend.
- A three-column grid of `AppCard` components, each showing the service icon, name, description, category badge, and an "Open app" button.
- Selecting a category filters the list client-side (no additional network request).

---

### `/profile`

| Property | Value |
|---|---|
| File | `src/app/(workspace)/profile/page.tsx` |
| Page component | `src/features/profile/pages/ProfilePage.tsx` |
| Loading UI | `src/app/(workspace)/profile/loading.tsx` |
| Auth | Required |
| Data hooks | `useMyProfile()`, `useUpdateProfile()` from `features/profile/hooks.ts` |
| Backend endpoints | `GET /v1/profiles/me/`, `PATCH /v1/profiles/me/` |

Two-panel profile management page with a vertical sub-navigation:

**Public profile** — Edit first name, last name, phone, date of birth, and bio. Changes are persisted via `PATCH /v1/profiles/me/`. The bio note explains it is shared across all Omnyvora services.

**Identity** — Tabbed panel for Projects, Education, Experience, and Skills. Placeholder content — individual CRUD flows for each section are pending.

---

### `/account`

| Property | Value |
|---|---|
| File | `src/app/(workspace)/account/page.tsx` |
| Page component | `src/features/account/pages/AccountPage.tsx` |
| Loading UI | `src/app/(workspace)/account/loading.tsx` |
| Auth | Required |
| Data hooks | `useChangePassword()` from `features/auth/hooks.ts` |
| Backend endpoint | `POST /v1/auth/password/change/` |

Three-panel account settings page with a vertical sub-navigation:

**General** — Read-only display of email address, account creation date, and account status badge. Email cannot be changed through this UI — users are directed to support.

**Security** — Password change form (current password, new password, confirm). Validates client-side with Zod before submitting to the backend.

**Danger zone** — Deactivate account (warning confirmation modal) and Delete account (danger confirmation modal requiring the user to type "DELETE"). These actions currently show confirmation modals; the actual deactivation/deletion API calls are pending backend implementation.

---

### `/cv-builder`

| Property | Value |
|---|---|
| File | `src/app/(workspace)/cv-builder/page.tsx` |
| Layout | `src/app/(workspace)/cv-builder/layout.tsx` |
| Loading UI | `src/app/(workspace)/cv-builder/loading.tsx` |
| Error UI | `src/app/(workspace)/cv-builder/error.tsx` |
| Auth | Required |
| Status | **Stub — not yet implemented** |
| Design token | `data-service="cv-builder"` → blue accent (`#2563EB`) |

The CV Builder tool. The layout wrapper applies the `cv-builder` service theme token, switching the accent colour to blue across all workspace UI within this route.

---

### `/portfolio`

| Property | Value |
|---|---|
| File | `src/app/(workspace)/portfolio/page.tsx` |
| Layout | `src/app/(workspace)/portfolio/layout.tsx` |
| Loading UI | `src/app/(workspace)/portfolio/loading.tsx` |
| Error UI | `src/app/(workspace)/portfolio/error.tsx` |
| Auth | Required |
| Status | **Stub — not yet implemented** |
| Design token | `data-service="portfolio"` → purple accent (`#534AB7`) |

The Portfolio tool. The layout wrapper applies the `portfolio` service theme.

---

### `/image-enhancer`

| Property | Value |
|---|---|
| File | `src/app/(workspace)/image-enhancer/page.tsx` |
| Layout | `src/app/(workspace)/image-enhancer/layout.tsx` |
| Loading UI | `src/app/(workspace)/image-enhancer/loading.tsx` |
| Error UI | `src/app/(workspace)/image-enhancer/error.tsx` |
| Auth | Required |
| Status | **Stub — not yet implemented** |
| Design token | `data-service="image-enhancer"` → teal accent (`#0D9488`) |

The Image Enhancer tool. The layout wrapper applies the `image-enhancer` service theme.

---

## API Routes

### `/api/auth/logout`

| Property | Value |
|---|---|
| File | `src/app/api/auth/logout/route.ts` |
| Method | `POST` |
| Auth | None (server-side handler) |
| Purpose | Internal route used to clear the HTTP-only refresh token cookie on logout |

This is a Next.js Route Handler, not a page. It is called internally during the logout flow managed by the Axios interceptor in `src/core/api/axios.ts`. Clears the `refresh_token` cookie set during login and proxies the blacklist request to the Django backend.

---

## Shared Infrastructure

### AuthGuard (`src/shared/auth/guards/AuthGuard.tsx`)

Reads the current user from `AuthContext`. If `isLoading` is true, renders a full-screen skeleton. If unauthenticated after loading, redirects to `/login`. Otherwise, renders children.

### GuestGuard (`src/shared/auth/guards/GuestGuard.tsx`)

The inverse of `AuthGuard`. If the user is already authenticated, redirects to `/dashboard`. Otherwise renders children. Used in all `(public)` auth pages to prevent logged-in users from seeing login/register screens.

### Sidebar (`src/shared/workspace/components/Sidebar.tsx`)

Persistent navigation component rendered in the `(workspace)` layout. Supports collapse state (persisted to `localStorage` via Zustand). Active route is determined by `usePathname()`. Notification badge reads from the `useUnreadCount()` hook. Logout button calls `useLogout()` from `features/auth/hooks.ts`.

### NotificationsDrawer (`src/shared/notifications/NotificationsDrawer.tsx`)

A fixed right-side panel (408 px) that slides in over the workspace. Open/close state is managed by `useNotificationsDrawer` Zustand store. Opened by clicking the bell icon in the Sidebar. Renders the full notification list fetched via `useNotifications()`.
