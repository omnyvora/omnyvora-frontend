# Graph Report - omnyvora-frontend  (2026-08-20)

## Corpus Check
- 279 files · ~245,336 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1673 nodes · 3452 edges · 179 communities (109 shown, 70 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 324 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `419234c7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Shared Notifications
- Ui Ux Omnivora  Super Sdmin Workspace
- Ui Ux Omny Vora User Workspace Design
- Features User Data
- Features User Data
- Package.json
- Ui Ux Omnyvora Design System
- Features Admin
- Shared Workspace
- Features Admin
- Shared Components
- Features Auth
- Features Profile
- Tsconfig.json
- Core Api
- Features Auth
- Ui Ux Omny Vora User Workspace Design
- Features Auth
- Features User Data
- Ui Ux Omnyvora Design System
- Features Admin
- Features Admin
- Features User Data
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Features Activity
- Ui Ux Omny Vora Auth Design
- Features Admin
- Components.json
- Ui Ux Omnyvora Design System
- Features Auth
- Features User Data
- Shared Auth
- Features Account
- Features User Data
- Features User Data
- Ui Ux Omnivora  Super Sdmin Workspace
- Ui Ux Omny Vora Auth Design
- Ui Ux Omny Vora User Workspace Design
- Package.json
- Features Auth
- Ui Ux Omny Vora User Workspace Design
- Features User Data
- Features User Data
- Features Catalog
- Features Account
- Ui Ux Omny Vora Auth Design
- Features Dashboard
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omny Vora Auth Design
- Ui Ux Omny Vora User Workspace Design
- Features Catalog
- Core Design
- Shared Components
- Ui Ux Omny Vora User Workspace Design
- Pnpm Workspace.yaml
- Ui Ux Omnyvora Design System
- Shared Components
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omny Vora User Workspace Design
- Features Admin
- Shared Workspace
- Shared Components
- Documentation Routes.md
- Documentation Routes.md
- Package.json
- Ui Ux Omny Vora Auth Design
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omnyvora Design System
- Package.json
- Package.json
- Package.json
- Package.json
- Docker Compose.local.yml
- Eslint.config.mjs
- Package.json
- Next.config.ts
- Package.json
- Package.json
- Package.json
- Package.json
- Package.json
- Package.json
- Package.json
- Package.json
- Package.json
- Package.json
- Package.json
- Package.json
- Package.json
- Postcss.config.mjs
- Core Hooks
- Tailwind.config.ts
- Public File.svg
- Public Globe.svg
- Public Logo Mark Black.png
- Public Next.svg
- Public Vercel.svg
- Public Window.svg
- Features Profile
- Ui Ux Omnivora  Super Sdmin Workspace
- Ui Ux Omnivora  Super Sdmin Workspace
- Ui Ux Omnivora  Super Sdmin Workspace
- Ui Ux Omnivora  Super Sdmin Workspace
- Ui Ux Omnivora  Super Sdmin Workspace
- Ui Ux Omnivora  Super Sdmin Workspace
- Ui Ux Omny Vora Auth Design
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omny Vora User Workspace Design
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System
- Ui Ux Omnyvora Design System

## God Nodes (most connected - your core abstractions)
1. `react` - 124 edges
2. `isApiSuccess()` - 86 edges
3. `Omnyvora Workspace HTML Entry Point (design prototype)` - 26 edges
4. `cn()` - 23 edges
5. `useAuth()` - 23 edges
6. `ImageSlot` - 21 edges
7. `compilerOptions` - 18 edges
8. `Backend Project Context (CONTEXT.md)` - 18 edges
9. `colors_and_type.css — design tokens (color + typography variables)` - 17 edges
10. `describeApiError()` - 16 edges

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
- **Identity sub-module page group (Overview/Projects/Experience/Education/Certifications/Skills/Social sharing IdentityShared)** — ui_ux_omny_vora_user_workspace_design_app_identityshared_identityshared, ui_ux_omny_vora_user_workspace_design_app_identityoverview_identityoverview, ui_ux_omny_vora_user_workspace_design_app_identityprojects_identityprojects, ui_ux_omny_vora_user_workspace_design_app_identityexperience_identityexperience, ui_ux_omny_vora_user_workspace_design_app_identityeducation_identityeducation, ui_ux_omny_vora_user_workspace_design_app_identitycertifications_identitycertifications, ui_ux_omny_vora_user_workspace_design_app_identityskills_identityskills, ui_ux_omny_vora_user_workspace_design_app_identitysocial_identitysocial [INFERRED 0.85]
- **In-browser JSX transpilation runtime (React + ReactDOM UMD + @babel/standalone transpiling all app/*.jsx at load time)** — npm_react, npm_react_dom, npm_babel_standalone, ui_ux_omny_vora_user_workspace_design_app_app_app, ui_ux_omny_vora_user_workspace_design_tweaks_panel_tweakspanel [EXTRACTED 0.95]
- **Transitive dependency version-pin overrides (security-sensitive packages forced to minimum patched versions)** — npm_postcss, npm_form_data, npm_undici, npm_brace_expansion, npm_js_yaml, npm_sharp [EXTRACTED 1.00]
- **Frontend Local Dev Environment Setup (pnpm + Docker + README)** — readme, docker_compose_local [EXTRACTED 1.00]
- **Auth / OTP Flow Aligned Across Route Docs, Design Prototype, and Backend Context** — documentation_routes, ui_ux_omny_vora_auth_design_auth_frames, ui_ux_omnyvora_design_system_uploads_context [INFERRED 0.85]
- **Two-Token Tool Theming Pattern (accent-primary + accent-subtle across Portfolio/Photo/Productivity)** — concept_two_token_theming, concept_tool_portfolio, concept_tool_photo, concept_tool_productivity, ui_ux_omnyvora_design_system_readme [EXTRACTED 1.00]
- **Button component variant/size/dark-theme preview set implementing the same btn classes** — ui_ux_omnyvora_design_system_preview_btn_dark_button_dark_mode, ui_ux_omnyvora_design_system_preview_btn_sizes_button_sizes_states, ui_ux_omnyvora_design_system_preview_btn_variants_button_variants [INFERRED 0.85]
- **Design system color token previews (accents, gray primitives, status colors) share the same token system** — ui_ux_omnyvora_design_system_preview_colors_accents_accent_families, ui_ux_omnyvora_design_system_preview_colors_gray_gray_primitives, ui_ux_omnyvora_design_system_preview_colors_status_status_colors [INFERRED 0.80]
- **Multi-tool dark-mode accent theming pattern: shared components re-skin per-tool accent (photo, productivity) using the accent family tokens** — ui_ux_omnyvora_design_system_preview_colors_accents_accent_families, ui_ux_omnyvora_design_system_preview_btn_dark_button_dark_mode, ui_ux_omnyvora_design_system_preview_controls_dark_controls_dark_mode [INFERRED 0.75]
- **Spacing-group layout tokens (motion, radius, spacing scale)** — ui_ux_omnyvora_design_system_preview_motion_motion_duration_easing, ui_ux_omnyvora_design_system_preview_radius_border_radius_scale, ui_ux_omnyvora_design_system_preview_spacing_scale_spacing_scale [EXTRACTED 1.00]
- **Theming & semantic color token mechanism (light/dark tokens driving per-tool theme swap)** — ui_ux_omnyvora_design_system_preview_semantic_light_semantic_tokens_light, ui_ux_omnyvora_design_system_preview_semantic_dark_semantic_tokens_dark, ui_ux_omnyvora_design_system_preview_theming_per_tool_theming [INFERRED 0.85]
- **Typography scale preview group (display / body / labels)** — ui_ux_omnyvora_design_system_preview_type_display_display_type_scale, ui_ux_omnyvora_design_system_preview_type_body_body_type_scale, ui_ux_omnyvora_design_system_preview_type_labels_label_caption_code_scale [EXTRACTED 1.00]

## Communities (179 total, 70 thin omitted)

### Community 0 - "Shared Notifications"
Cohesion: 0.06
Nodes (39): Next.js App Router, Frontend Route Reference, Frontend README (Next.js Bootstrap), Props, ServiceName, ServiceThemeProvider(), useLogout(), useAuth() (+31 more)

### Community 1 - "Ui Ux Omnivora  Super Sdmin Workspace"
Cohesion: 0.08
Nodes (41): boot(), collectProps(), compileAttr(), compileTemplate(), createComponentFactory(), createHelmetManager(), createPseudoSheet(), createRegistry() (+33 more)

### Community 2 - "Ui Ux Omny Vora User Workspace Design"
Cohesion: 0.07
Nodes (24): @babel/standalone 7.29.0 (in-browser JSX transpiler, CDN), React 18.3.1 (UMD, CDN), ReactDOM 18.3.1 (UMD, CDN), Static HTML + Babel-Standalone UI Prototype Pattern (diverges from Next.js/TS build), app/Cards.jsx — Cards component module, app/data.jsx — mock/app data module, Icon(), ICONS (+16 more)

### Community 3 - "Features User Data"
Cohesion: 0.05
Nodes (52): createCertification(), createExperience(), createSocialLink(), deleteCertification(), deleteSkill(), deleteTechnology(), fetchCertifications(), fetchEducations() (+44 more)

### Community 4 - "Features User Data"
Cohesion: 0.08
Nodes (47): addProjectImage(), createEducation(), createProject(), deleteEducation(), deleteExperience(), deleteProject(), deleteSocialLink(), removeProjectImage() (+39 more)

### Community 5 - "Package.json"
Cohesion: 0.05
Nodes (41): eslint, eslint-config-next, jsdom, devDependencies, eslint, eslint-config-next, jsdom, tailwindcss (+33 more)

### Community 6 - "Ui Ux Omnyvora Design System"
Cohesion: 0.20
Nodes (11): Avatar Component (sm/md/lg/xl, initials + image), Isometric Cube Cluster Logo Mark, Lucide Icon Set (Flagged Substitution), Two-Token Tool Theming (accent-primary + accent-subtle), Design System README (copy - User Workspace Design), Avatar Component Preview (HTML), Omnyvora Design System README (canonical), Omnyvora Design Skill Definition (+3 more)

### Community 7 - "Features Admin"
Cohesion: 0.14
Nodes (27): ADMIN_URL, CATALOG_URL, createPlatformService(), deletePlatformService(), fetchAdminServices(), fetchAdminSettings(), fetchPlatformServiceDetail(), LOGS_URL (+19 more)

### Community 8 - "Shared Workspace"
Cohesion: 0.09
Nodes (20): SUB_NAV, SettingsRow(), SettingsRowProps, SettingsTabPanel(), SettingsTabPanelProps, SUB_NAV, AdminSettingsFormSchema, AdminSettingsFormValues (+12 more)

### Community 9 - "Features Admin"
Cohesion: 0.10
Nodes (22): LogFilterBar(), LogFilterBarProps, AdminStore, AdminDashboardSummarySchema, AdminGrowthPointSchema, AdminRecentRegistrationSchema, AdminServiceListSchema, AdminServiceSchema (+14 more)

### Community 10 - "Shared Components"
Cohesion: 0.08
Nodes (26): cn(), OtpInput(), OtpInputProps, Avatar, AvatarFallback, AvatarImage, Badge(), BadgeProps (+18 more)

### Community 11 - "Features Auth"
Cohesion: 0.07
Nodes (40): AUTH_URL, loginUser(), OTP_URL, registerUser(), resetPassword(), verifyToken(), defaultRouteFor(), hydrateSession() (+32 more)

### Community 12 - "Features Profile"
Cohesion: 0.16
Nodes (21): GET/PATCH /v1/profiles/me/, AVATAR_COMPRESSION_CONFIG, compressImage(), fetchMyProfile(), updateMyProfile(), uploadAvatar(), PROFILE_QUERY_KEY, useMyProfile() (+13 more)

### Community 13 - "Tsconfig.json"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 14 - "Core Api"
Cohesion: 0.14
Nodes (15): apiClient, refreshQueue, ApiError, ApiResponse, ApiSuccess, resolveServiceUrl(), serviceEntries, ServiceName (+7 more)

### Community 15 - "Features Auth"
Cohesion: 0.12
Nodes (30): AuthHeader(), AuthLayout(), AuthLayoutProps, FooterLink(), GoogleButton(), OrDivider(), STEP_LABELS, STRENGTH_META (+22 more)

### Community 16 - "Ui Ux Omny Vora User Workspace Design"
Cohesion: 0.16
Nodes (8): createExternalModules(), getSlot(), ImageSlot, load(), save(), setSlot(), toDataUrl(), createExternalModules()

### Community 17 - "Features Auth"
Cohesion: 0.10
Nodes (17): requestOtp(), PasswordResetForm(), scorePassword(), useCountdown(), RegisterForm(), scorePassword(), useCountdown(), useRequestOtp() (+9 more)

### Community 18 - "Features User Data"
Cohesion: 0.13
Nodes (20): useDebounce(), createSkill(), createTechnology(), searchSkills(), searchTechnologies(), AddSkillRow(), AddSkillRowProps, onCreateSkillError() (+12 more)

### Community 19 - "Ui Ux Omnyvora Design System"
Cohesion: 0.19
Nodes (22): logo-darkmode-original.png asset, logo-mark-black.png asset, logo-mark-white.png asset, colors_and_type.css — design tokens (color + typography variables), components.css — shared component styles (btn, badge, card, input, menu, etc.), Badge / pill component (6 tones, sm+md), Button — dark mode preview (photo theme), Button — sizes & states preview (sm/md/lg, hover, disabled) (+14 more)

### Community 20 - "Features Admin"
Cohesion: 0.23
Nodes (9): fetchLogs(), formatTimestamp(), LEVEL_BADGE, LogRow(), LogRowProps, useAdminLogs(), AdminLogsPage(), useAdminStore (+1 more)

### Community 21 - "Features Admin"
Cohesion: 0.13
Nodes (15): fetchAdminDashboard(), AlertCard(), AlertCardProps, buildPaths(), formatAxisDate(), GrowthChart(), GrowthChartProps, ServiceAdminCard() (+7 more)

### Community 22 - "Features User Data"
Cohesion: 0.14
Nodes (34): isApiSuccess(), CategoryCard(), CategoryCardProps, ExperienceManager(), IdentityOverview(), IdentityOverviewProps, SkillsManager(), SocialLinksManager() (+26 more)

### Community 23 - "Ui Ux Omnyvora Design System"
Cohesion: 0.13
Nodes (21): Modal Dialog, Motion Duration & Easing Tokens, Border Radius Scale, --radius-modal Token (16px), Semantic Color Tokens — Dark Theme, Semantic Color Tokens — Light Theme, Sidebar Navigation, Skeleton Loader (+13 more)

### Community 24 - "Ui Ux Omnyvora Design System"
Cohesion: 0.30
Nodes (16): AuthScreen(), Avatar(), Badge(), Button(), Dashboard(), _extends(), Field(), Icon() (+8 more)

### Community 25 - "Features Activity"
Cohesion: 0.21
Nodes (11): ActivityItemUI, toActivityItemUI(), toActivityListUI(), UserActivity, UserActivityPage, UserActivityPageSchema, UserActivitySchema, ACTIVITY_URL (+3 more)

### Community 26 - "Ui Ux Omny Vora Auth Design"
Cohesion: 0.10
Nodes (4): GoogleG(), OtpInput(), PasswordField(), STRENGTH

### Community 27 - "Features Admin"
Cohesion: 0.13
Nodes (21): UserListRow(), UserListRowProps, AdminDashboardUI, AdminRegistrationUI, AdminUserActivityUI, AdminUserListItemUI, formatLabel(), initialsOf() (+13 more)

### Community 28 - "Components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 29 - "Ui Ux Omnyvora Design System"
Cohesion: 0.11
Nodes (20): POST /v1/auth/login/, POST /v1/auth/register/, POST /v1/otp/get-otp/, POST /v1/auth/password/change/, POST /v1/auth/password/reset/, Backend Project Context (CONTEXT.md), View -> Service -> Selector -> DB Flow, POST /v1/auth/login/ (+12 more)

### Community 30 - "Features Auth"
Cohesion: 0.31
Nodes (4): safeRedirectPath(), LoginForm(), LoginPage(), GuestGuard()

### Community 31 - "Features User Data"
Cohesion: 0.22
Nodes (18): useDragReorder(), describeApiError(), CertificationsManager(), useCreateCertification(), useDeleteCertification(), useReorderCertifications(), useUpdateCertification(), toCertificationUI() (+10 more)

### Community 32 - "Shared Auth"
Cohesion: 0.18
Nodes (10): metadata, Providers(), refreshTokenStore, AuthContext, AuthProvider(), AuthState, User, Toaster() (+2 more)

### Community 33 - "Features Account"
Cohesion: 0.18
Nodes (9): AccountGeneral(), AccountPage(), AccountSecurity(), SUB_NAV, changePassword(), PasswordChangeForm(), useChangePassword(), PasswordChangeFormSchema (+1 more)

### Community 34 - "Features User Data"
Cohesion: 0.07
Nodes (47): applyServerErrors(), fetchCertificationOptions(), BLANK, CertificationPanel(), CertificationPanelProps, BLANK, EducationPanel(), EducationPanelProps (+39 more)

### Community 35 - "Features User Data"
Cohesion: 0.07
Nodes (51): boot(), cdnScriptFor(), collectProps(), compileAttr(), compileTemplate(), contentKey(), createComponentFactory(), createHelmetManager() (+43 more)

### Community 36 - "Ui Ux Omnivora  Super Sdmin Workspace"
Cohesion: 0.24
Nodes (22): react, react, AuthScreen(), Avatar(), Badge(), Button(), Dashboard(), _extends() (+14 more)

### Community 37 - "Ui Ux Omny Vora Auth Design"
Cohesion: 0.30
Nodes (16): AuthScreen(), Avatar(), Badge(), Button(), Dashboard(), _extends(), Field(), Icon() (+8 more)

### Community 38 - "Ui Ux Omny Vora User Workspace Design"
Cohesion: 0.30
Nodes (16): AuthScreen(), Avatar(), Badge(), Button(), Dashboard(), _extends(), Field(), Icon() (+8 more)

### Community 39 - "Package.json"
Cohesion: 0.13
Nodes (15): axios, browser-image-compression, clsx, @hookform/resolvers, next, dependencies, axios, browser-image-compression (+7 more)

### Community 40 - "Features Auth"
Cohesion: 0.16
Nodes (11): ApiRequestError, fetchActivity(), ACTIVITY_QUERY_KEY, useRecentActivity(), ActivityPage(), ACTION_STYLE, ActivityCardItem, ActivityItem() (+3 more)

### Community 41 - "Ui Ux Omny Vora User Workspace Design"
Cohesion: 0.14
Nodes (6): TweakColor(), TweakNumber(), TweakRadio(), TweaksPanel(), __twkIsLight(), useTweaks()

### Community 42 - "Features User Data"
Cohesion: 0.30
Nodes (16): AuthScreen(), Avatar(), Badge(), Button(), Dashboard(), _extends(), Field(), Icon() (+8 more)

### Community 43 - "Features User Data"
Cohesion: 0.13
Nodes (14): 1. What Omnyvora is, 2.1 Already fully designed — reuse, do not redesign, 2.2 Genuinely undesigned — this is your actual job, 2. Ground truth: what already exists, and what doesn't, 3. Design system — follow exactly, do not invent new values, 4.1 Template catalog (admin-authored, user-selected), 4.2 A user's portfolio (one user can have multiple), 4.3 The content source ("My Data" — already fully designed, you're consuming it, not rebuilding it) (+6 more)

### Community 44 - "Features Catalog"
Cohesion: 0.19
Nodes (13): fetchServices(), CATALOG_QUERY_KEY, usePlatformServices(), ApplicationsPage(), ServiceGrid(), toServicesUI(), toServiceUI(), uniqueCategories() (+5 more)

### Community 45 - "Features Account"
Cohesion: 0.27
Nodes (10): tokenStore, changeEmail(), requestEmailChangeOtp(), ChangeEmailModal(), Props, useCountdown(), useChangeEmail(), useRequestEmailChangeOtp() (+2 more)

### Community 46 - "Ui Ux Omny Vora Auth Design"
Cohesion: 0.21
Nodes (8): DC, DCArtboardFrame(), DCCtx, dcExport(), dcFlatten(), DCSection(), DCViewport(), DesignCanvas()

### Community 47 - "Features Dashboard"
Cohesion: 0.08
Nodes (22): GET /v1/catalog/services/, GET /v1/notifications/, GET /v1/notifications/unread-count/, useDashboardNotifications(), useDashboardProfile(), useDashboardServices(), useDashboardUnreadCount(), AppsAlertsCardProps (+14 more)

### Community 48 - "Ui Ux Omny Vora User Workspace Design"
Cohesion: 0.20
Nodes (4): GalleryField(), ProficiencySlider(), TagInput(), useDragReorder()

### Community 51 - "Features Catalog"
Cohesion: 0.20
Nodes (9): fetchAdminUserDetail(), fetchAdminUsers(), fmtDate(), UserDetailPanel(), useAdminUserDetail(), useAdminUsers(), AdminUsersPage(), AdminUserDetailUI (+1 more)

### Community 52 - "Core Design"
Cohesion: 0.33
Nodes (4): GlobalTokens, cvBuilderTokens, imageEnhancerTokens, portfolioTokens

### Community 53 - "Shared Components"
Cohesion: 0.25
Nodes (8): ProficiencySlider(), ProficiencySliderProps, SkillRow(), SkillRowProps, TechnologyRow(), TechnologyRowProps, UserSkillUI, UserTechnologyUI

### Community 54 - "Ui Ux Omny Vora User Workspace Design"
Cohesion: 0.22
Nodes (8): APPS, IDENTITY, NOTIFICATIONS, PLATFORM_OPTIONS, SKILL_CATALOG, SKILL_CATEGORIES, TECH_SUGGESTIONS, USER

### Community 55 - "Pnpm Workspace.yaml"
Cohesion: 0.25
Nodes (8): brace-expansion (npm package, pinned >=5.0.7), form-data (npm package, pinned >=4.0.6), js-yaml (npm package, pinned >=4.3.0), postcss (npm package, pinned >=8.5.12), sharp (npm package, allowBuild + version override >=0.35.0), undici (npm package, pinned >=7.28.0), unrs-resolver (npm package, allowBuild), pnpm Workspace Configuration

### Community 56 - "Ui Ux Omnyvora Design System"
Cohesion: 0.18
Nodes (7): TOOLS, TopBar(), Dashboard(), NewProjectModal(), SAMPLE_PROJECTS, SettingsView(), TOOL_META

### Community 58 - "Shared Components"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 59 - "Ui Ux Omny Vora User Workspace Design"
Cohesion: 0.08
Nodes (12): Account(), AccountGeneral(), AccountSecurity(), fmtDate(), App(), TWEAK_DEFAULTS, Applications(), Dashboard() (+4 more)

### Community 62 - "Ui Ux Omny Vora User Workspace Design"
Cohesion: 0.25
Nodes (7): Photo / Image Enhancer Tool (Teal Accent #0D9488), Landing Page Design Prompt, Hero Section Spec, Landing Page SEO Requirements, Image Enhancer (Landing Page Tool Entry), Tools Showcase Section Spec, No-Hype Precise Voice Guideline

### Community 63 - "Features Admin"
Cohesion: 0.22
Nodes (8): CONTENT FUNDAMENTALS, ICONOGRAPHY, INDEX — what's in this system, Omnyvora Design System — v1.0, Quick start, Sources used to build this system, VISUAL FOUNDATIONS, What Omnyvora is

### Community 64 - "Shared Workspace"
Cohesion: 0.25
Nodes (8): Admin Console Domain (admin.console), Admin Dashboard View (Prototype), Admin Logs View (Prototype), Admin Services View (Prototype), Admin Settings View (Prototype), Admin Users View (Prototype), Design System README (copy - Super Admin Workspace), Super Admin Workspace Prototype (HTML)

### Community 66 - "Shared Components"
Cohesion: 0.32
Nodes (6): BLANK, ServiceFormDialog(), ServiceFormDialogProps, toFormValues(), PlatformServiceFormSchema, PlatformService

### Community 69 - "Package.json"
Cohesion: 0.67
Nodes (3): react-dom, react-dom, DCFocusOverlay()

## Ambiguous Edges - Review These
- `Label, Caption & Code Type Scale` → `POST /v1/auth/login/ Endpoint (code-sample text)`  [AMBIGUOUS]
  ui_ux/omnyvora_design_system/preview/type-labels.html · relation: references

## Knowledge Gaps
- **397 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+392 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **70 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Label, Caption & Code Type Scale` and `POST /v1/auth/login/ Endpoint (code-sample text)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `react` connect `Ui Ux Omnivora  Super Sdmin Workspace` to `Ui Ux Omnivora  Super Sdmin Workspace`, `Ui Ux Omny Vora User Workspace Design`, `Ui Ux Omnyvora Design System`, `Features Auth`, `Ui Ux Omnyvora Design System`, `Ui Ux Omny Vora Auth Design`, `Features User Data`, `Ui Ux Omny Vora Auth Design`, `Ui Ux Omny Vora User Workspace Design`, `Package.json`, `Ui Ux Omny Vora User Workspace Design`, `Features User Data`, `Ui Ux Omny Vora Auth Design`, `Ui Ux Omny Vora User Workspace Design`, `Ui Ux Omny Vora User Workspace Design`, `Ui Ux Omnyvora Design System`, `Ui Ux Omny Vora User Workspace Design`, `Package.json`, `Ui Ux Omny Vora Auth Design`, `Ui Ux Omny Vora User Workspace Design`, `Ui Ux Omnyvora Design System`?**
  _High betweenness centrality (0.363) - this node is a cross-community bridge._
- **Why does `useFormField()` connect `Features Auth` to `Ui Ux Omnivora  Super Sdmin Workspace`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Why does `isApiSuccess()` connect `Features User Data` to `Shared Notifications`, `Features User Data`, `Features Admin`, `Features Auth`, `Features Profile`, `Core Api`, `Features User Data`, `Features Admin`, `Features Admin`, `Features Activity`, `Features User Data`, `Shared Auth`, `Features Account`, `Features User Data`, `Features Auth`, `Features Catalog`, `Features Account`, `Features Dashboard`, `Features Catalog`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Omnyvora Workspace HTML Entry Point (design prototype)` (e.g. with `Static HTML + Babel-Standalone UI Prototype Pattern (diverges from Next.js/TS build)` and `ImageSlot`) actually correct?**
  _`Omnyvora Workspace HTML Entry Point (design prototype)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _397 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Shared Notifications` be split into smaller, more focused modules?**
  _Cohesion score 0.06057692307692308 - nodes in this community are weakly interconnected._