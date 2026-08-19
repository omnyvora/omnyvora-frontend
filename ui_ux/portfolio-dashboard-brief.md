# Omnyvora — Portfolio Dashboard Design Brief (User + Admin)

This is a design brief for two new dashboards inside the Omnyvora product. Use it as your
working brief — treat every functional requirement below as fixed, but you own every visual,
layout, and motion decision within the constraints stated in Section 3. Where you have to make a
judgment call, make it and note it; don't stop to ask.

---

## 1. What Omnyvora is

Omnyvora is a multi-tool workspace platform: one account, several independent creative/professional
tools, each with its own accent color and its own domain boundary on the backend and frontend
(CV Builder, Portfolio, Image Enhancer, Productivity, Drive, Calendar, Analytics — the tool catalog
is literally a database table, `PlatformService`, so the list can grow). A user logs into one shared
workspace shell (sidebar + topbar) and opens whichever tool they need.

**Portfolio** is one of those tools. Its job: let a user turn the professional data they've already
entered elsewhere in the product — projects, work experience, education, certifications, skills,
social links, collectively called "My Data" / "Identity" — into a real, published, shareable
portfolio *website*, built from a template. Think Linktree meets a personal site builder, scoped to
professional/creative portfolios.

You are designing:
1. **The user-facing Portfolio dashboard** — where an end user picks a template, builds their
   portfolio from their existing data, previews it, and publishes it.
2. **The admin-facing Portfolio management surface** — where a superadmin manages the template
   catalog and oversees published portfolios across the platform.

Both already have a home in the real codebase (routes and empty feature folders exist — see
Section 6) but **no screens have been designed for either yet.** This is genuinely greenfield work,
not a redesign.

---

## 2. Ground truth: what already exists, and what doesn't

I pulled this directly from the codebase so you're not guessing. Read this section carefully — it
tells you what to reuse as-is, and where the real gap is.

### 2.1 Already fully designed — reuse, do not redesign

- **The full design system**: colors, type, spacing, radius, shadow, motion tokens, and a complete
  base component library (button, input, card, badge, avatar, modal, toast, dropdown, tooltip,
  skeleton, empty-state, sidebar nav, top bar, stat card). Source: `ui_ux/omnyvora_design_system/`.
  Live token implementation: `src/core/design/TOKENS.md` and `src/core/design/tokens/`.
- **The workspace shell**: collapsible sidebar (76px collapsed / 256px expanded), topbar, routing
  shape. Mock reference: `ui_ux/omny_vora_user_workspace_design/app/Sidebar.jsx`, `Layout.jsx`.
- **"My Data" (Identity) CRUD** — the screens for adding/editing Projects, Experience, Education,
  Certifications, Skills, Social Links. This is the *content* that will populate a portfolio, and
  its UI is already fully designed (list rows, drag-reorder, right-side slide-over forms, tag
  inputs, image galleries). Reference: `ui_ux/omny_vora_user_workspace_design/app/Identity*.jsx`.
  **The new Portfolio builder should feel like a natural continuation of this pattern**, not a
  different design language.
- **The admin shell**: 5-section nav (Dashboard, Services, Users, Logs, Settings), KPI-card +
  chart dashboard, list+detail pattern for Users, filterable table for Logs. Reference:
  `ui_ux/OmniVora _super_sdmin_workspace/Super Admin Workspace.dc.html`. This is also **already
  built in real code** at `src/app/admin/` and `src/features/admin/` — fully functional, ship-quality.
- Reusable interaction patterns you should reach for by default: `SidePanel` (right slide-over
  drawer for forms), `RowShell` (list row with drag handle, thumbnail, title/meta, actions),
  `Tabs`, `SubNav` (vertical left-rail sub-navigation), `ConfirmModal` (incl. "type DELETE to
  confirm" variant), `TagInput`, `GalleryField` (reorderable image grid with cover toggle),
  `EmptyState`, drag-to-reorder lists, `ToastStack`.

### 2.2 Genuinely undesigned — this is your actual job

- Everything about turning stored data into a **published portfolio**: template selection, the
  builder/editor experience, section on/off toggles, choosing which specific data items show up,
  a live preview, the publish/unpublish flow, slug and custom-domain settings.
- A **Portfolio-specific dashboard home** for the user — distinct from the generic app-launcher
  dashboard that already exists. Status, template thumbnail, quick actions.
- A **Portfolio-specific admin surface** — template catalog management (create/edit/publish
  templates) and oversight of individual users' portfolio instances. Today the admin side has
  only one related control: a platform-wide "Portfolio service: on/off" toggle in Settings. There
  is no per-template or per-portfolio-instance admin view anywhere yet.

---

## 3. Design system — follow exactly, do not invent new values

All values below are live in code (`src/core/design/TOKENS.md`), not just the mock. Use these
tokens; don't introduce new hex values, durations, or easing curves.

**Color** — 10-step neutral ramp (`--gray-950 #111` → `--white #fff`), 4 status colors
(success `#1DB37B`, error `#E5484D`, warning `#F5A623`, info `#3B82F6`, each with a light `-50`
tint), and one accent per tool via `data-service="<name>"`:

| Tool | Accent | Primitive |
|---|---|---|
| Portfolio (**this brief**) | Purple | `#534AB7` · subtle `#EEEDFE` (light) / `#1A1830` (dark) |
| Platform shell / dashboard / admin | Indigo (default, no attribute needed) | `#4F46E5` |
| CV Builder | Blue | `#2563EB` |
| Image Enhancer | Teal | `#0D9488` |

Every **user-facing** Portfolio screen carries `data-service="portfolio"` and uses the purple
accent — it's already wired in `src/core/design/tokens/services/portfolio.ts`, you're just the
first to design against it. Primary buttons stay neutral black/white per the system's rule; accent
is reserved for the single primary action, active nav state, focus rings, and accent badges — never
for large fills or backgrounds.

For the **admin** Portfolio screens: stay inside the existing admin shell's current accent (indigo,
same as the rest of `/admin/*` today — there is no separate "admin accent" formalized in code, so
don't invent one). Admin should read as "the same control panel, one more section," not a
re-skinned space.

**Type**: Inter (sans), JetBrains Mono (numbers/code/IDs/timestamps). Scale: Display 32/24/20,
Body 16/14/13, Label 13/11 (label-md is uppercase — the system's signature touch, use it for
section eyebrows), Caption 11.

**Spacing/radius/shadow**: 4px base spacing scale (4→64px). Radius: input 6, button 8, icon 10,
card 12, modal 16, pill 999. Shadows are flat black at low opacity only (`shadow-1` cards,
`shadow-2` menus/panels, `shadow-3` modals) — no colored glows, no inner shadows.

**Motion — the whole system, three numbers and one curve:**
- `--duration-fast 120ms` — hover/focus color changes
- `--duration-base 180ms` — panel/width/content transitions
- `--duration-slow 300ms` — drawer/modal enter-exit
- `--ease: cubic-bezier(0.16, 1, 0.3, 1)` — ease-out-expo, used everywhere, no exceptions

**The one hard rule that makes this system read as modern rather than dated: interactive states
change only color, opacity, or border — never size or position on hover/press.** No hover-scale,
no bounce, no elastic easing, no skeuomorphic depth changes. This is closer to Linear/Vercel/
Raycast than to anything with playful micro-bounces. Translate the "decent but not overloaded,
consistent, not old-fashioned" brief into: motion earns its place at state changes and
enter/exit transitions (drawer opens, step advances, status changes, list reorders, toast
appears/disappears), never as decoration on static content, and never with a different easing
curve or duration than what's listed above. Suggested moments to animate (your call on exact
choreography): wizard step transitions, section-toggle switches (reuse existing DS toggle),
drag-reorder (reuse the existing `useDragReorder` pattern from Identity screens), template card
selection (border/background color only), publish button loading → success toast, preview panel
slide-in, status badge color transition (Draft → Published). Everything else — skeleton loaders,
empty states, toasts — reuse the existing components as-is; don't re-animate them differently.

**Absolute don'ts** (from the system's own guidance, already enforced everywhere else in the
product — don't be the first screen to break these): no emoji, ever — status is color + icon only.
No gradients or textures except genuine data-visualization fills (a chart area, a completion ring).
No frosted-glass/backdrop-blur. No colored left-border accent stripes on cards. No heavy drop
shadows. Icons are Lucide-style line icons (~2px stroke, no fills). Copy is sentence-case,
verb-first on buttons ("Save changes", not "Save Changes"), no exclamation marks in errors,
address the user as "you."

Full source files if you need to go deeper: `ui_ux/omnyvora_design_system/{README.md,SKILL.md,
colors_and_type.css,components.css}`, `ui_ux/omnyvora_design_system/preview/*.html` (34 live
component specimens), `src/core/design/TOKENS.md`.

---

## 4. The real data model — design against these exact fields

This is what actually exists in the backend today (Django models, already migrated). Field names
matter — keep your screens' terminology aligned to these so engineering can wire it up directly.

### 4.1 Template catalog (admin-authored, user-selected)

- **Template**: `name`, `slug`, `description`, `thumbnail` (image), `category` (free text),
  `status` (`draft` / `published` / `archived`), `created_by`.
- **TemplateSection**: belongs to a Template. `section_key` — one of a **fixed set**:
  `hero, about, skills, projects, experience, services, certifications, education, contact`.
  `is_required` (bool — required sections can't be turned off by the user), `display_order`.
- **TemplatePage**: `page_type` (`main` or `project_detail`) — an HTML file per page type.
- **TemplateField**: a `placeholder_key` (e.g. `"portfolio.github_url"`) — content-mapping slots.
- **TemplateAsset**: template-owned static files.

### 4.2 A user's portfolio (one user can have multiple)

- **PortfolioInstance**: `user`, `template` (FK — an instance references its template live, no
  cloning), `slug` (unique, becomes the public URL), `title` (internal label), `status` (`draft` /
  `published` / `unpublished`), `setup_step` (an integer — **this is a resumable setup wizard**,
  the model literally anticipates a multi-step flow with a "continue where you left off" point),
  `custom_domain` (optional, unique), `published_at`.
- **PortfolioSectionState**: per-instance on/off toggle for each of that template's sections
  (`is_enabled`).
- **PortfolioService**: a portfolio-instance-owned content block distinct from "My Data" —
  `title`, `description`, `bullets` (a list of strings), `display_order`. This is a "services I
  offer" list the user writes specifically for this portfolio, not pulled from elsewhere.
- **PortfolioItemVisibility**: `item_type` (`project` / `skill` / `experience` / `education` /
  `certification` / `social_link`) + item id + `is_visible`. **This is the mechanism that lets a
  user show/hide specific pieces of their existing "My Data" on a specific portfolio** — e.g., they
  have 8 projects but only want 5 shown here. Design this as the connective layer between "My Data"
  (already designed) and the portfolio builder (your job).

### 4.3 The content source ("My Data" — already fully designed, you're consuming it, not rebuilding it)

Projects (title, descriptions, achievements list, tech/skill tags, GitHub/live URLs, image gallery
with a cover image, `is_featured` flag), Experience (title, company, dates, current-role flag,
tech tags), Education (degree, institution, GPA, dates), Certifications (title, issuer, date,
credential URL, image), Skills (name, category, 0–100 proficiency), Social Links (platform, URL).
Every one of these already has a drag-to-reorder `display_order` and a dedicated `/reorder/`
endpoint — reuse that same reorder interaction anywhere your new screens need ordering (the
Services block, the section list, item-visibility lists).

### 4.4 What's explicitly NOT built yet (design for it anyway — flag, don't skip)

`portfolio.templates` and `portfolio.instances` exist as database models only — zero API
endpoints, zero business logic today. That's a backend prerequisite, not a reason to avoid
designing this; design the target experience against the model above as if the API existed,
since it will need to.

---

## 5. Deliverable 1 — User-facing Portfolio dashboard

Lives at `src/app/(workspace)/portfolio/` (route already scaffolded, currently a blank stub) and
`src/features/portfolio/` (empty feature folder — `api.ts`/`hooks.ts`/`types.ts` all placeholders
today). Reached from the main workspace sidebar — this is a full tool, so it should be a
top-level sidebar item, not buried inside the generic Applications launcher grid the way it is in
the current placeholder mock.

Screens to design (you decide exact layout/grouping; this is the required functional coverage):

1. **My Portfolio(s) home.** A user can have zero, one, or several `PortfolioInstance`s. Empty
   state: clear "Create your first portfolio" path into the template gallery. Populated state:
   each portfolio shown with its template thumbnail, title, status badge (Draft/Published/
   Unpublished), public URL/slug, last-updated time, and quick actions (Edit, Preview, Publish/
   Unpublish, Delete). Design this so the common single-portfolio case feels immediate, not like
   navigating a list for the sake of it — your call on how.
2. **Template gallery.** Browse published templates, filterable by `category`, with a thumbnail
   grid and a way to see a larger preview before committing. "Use this template" starts a new
   `PortfolioInstance`.
3. **Builder / setup wizard.** This is the core screen. It needs to cover, in whatever step
   structure you think reads best:
   - Confirming/starting from the chosen template
   - Toggling each `TemplateSection` on/off (required sections shown as locked-on)
   - For each enabled section, choosing which specific "My Data" items are visible on *this*
     portfolio (`PortfolioItemVisibility`) — with an empty-state path back to "My Data" if the
     user hasn't added relevant content yet
   - Editing the portfolio-specific "Services" block (title/description/bullets, reorderable)
   - Slug + optional custom domain, then Publish
   After first-time setup, this same screen becomes the ongoing editor — a persistent section
   list to jump between, in the spirit of the existing Identity `SubNav` + `Tabs` pattern, not a
   one-time wizard you can't return to.
4. **Live preview.** Full preview of the rendered portfolio with at least a desktop/mobile toggle,
   "copy link," and "open in new tab."
5. **Publish & domain settings.** Status control (Draft/Published/Unpublished), slug editor,
   optional custom domain field, `published_at` display, and a danger zone for unpublish/delete.

Out of scope / explicitly not required: portfolio view-count analytics (no backend tracking exists
for this specifically — if you want a stats teaser, mark it "coming soon" rather than fabricating
numbers).

---

## 6. Deliverable 2 — Admin-facing Portfolio management

Lives inside the existing Super Admin Workspace at `src/app/admin/` (already built: Dashboard,
Services, Users, Logs, Settings — do not redesign those). Add a Portfolio section here rather than
building a parallel admin shell. Note: the existing Services page already has a "Manage →" button
on each service card that goes nowhere today — the Portfolio service's card is the natural
entry point into this new section.

Screens to design:

1. **Portfolio overview.** KPI cards in the same visual language as the existing admin Dashboard
   (total templates, published templates, total portfolio instances, draft/published/unpublished
   breakdown, most-used template), plus a recent-instances table (owner, template, status,
   updated) — same list/table conventions as the existing Users/Logs screens.
2. **Templates.** A table of every `Template` (thumbnail, name, category, status badge, created
   by, how many instances use it) with search/filter and a create-new action. A template
   detail/editor view covering: metadata (name, slug, description, category, thumbnail, status),
   its `TemplateSection`s (reorderable, required toggle), its `TemplatePage` files (main /
   project_detail), and its `TemplateAsset`s — effectively a template-authoring console for
   whoever builds new templates.
3. **Portfolios.** A table of every `PortfolioInstance` across all users (owner, template, status,
   slug/custom domain, setup progress, published date), searchable/filterable by status/template/
   owner, in the same list+detail pattern as the existing admin Users page. Detail view: owner
   (linking to their existing admin user-detail page), template used, section states, and
   moderation actions — feature this portfolio, unpublish/takedown with a reason, view the live
   page. **Flag clearly in your output that these mutation actions are new backend surface, not
   live yet** — design the target UX regardless.

Do not touch: the existing platform-wide Portfolio on/off toggle already in Settings → Services —
just make sure this new section is discoverable from a place that makes sense alongside it.

---

## 7. Constraints recap

- Don't redesign the app shell, sidebar, "My Data"/Identity CRUD screens, base component library,
  or the existing admin Dashboard/Users/Logs/Settings screens. Extend, don't replace.
- Keep every field name you show on screen traceable to a real model field from Section 4 —
  engineering will be typing Zod schemas straight off your screens.
- User-facing Portfolio screens: purple accent (`data-service="portfolio"`). Admin Portfolio
  screens: stay in the existing admin shell's current (indigo) accent.
- Light and dark mode both, since the whole product supports both.
- Cover empty, loading (skeleton), populated, and error states for every primary screen — these
  are first-class states in this product, not afterthoughts.
- Everything in Section 3 (tokens, motion, the do/don'ts) is a hard constraint. Everything else —
  exact layout, spacing rhythm within a screen, animation choreography, information density,
  whether the wizard is a modal or a full page — is your call.
