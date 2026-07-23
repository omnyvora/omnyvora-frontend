# Graph Report - .  (2026-07-22)

## Corpus Check
- 306 files · ~190,015 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1232 nodes · 2172 edges · 160 communities (100 shown, 60 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 257 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Design Prototype Bundle (Auth + Dashboard JSX)
- Design Canvas Parser & Support Utilities
- package.json Manifest
- Workspace Tool Pages & Design System Docs
- Profile Page & Avatar Upload
- UI Primitives (cn, Avatar, Badge)
- Auth API Layer
- tsconfig.json
- Admin API Layer
- Account Settings Prototype (JSX)
- Dashboard Page & Hooks
- OTP & Password Reset Components
- Auth Pages (Forgot/Register/Reset Password)
- Workspace Layout & Auth Guards
- Admin Services & Settings Pages
- Admin Dashboard Page & Widgets
- Applications / Catalog Feature
- Design System Previews (Buttons, Badges, Cards, Colors)
- Axios Core & Token Refresh
- Design System Tokens (Motion, Radius, Sidebar, Skeleton)
- Backend Route Documentation & Endpoints
- Auth Hooks & Services
- Auth UI Prototype Components
- Admin User List UI
- shadcn/ui Config (components.json)
- Login Page & Guest Guard
- Account Settings Page
- Radix UI Dependencies
- Admin Logs Page
- Notifications Drawer & API
- Design Tweaks Panel Prototype
- Admin Users Page & Detail Panel
- Activity Feature Hooks
- Service Registry & Dashboard Hooks
- Activity Page & Item Component
- Email Change Modal
- Design Canvas Prototype (Auth Design)
- Workspace Tool Layouts & Theme Provider
- Admin Settings Hooks
- Notification Item Component
- Auth Screens Prototype (Login/Register/OTP)
- Workspace App UI Primitives Prototype
- Per-Service Design Tokens
- Form & Label UI Primitives
- Public Layout & Landing Page
- Card UI Primitive
- Root Layout & Providers
- Admin Growth Chart
- Admin Log Row Component
- Workspace App Card Component
- Workspace Design Mock Data
- Toast / Sonner UI Primitive
- Docker & pnpm Workspace Config
- React-DOM Dependency & Design Canvas Overlay
- browser-image-compression Dependency
- class-variance-authority Dependency
- clsx Dependency
- eslint.config.mjs
- @hookform/resolvers Dependency
- lucide-react Dependency
- next Dependency
- next.config.ts
- next-themes Dependency
- @radix-ui/react-dialog Dependency
- @radix-ui/react-slot Dependency
- @radix-ui/react-tooltip Dependency
- react-hook-form Dependency
- tailwind-merge Dependency
- @tanstack/react-query Dependency
- @tanstack/react-query-devtools Dependency
- zustand Dependency
- postcss.config.mjs
- tailwind.config.ts
- Public Icon Asset (file.svg)
- Public Icon Asset (globe.svg)
- Public Logo Asset (logo-mark-black.png)
- Public Icon Asset (Next.js Logo)
- Public Icon Asset (Vercel Logo)
- Public Icon Asset (window.svg)
- Profile Update Request Schema
- Super Admin Workspace Logo Asset
- Admin Dashboard Collapsed Sidebar Screenshot
- Admin Dashboard Collapsed Sidebar (Variant 2)
- Sidebar Nav Screenshot (Menu Items)
- Sidebar Nav Icon Rail Design Reference
- User Dashboard Home Screenshot
- Auth Design Logo Asset
- User Workspace Logo Asset (Black)
- User Workspace Logo Asset (White)
- Applications Directory Screen Design
- Profile - Public Profile Settings Screen
- Profile - Projects Tab Screen
- Account Settings - General Tab Screen
- Account Settings - Change Password Screen
- Account Settings - Danger Zone Screen
- Dashboard Screen Design (Workspace Home)
- Profile Settings Drawer Screen
- OmnyVora Logo (Dark Mode Original)
- OmnyVora Logo (Light Mode Original)
- Design System Logo Asset (Black)
- Design System Logo Asset (White)
- Portfolio Tool Dashboard Screen (Dark)
- Photo Tool Dashboard Screen (Dark, Variant 2)
- Photo Tool Dashboard Screen (Dark, Overview)
- Design System Dashboard Screen (Portfolio)
- Logo Legibility Check - Dark Mode
- Logo Legibility Check - Light Mode
- Logo Legibility Check - Dark Mode (Variant 2)
- Uploaded Dark Theme Logo Asset
- Uploaded Black Theme Logo Asset
- Uploaded Light Theme Logo Asset
- Uploaded Transparent Logo Asset

## God Nodes (most connected - your core abstractions)
1. `react` - 95 edges
2. `isApiSuccess()` - 38 edges
3. `cn()` - 23 edges
4. `useAuth()` - 21 edges
5. `ImageSlot` - 20 edges
6. `compilerOptions` - 18 edges
7. `Backend Project Context (CONTEXT.md)` - 18 edges
8. `colors_and_type.css — design tokens (color + typography variables)` - 17 edges
9. `Semantic Color Tokens — Light Theme` - 15 edges
10. `Omnyvora Design System README (canonical)` - 14 edges

## Surprising Connections (you probably didn't know these)
- `useRequestOtp()` --references--> `POST /v1/otp/get-otp/`  [EXTRACTED]
  src/features/auth/hooks.ts → documentation/routes.md
- `useRegister()` --references--> `POST /v1/auth/register/`  [EXTRACTED]
  src/features/auth/hooks.ts → documentation/routes.md
- `useLogin()` --references--> `POST /v1/auth/login/`  [EXTRACTED]
  src/features/auth/hooks.ts → documentation/routes.md
- `useResetPassword()` --references--> `POST /v1/auth/password/reset/`  [EXTRACTED]
  src/features/auth/hooks.ts → documentation/routes.md
- `useChangePassword()` --references--> `POST /v1/auth/password/change/`  [EXTRACTED]
  src/features/auth/hooks.ts → documentation/routes.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Frontend Local Dev Environment Setup (pnpm + Docker + README)** — readme, docker_compose_local, pnpm_workspace [EXTRACTED 1.00]
- **Auth / OTP Flow Aligned Across Route Docs, Design Prototype, and Backend Context** — documentation_routes, ui_ux_omny_vora_auth_design_auth_frames, ui_ux_omnyvora_design_system_uploads_context [INFERRED 0.85]
- **Two-Token Tool Theming Pattern (accent-primary + accent-subtle across Portfolio/Photo/Productivity)** — concept_two_token_theming, concept_tool_portfolio, concept_tool_photo, concept_tool_productivity, ui_ux_omnyvora_design_system_readme [EXTRACTED 1.00]
- **Button component variant/size/dark-theme preview set implementing the same btn classes** — ui_ux_omnyvora_design_system_preview_btn_dark_button_dark_mode, ui_ux_omnyvora_design_system_preview_btn_sizes_button_sizes_states, ui_ux_omnyvora_design_system_preview_btn_variants_button_variants [INFERRED 0.85]
- **Design system color token previews (accents, gray primitives, status colors) share the same token system** — ui_ux_omnyvora_design_system_preview_colors_accents_accent_families, ui_ux_omnyvora_design_system_preview_colors_gray_gray_primitives, ui_ux_omnyvora_design_system_preview_colors_status_status_colors [INFERRED 0.80]
- **Multi-tool dark-mode accent theming pattern: shared components re-skin per-tool accent (photo, productivity) using the accent family tokens** — ui_ux_omnyvora_design_system_preview_colors_accents_accent_families, ui_ux_omnyvora_design_system_preview_btn_dark_button_dark_mode, ui_ux_omnyvora_design_system_preview_controls_dark_controls_dark_mode [INFERRED 0.75]
- **Spacing-group layout tokens (motion, radius, spacing scale)** — ui_ux_omnyvora_design_system_preview_motion_motion_duration_easing, ui_ux_omnyvora_design_system_preview_radius_border_radius_scale, ui_ux_omnyvora_design_system_preview_spacing_scale_spacing_scale [EXTRACTED 1.00]
- **Theming & semantic color token mechanism (light/dark tokens driving per-tool theme swap)** — ui_ux_omnyvora_design_system_preview_semantic_light_semantic_tokens_light, ui_ux_omnyvora_design_system_preview_semantic_dark_semantic_tokens_dark, ui_ux_omnyvora_design_system_preview_theming_per_tool_theming [INFERRED 0.85]
- **Typography scale preview group (display / body / labels)** — ui_ux_omnyvora_design_system_preview_type_display_display_type_scale, ui_ux_omnyvora_design_system_preview_type_body_body_type_scale, ui_ux_omnyvora_design_system_preview_type_labels_label_caption_code_scale [EXTRACTED 1.00]

## Communities (160 total, 60 thin omitted)

### Community 0 - "Design Prototype Bundle (Auth + Dashboard JSX)"
Cohesion: 0.05
Nodes (86): react, react, useFormField(), AuthScreen(), Avatar(), Badge(), Button(), Dashboard() (+78 more)

### Community 1 - "Design Canvas Parser & Support Utilities"
Cohesion: 0.05
Nodes (48): boot(), collectProps(), compileAttr(), compileTemplate(), createComponentFactory(), createExternalModules(), createHelmetManager(), createPseudoSheet() (+40 more)

### Community 2 - "package.json Manifest"
Cohesion: 0.05
Nodes (41): eslint, eslint-config-next, jsdom, devDependencies, eslint, eslint-config-next, jsdom, tailwindcss (+33 more)

### Community 3 - "Workspace Tool Pages & Design System Docs"
Cohesion: 0.07
Nodes (29): Admin Console Domain (admin.console), Avatar Component (sm/md/lg/xl, initials + image), Isometric Cube Cluster Logo Mark, Lucide Icon Set (Flagged Substitution), Photo / Image Enhancer Tool (Teal Accent #0D9488), Portfolio Tool (Purple Accent #534AB7), Productivity / CV Builder Tool (Blue Accent #2563EB), Two-Token Tool Theming (accent-primary + accent-subtle) (+21 more)

### Community 4 - "Profile Page & Avatar Upload"
Cohesion: 0.11
Nodes (26): GET/PATCH /v1/profiles/me/, AVATAR_COMPRESSION_CONFIG, compressImage(), fetchMyProfile(), PROFILES_URL, updateMyProfile(), uploadAvatar(), PROFILE_QUERY_KEY (+18 more)

### Community 5 - "UI Primitives (cn, Avatar, Badge)"
Cohesion: 0.09
Nodes (25): cn(), Avatar, AvatarFallback, AvatarImage, Badge(), BadgeProps, badgeVariants, DialogContent (+17 more)

### Community 6 - "Auth API Layer"
Cohesion: 0.08
Nodes (29): AUTH_URL, OTP_URL, requestOtp(), GetOtpRequest, GetOtpRequestSchema, LoginRequest, LoginRequestSchema, LoginResponse (+21 more)

### Community 7 - "tsconfig.json"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 8 - "Admin API Layer"
Cohesion: 0.08
Nodes (27): ADMIN_URL, CATALOG_URL, LOGS_URL, toggleServiceActive(), AdminDashboardSummary, AdminDashboardSummarySchema, AdminGrowthPointSchema, AdminRecentRegistrationSchema (+19 more)

### Community 9 - "Account Settings Prototype (JSX)"
Cohesion: 0.07
Nodes (11): Account(), AccountGeneral(), AccountSecurity(), fmtDate(), App(), TWEAK_DEFAULTS, Applications(), ConfirmModal() (+3 more)

### Community 10 - "Dashboard Page & Hooks"
Cohesion: 0.10
Nodes (17): GET /v1/catalog/services/, GET /v1/notifications/, useDashboardActivity(), useDashboardNotifications(), useDashboardProfile(), useDashboardServices(), AppsAlertsCardProps, DashboardPage() (+9 more)

### Community 11 - "OTP & Password Reset Components"
Cohesion: 0.18
Nodes (18): OtpInput(), OtpInputProps, STEP_LABELS, STRENGTH_META, STRENGTH_META, AUTH_ROUTES, OTP_CHANNEL, OTP_PURPOSE (+10 more)

### Community 12 - "Auth Pages (Forgot/Register/Reset Password)"
Cohesion: 0.10
Nodes (16): PasswordResetForm(), scorePassword(), useCountdown(), RegisterForm(), scorePassword(), useCountdown(), useRequestOtp(), ForgotPasswordPage() (+8 more)

### Community 13 - "Workspace Layout & Auth Guards"
Cohesion: 0.18
Nodes (14): useLogout(), useAuth(), AuthGuard(), SuperAdminGuard(), NotificationsDrawerStore, useNotificationsDrawer, AdminSidebar(), getInitials() (+6 more)

### Community 14 - "Admin Services & Settings Pages"
Cohesion: 0.13
Nodes (15): fetchAdminServices(), ServiceAdminCard(), ServiceAdminCardProps, SettingsRow(), SettingsRowProps, SettingsTabPanel(), SettingsTabPanelProps, useAdminServices() (+7 more)

### Community 15 - "Admin Dashboard Page & Widgets"
Cohesion: 0.11
Nodes (16): AlertCard(), AlertCardProps, ServiceUsageBars(), AdminDashboardPage(), fmtDate(), EmptyStateProps, Page(), PageHeadProps (+8 more)

### Community 16 - "Applications / Catalog Feature"
Cohesion: 0.17
Nodes (12): CATALOG_URL, fetchServices(), CATALOG_QUERY_KEY, usePlatformServices(), ApplicationsPage(), toServicesUI(), toServiceUI(), uniqueCategories() (+4 more)

### Community 17 - "Design System Previews (Buttons, Badges, Cards, Colors)"
Cohesion: 0.19
Nodes (22): logo-darkmode-original.png asset, logo-mark-black.png asset, logo-mark-white.png asset, colors_and_type.css — design tokens (color + typography variables), components.css — shared component styles (btn, badge, card, input, menu, etc.), Badge / pill component (6 tones, sm+md), Button — dark mode preview (photo theme), Button — sizes & states preview (sm/md/lg, hover, disabled) (+14 more)

### Community 18 - "Axios Core & Token Refresh"
Cohesion: 0.14
Nodes (13): apiClient, refreshQueue, refreshTokenStore, tokenStore, ApiError, ApiResponse, ApiSuccess, AUTH_URL (+5 more)

### Community 19 - "Design System Tokens (Motion, Radius, Sidebar, Skeleton)"
Cohesion: 0.13
Nodes (21): Modal Dialog, Motion Duration & Easing Tokens, Border Radius Scale, --radius-modal Token (16px), Semantic Color Tokens — Dark Theme, Semantic Color Tokens — Light Theme, Sidebar Navigation, Skeleton Loader (+13 more)

### Community 20 - "Backend Route Documentation & Endpoints"
Cohesion: 0.11
Nodes (20): POST /v1/auth/login/, POST /v1/auth/register/, POST /v1/otp/get-otp/, POST /v1/auth/password/change/, POST /v1/auth/password/reset/, Backend Project Context (CONTEXT.md), View -> Service -> Selector -> DB Flow, POST /v1/auth/login/ (+12 more)

### Community 21 - "Auth Hooks & Services"
Cohesion: 0.17
Nodes (15): loginUser(), registerUser(), resetPassword(), verifyToken(), defaultRouteFor(), hydrateSession(), useLogin(), useRegister() (+7 more)

### Community 22 - "Auth UI Prototype Components"
Cohesion: 0.10
Nodes (4): GoogleG(), OtpInput(), PasswordField(), STRENGTH

### Community 23 - "Admin User List UI"
Cohesion: 0.17
Nodes (17): UserListRow(), UserListRowProps, AdminDashboardUI, AdminRegistrationUI, AdminUserActivityUI, AdminUserListItemUI, formatLabel(), initialsOf() (+9 more)

### Community 24 - "shadcn/ui Config (components.json)"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 25 - "Login Page & Guest Guard"
Cohesion: 0.20
Nodes (10): safeRedirectPath(), AuthHeader(), AuthLayout(), AuthLayoutProps, FooterLink(), GoogleButton(), OrDivider(), LoginForm() (+2 more)

### Community 26 - "Account Settings Page"
Cohesion: 0.15
Nodes (12): AccountGeneral(), AccountPage(), AccountSecurity(), SUB_NAV, changePassword(), PasswordChangeForm(), useChangePassword(), PasswordChangeFormSchema (+4 more)

### Community 27 - "Radix UI Dependencies"
Cohesion: 0.13
Nodes (15): axios, browser-image-compression, dependencies, axios, browser-image-compression, @radix-ui/react-avatar, @radix-ui/react-label, @radix-ui/react-separator (+7 more)

### Community 28 - "Admin Logs Page"
Cohesion: 0.23
Nodes (10): fetchLogs(), LogFilterBar(), LogFilterBarProps, useAdminLogs(), AdminLogsPage(), AdminStore, useAdminStore, LOG_LEVELS (+2 more)

### Community 29 - "Notifications Drawer & API"
Cohesion: 0.29
Nodes (12): isApiSuccess(), fetchNotifications(), fetchUnreadCount(), markAllRead(), markOneRead(), NOTIFICATIONS_QUERY_KEY, UNREAD_COUNT_QUERY_KEY, useMarkAllRead() (+4 more)

### Community 30 - "Design Tweaks Panel Prototype"
Cohesion: 0.14
Nodes (6): TweakColor(), TweakNumber(), TweakRadio(), TweaksPanel(), __twkIsLight(), useTweaks()

### Community 31 - "Admin Users Page & Detail Panel"
Cohesion: 0.22
Nodes (8): fetchAdminUserDetail(), fetchAdminUsers(), fmtDate(), UserDetailPanel(), useAdminUserDetail(), useAdminUsers(), AdminUsersPage(), AdminUserDetailUI

### Community 32 - "Activity Feature Hooks"
Cohesion: 0.22
Nodes (10): fetchActivity(), ACTIVITY_QUERY_KEY, useRecentActivity(), ActivityItemUI, toActivityItemUI(), toActivityListUI(), UserActivity, UserActivityPage (+2 more)

### Community 33 - "Service Registry & Dashboard Hooks"
Cohesion: 0.18
Nodes (10): GET /v1/notifications/unread-count/, resolveServiceUrl(), serviceEntries, ServiceName, serviceRegistry, ACTIVITY_URL, CATALOG_URL, PROFILES_URL (+2 more)

### Community 34 - "Activity Page & Item Component"
Cohesion: 0.21
Nodes (8): ActivityPage(), ACTION_STYLE, ActivityCardItem, ActivityItem(), ActivityItemProps, DEFAULT_STYLE, formatRelativeTime(), PageHead()

### Community 35 - "Email Change Modal"
Cohesion: 0.30
Nodes (9): changeEmail(), requestEmailChangeOtp(), ChangeEmailModal(), Props, useCountdown(), useChangeEmail(), useRequestEmailChangeOtp(), ChangeEmailSchema (+1 more)

### Community 36 - "Design Canvas Prototype (Auth Design)"
Cohesion: 0.21
Nodes (8): DC, DCArtboardFrame(), DCCtx, dcExport(), dcFlatten(), DCSection(), DCViewport(), DesignCanvas()

### Community 37 - "Workspace Tool Layouts & Theme Provider"
Cohesion: 0.27
Nodes (3): Props, ServiceName, ServiceThemeProvider()

### Community 38 - "Admin Settings Hooks"
Cohesion: 0.31
Nodes (9): fetchAdminDashboard(), fetchAdminSettings(), updateAdminSettings(), ADMIN_SERVICES_QUERY_KEY, ADMIN_SETTINGS_QUERY_KEY, useAdminDashboard(), useAdminSettings(), useUpdateAdminSettings() (+1 more)

### Community 39 - "Notification Item Component"
Cohesion: 0.27
Nodes (8): formatTime(), NotifItem(), NotifItemProps, Notification, NotificationPage, NotificationPageSchema, NotificationSchema, UnreadCountSchema

### Community 42 - "Per-Service Design Tokens"
Cohesion: 0.33
Nodes (4): GlobalTokens, cvBuilderTokens, imageEnhancerTokens, portfolioTokens

### Community 43 - "Form & Label UI Primitives"
Cohesion: 0.25
Nodes (7): FormDescription, FormFieldContext, FormFieldContextValue, FormItemContext, FormItemContextValue, Label, labelVariants

### Community 45 - "Public Layout & Landing Page"
Cohesion: 0.29
Nodes (3): Next.js App Router, Frontend Route Reference, Frontend README (Next.js Bootstrap)

### Community 46 - "Card UI Primitive"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 48 - "Root Layout & Providers"
Cohesion: 0.40
Nodes (3): metadata, Providers(), AuthProvider()

### Community 49 - "Admin Growth Chart"
Cohesion: 0.53
Nodes (5): buildPaths(), formatAxisDate(), GrowthChart(), GrowthChartProps, AdminGrowthPointUI

### Community 50 - "Admin Log Row Component"
Cohesion: 0.47
Nodes (5): formatTimestamp(), LEVEL_BADGE, LogRow(), LogRowProps, LogRowUI

### Community 52 - "Workspace App Card Component"
Cohesion: 0.40
Nodes (3): AppCard(), AppCardProps, AppCardService

### Community 54 - "Workspace Design Mock Data"
Cohesion: 0.40
Nodes (4): APPS, IDENTITY, NOTIFICATIONS, USER

### Community 55 - "Toast / Sonner UI Primitive"
Cohesion: 0.67
Nodes (3): Toaster(), ToasterProps, useDataTheme()

### Community 56 - "Docker & pnpm Workspace Config"
Cohesion: 0.67
Nodes (3): Local Docker Compose Config, Production Docker Compose Config, pnpm Workspace Config (allowBuilds)

### Community 57 - "React-DOM Dependency & Design Canvas Overlay"
Cohesion: 0.67
Nodes (3): react-dom, react-dom, DCFocusOverlay()

## Ambiguous Edges - Review These
- `Label, Caption & Code Type Scale` → `POST /v1/auth/login/ Endpoint (code-sample text)`  [AMBIGUOUS]
  ui_ux/omnyvora_design_system/preview/type-labels.html · relation: references

## Knowledge Gaps
- **314 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+309 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **60 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Label, Caption & Code Type Scale` and `POST /v1/auth/login/ Endpoint (code-sample text)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `react` connect `Design Prototype Bundle (Auth + Dashboard JSX)` to `Design Canvas Parser & Support Utilities`, `Workspace Tool Pages & Design System Docs`, `Design Canvas Prototype (Auth Design)`, `Account Settings Prototype (JSX)`, `Workspace App UI Primitives Prototype`, `Auth UI Prototype Components`, `React-DOM Dependency & Design Canvas Overlay`, `Radix UI Dependencies`, `Design Tweaks Panel Prototype`?**
  _High betweenness centrality (0.293) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Radix UI Dependencies` to `Design Prototype Bundle (Auth + Dashboard JSX)`, `next.config.ts`, `package.json Manifest`, `next-themes Dependency`, `@radix-ui/react-dialog Dependency`, `@radix-ui/react-slot Dependency`, `@radix-ui/react-tooltip Dependency`, `react-hook-form Dependency`, `tailwind-merge Dependency`, `@tanstack/react-query Dependency`, `@tanstack/react-query-devtools Dependency`, `zustand Dependency`, `React-DOM Dependency & Design Canvas Overlay`, `browser-image-compression Dependency`, `class-variance-authority Dependency`, `eslint.config.mjs`, `@hookform/resolvers Dependency`, `lucide-react Dependency`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `createComponentFactory()` connect `Design Canvas Parser & Support Utilities` to `Design Prototype Bundle (Auth + Dashboard JSX)`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _314 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Design Prototype Bundle (Auth + Dashboard JSX)` be split into smaller, more focused modules?**
  _Cohesion score 0.054627911770768915 - nodes in this community are weakly interconnected._
- **Should `Design Canvas Parser & Support Utilities` be split into smaller, more focused modules?**
  _Cohesion score 0.05411392405063291 - nodes in this community are weakly interconnected._