# Omnyvora Design System — v1.0

A token-driven design system for **Omnyvora**, a multi-tool SaaS platform. One visual
language powers every tool; each tool re-skins itself by swapping **two tokens only**
(`accent-primary` + `accent-subtle`). Everything else — type, spacing, components,
elevation, motion — stays identical.

> **Theming in one sentence:** change `--accent-primary` and `--accent-subtle`; ship a new tool.

---

## What Omnyvora is

Omnyvora is a **microservice-ready monolith** (Django / DRF / PostgreSQL / Redis / Celery)
that hosts several distinct tools under one account and one shell. The platform ships with a
shared identity, profile, notification, and OTP foundation; individual **tools** layer on top
and are distinguished purely by their accent color:

| Tool | Accent | Primitive |
|------|--------|-----------|
| **Portfolio** | Purple | `purple-600 #534AB7` |
| **Photo** | Teal | `teal-600 #0D9488` |
| **Productivity** | Blue | `blue-600 #2563EB` |

The brand mark is an **isometric cube cluster** — four cubes in a cross/diamond arrangement,
viewed from above. Strictly two-color (`#111111` / `#FFFFFF`): black cubes in light mode,
white cubes in dark mode. The cube motif literalizes the product idea — modular tools that
snap together into one system.

---

## Sources used to build this system

- **Spec** — the full written design brief supplied by the user (tokens, type scale, 20
  components, theming rules, layout grid). This is the authoritative source.
- **`uploads/CONTEXT.md`** — backend architecture context (Django domains, API endpoints,
  models, conventions). Confirms the platform shape; contains **no** frontend/design code.
- **Logos** — `uploads/OmnyVora logo black theme .png`, `uploads/OmnyVora logo light theme .png`.
  Transparent two-color marks were derived from these (see `assets/`).
- **GitHub repo** — [`omnyvora/all_in_one`](https://github.com/omnyvora/all_in_one). This is the
  backend monolith described in `CONTEXT.md`. At time of writing it ships shared infrastructure
  only (*"No business domains created yet"*) and **no frontend**, so nothing was imported from
  it. Connect GitHub and browse it if you want to track domains as they land — the UI kit here
  is wired to the live API shape (`/v1/auth`, `/v1/profiles`, `/v1/notifications`).

> The reader is **not** assumed to have access to any of the above — paths and URLs are recorded
> so they can be re-opened if available.

---

## CONTENT FUNDAMENTALS

> ⚠️ No marketing/product copy was provided. The guidance below is **inferred** from the
> engineering conventions in `CONTEXT.md` and applied consistently across the UI copy in this
> system. Treat it as a starting convention, not an audited brand voice — flag for review.

**Voice — precise, calm, engineering-literate.** Omnyvora talks like a well-run codebase:
verb-first actions, noun-first objects, no hype. Mirrors the backend convention (services are
verbs `create_profile`, selectors are nouns `get_profile_by_user`).

- **Person:** Address the user as **you**; the product refers to itself by name ("Omnyvora")
  or stays invisible. Avoid "we" in product UI.
- **Casing:**
  - **Buttons & actions** — Sentence case, verb-first: `Open project`, `Save changes`, `New`.
  - **Eyebrow / field labels / section headers** — `UPPERCASE` via `label-md` (e.g. `WORKSPACE`,
    `STORAGE USED`). This is the system's signature casing accent.
  - **Headings & body** — Sentence case. Never title-case sentences.
- **Length:** Terse. A toast title is 2–3 words (`Profile saved`); its message is one short
  sentence (`Your changes are live.`). Empty-state descriptions cap at ~2 lines.
- **Numbers & metadata** — Set in **JetBrains Mono** (`code` style): IDs, endpoints, token
  values, counts in technical contexts. Humanized counts in stat cards stay in Inter.
- **Tone in errors:** Plain and non-blaming, states the constraint: `File exceeds 25 MB limit.`,
  `Enter a valid email`. No exclamation marks, no apologies.
- **No emoji.** The brand is monochrome and geometric; emoji would break the register. Status is
  carried by **color + icon**, never an emoji.
- **Vibe:** Developer-grade SaaS — Linear/Vercel adjacency. Confident, quiet, fast. Whitespace
  over decoration.

Examples in use across this system:
`New project` · `No projects yet` · `Create your first project to start organizing work across
every Omnyvora tool.` · `Upload failed — File exceeds 25 MB limit.` · `3 available`

---

## VISUAL FOUNDATIONS

**Overall feel.** Monochrome-first, near-flat, generously spaced. Color is rationed: a grayscale
shell carries 95% of every screen; the single tool accent appears only on the primary action,
active nav, focus rings, and accent badges. The result reads as precise and tool-like, not brand-loud.

**Color.**
- A 10-step neutral ramp (`gray-950 → white`) does the heavy lifting. Light mode = white page,
  `gray-50` surfaces; dark mode inverts the ramp (`gray-950` page, `gray-900` surfaces).
- **Primary buttons are neutral, not accent** — black in light mode, white in dark mode. The
  accent is reserved for the *one* moment that matters per view, plus links and selection.
- Status colors (green/red/amber/blue) are **identical in both modes** and always appear as a
  solid + a tinted `-50` background pair.
- All color flows through three layers: **primitive → semantic → theme**. Components never touch
  primitives; tools only ever override the two accent tokens.

**Type.** Inter (variable, self-hosted) for everything; JetBrains Mono for code/metadata.
Display weights are **medium (500)**, not bold — tightened tracking (`-0.3 to -0.5px`) gives
headings a crisp, modern set without heaviness. Body is 400 at a comfortable 1.6 line-height.
The `label-md` uppercase + `+0.04em` style is the recurring typographic signature.

**Spacing & layout.** Strict 4px base scale (`space-1 … space-10`). 12-column grid, 24px gutter,
32px margin, 1200px max content width, fixed **220px** sidebar, fluid main. Layouts are
calm and aligned — lots of air, no cramped clusters.

**Borders.** Hairline **0.5px** solid borders everywhere, color = `border-default`. This is a
deliberate, refined detail — borders define structure so shadows can stay subtle.

**Corners.** Purposeful radius ladder: input 6 · button 8 · icon-container 10 · card 12 ·
modal 16 · logo 16 · pill/badge 999. Bigger surfaces get rounder corners.

**Elevation / shadows.** A restrained 4-step system, all pure-black at low opacity
(`0.08 → 0.16`). Cards sit at level-1, floating panels/menus at level-2, modals at level-3.
No colored or glowing shadows. **No inner shadows.** Surfaces are separated by border + a faint
drop shadow, never by heavy depth.

**Backgrounds.** Flat solid fills only — `bg-page` / `bg-surface`. **No gradients, no textures,
no patterns, no background imagery, no noise/grain.** The cube logo is the only illustrative
element. Imagery, where present (avatars), is full-color photographic and incidental.

**Transparency & blur.** Used sparingly and only functionally: the modal scrim is
`rgba(17,17,17,0.45)`; focus rings are an accent at 40% (light) / 50% (dark) opacity. No
frosted-glass / backdrop-blur decoration.

**Motion.** Three durations (120 / 180 / 300ms) on one easing curve
`cubic-bezier(0.16, 1, 0.3, 1)` — a soft, fast-out-slow-in "ease-out-expo" feel. Transitions
fade and slide; nothing bounces. **Hard rule: interactive states change only color, opacity, or
border — never size or position. Zero layout shift on hover/active/focus.**

**Interaction states.**
- **Hover:** primary → darker neutral (`gray-800`); secondary/ghost → faint `gray-50` surface
  fill; accent/danger → 90% opacity. Color only.
- **Focus:** 3px ring using `border-focus` (accent at 40/50% opacity) + a solid border-color
  shift on inputs. Always visible, keyboard-first.
- **Active/press:** color deepens; **no shrink/scale** (per the no-motion-on-size rule).
- **Disabled:** muted surface + `text-disabled`, `cursor: not-allowed`.

**Cards.** White/raised surface, 0.5px border, 12px radius, optional level-1 shadow. Three
optional slots (header / body / footer) divided by hairline borders. Never a colored left-border
accent stripe; never a heavy drop shadow.

---

## ICONOGRAPHY

> ⚠️ **Substitution flagged.** The backend repo ships **no icon set, font, or SVG sprite**, and
> none was supplied. This system uses **[Lucide](https://lucide.dev)** — the closest match to the
> brand's minimal, geometric register (consistent 24px grid, ~2px round-cap strokes, outline
> style). Swap to an official set if/when Omnyvora adopts one.

- **Style:** line/outline icons, **~2px stroke**, round caps & joins, no fills, no duotone.
  Visually consistent with the hairline borders and medium-weight type.
- **Sizing:** 15–16px inline (buttons, menu items, inputs), 18px in toasts, 24px in empty-state
  icon containers. Keep stroke weight visually constant by lowering `stroke-width` slightly at
  larger sizes (e.g. 1.75 at 24px).
- **Color:** icons inherit `currentColor`. Default to `text-tertiary` for decorative/inline
  icons, `text-secondary` on hover, accent or status colors only when the icon *is* the meaning
  (toast type, delta direction, danger menu item).
- **Icon containers:** 10px-radius (`--radius-icon`) tinted squares for feature/empty-state icons.
- **The cube mark is not an icon** — it's the logo; never recolor it to an accent or use it inline
  in text. Use `assets/logo-mark-black.png` (light) / `assets/logo-mark-white.png` (dark).
- **No emoji, no unicode glyphs as icons.** Ever.

How icons load here: cards inline Lucide SVG paths directly; the UI kit links Lucide from CDN
(`unpkg.com/lucide`). For production, install `lucide` / `lucide-react`.

---

## INDEX — what's in this system

**Foundations**
- `colors_and_type.css` — all tokens: primitives → semantic (light + dark) → per-tool theme,
  full type scale, spacing, radius, shadow, motion, grid. Self-hosted `@font-face` for Inter +
  JetBrains Mono. **Start here.**
- `components.css` — the component layer (`.btn`, `.input`, `.badge`, `.card`, `.avatar`,
  `.switch`, `.menu`, `.toast`, `.stat`, …). Every value resolves to a semantic token.

**Assets** — `assets/`
- `logo-lightmode-original.png` — black cubes (light mode) · `logo-darkmode-original.png` — white cubes on #111111 (dark mode). **Supplied source artwork.**
- `logo-mark-black.png` / `logo-mark-white.png` — transparent two-color marks derived from the originals; use these for inline lockups beside text.

**Fonts** — `fonts/` — Inter (variable + statics) and JetBrains Mono (variable + statics),
self-hosted.

**Design System tab** — `preview/` — 34 spec cards (colors, type, spacing, brand, components),
registered for review.

**UI kit** — `ui_kits/omnyvora-app/` — interactive, click-through recreation of the Omnyvora
app shell (auth → dashboard) demonstrating the components composed into real screens, with a
live light/dark + tool-theme switcher. See its own `README.md`.

**Skill** — `SKILL.md` — makes this folder usable as a downloadable Claude/Agent skill.

---

## Quick start

```html
<html data-theme="light" data-tool="portfolio">
  <link rel="stylesheet" href="colors_and_type.css">
  <link rel="stylesheet" href="components.css">
  ...
  <button class="btn btn--accent">Open project</button>
</html>
```

- Toggle mode: `data-theme="light" | "dark"`.
- Toggle tool: `data-tool="portfolio" | "photo" | "productivity"`.
- Both can be set on `<html>` or any wrapper, and **nested** (a dark page can hold a light card).
