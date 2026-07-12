# Claude Design Prompt — Omnyvora Landing Page

> Paste everything below the divider directly into [claude.ai/design](https://claude.ai/design)
> inside the existing Omnyvora design canvas (the `omnyvora-design` skill / `omnyvora_design_system`
> is already loaded there — tokens, type, spacing, components, icon set, and voice are established).
> This prompt intentionally contains **no colors, fonts, spacing, or component styling** — only
> content, structure, and layout/positioning. Apply the existing design system to everything below.

---

Design the public marketing landing page for **Omnyvora** — the route is `/`, served
statically (SSG) for SEO. This is the first page a non-logged-in visitor sees. Its one job:
convince a visitor to create a free account and open a tool. Use the `data-tool="productivity"`
(neutral/default) theme for all shared chrome, and switch `data-tool` locally only inside the
tool-showcase cards so each card previews its own tool's accent.

## What Omnyvora is (for accurate copy)

Omnyvora is a multi-tool workspace: one account, one shell, several standalone tools that share
identity, profile, and notifications. Today it ships three live tools — design the page to also
signal the platform is built to keep adding more.

| Tool | Accent (existing token) | What it does |
|---|---|---|
| **CV Builder** | `data-tool="productivity"` (blue) | Build and format resumes/CVs with guided sections, then export to PDF. |
| **Portfolio** | `data-tool="portfolio"` (purple) | Turn work samples into a shareable portfolio site — no code required. |
| **Image Enhancer** | `data-tool="photo"` (teal) | Clean up, sharpen, and upscale photos for use across resumes, portfolios, and profiles. |

Do not invent additional tools, customer names, testimonials, review scores, or usage stats —
none exist yet. Where social proof would normally go, use honest, unverifiable-claim-free lines
("Free to start", "No credit card required") instead of fabricated numbers or logos.

Voice: precise, calm, verb-first, no hype, no exclamation marks, no emoji — matches the rest of
the product (already defined in the design system's content-fundamentals section). Every heading
and CTA you write should follow that voice.

## Page structure, top to bottom

Build these sections, in this order, each as a distinct semantic `<section>`:

### 1. Header (sticky, full-width)
- Left: Omnyvora cube logo (wordmark optional).
- Center-left: nav links — `Tools`, `How it works`, `FAQ`.
- Right: `Log in` (secondary/ghost button) + `Get started free` (primary button).
- Single row, logo and nav left-aligned within the max-width container, actions pinned right.
- Collapses to logo + hamburger menu on mobile; nav links and both CTAs move into the drawer.

### 2. Hero
- Two-column split on desktop: copy on the left (~55% width), product visual on the right (~45%).
- Left column, top to bottom: small eyebrow label above the headline, one H1 (the single H1 on
  the page — must state the core value prop: one workspace, multiple tools, for building career
  and creative material), one supporting sentence (1–2 lines max), primary CTA button
  (`Get started free`) + secondary CTA (`See the tools` — anchor-scrolls to section 4), one small
  trust line beneath the buttons (e.g. "Free to start · No credit card required").
- Right column: a single product visual — a mockup of the workspace dashboard or the three tool
  cards fanned out. No stock photography, no illustration clutter — one clear artifact.
- Stacks to a single column on mobile: copy first, visual below it, both CTAs full-width and
  stacked.

### 3. Value strip (optional, thin)
- A single thin row directly under the hero with 3 short inline stats/claims, not fabricated
  numbers — phrase as capabilities, e.g. "3 tools, one login", "Export in seconds", "Your work,
  synced everywhere." Three items in a row on desktop, stacked on mobile. Skip this section
  entirely if it makes the hero feel crowded — it's a nice-to-have, not load-bearing.

### 4. Tools showcase — the core section of this page
- Eyebrow label + H2 introducing the idea that one account unlocks every tool.
- A 3-column grid on desktop (1 column on mobile, 2 on tablet), one card per live tool
  (CV Builder, Portfolio, Image Enhancer), equal height, equal width.
- Each card, top to bottom: tool's icon inside an accent-tinted icon container (use that tool's
  own accent token, not the page default), tool name, one-line description (use the descriptions
  in the table above, tightened to one sentence), a text link at the bottom of the card
  (`Explore CV Builder →` etc.) that would route to that tool's detail/entry point.
- Add a 4th slot, visually distinct (dashed border / muted, not a live accent) reading something
  like "More tools on the way" — signals the platform is actively expanding without promising
  specifics or dates.
- Whole cards are clickable, not just the link text.

### 5. How it works
- Eyebrow label + H2.
- Three numbered steps in a horizontal row on desktop (connected by a thin line), stacked
  vertically on mobile: `1. Create your account` → `2. Pick a tool` → `3. Build and export`.
  One short sentence under each step, no icons required (numbers carry the sequence).

### 6. Why Omnyvora (benefits)
- Eyebrow label + H2.
- A 2×2 or 4-across grid of short benefit tiles, each: small icon, short bolded heading (2–4
  words), one supporting sentence. Suggested set (adjust wording, keep the ideas): one account
  for every tool, work stays in sync across tools, export/share wherever you need it, free to
  start.

### 7. FAQ
- Eyebrow label + H2 ("Frequently asked questions" or similar).
- Single-column accordion, centered, narrower than full page width (roughly 700–800px reading
  width on desktop, full-width on mobile). 5–6 questions targeting real intent, e.g.:
  - Is Omnyvora free to use?
  - Do I need design experience to build a portfolio?
  - Can I export my resume as a PDF?
  - Do the tools share my data, or are they separate?
  - What happens to my files if I stop using a tool?
- Answers are 1–3 sentences, same terse voice as the rest of the product.

### 8. Final call-to-action band
- Full-width band, visually distinct from the page background (a flat filled section, not a
  gradient), centered content: one short H2 restating the value prop, one primary CTA button
  (`Get started free`). No secondary button here — single decisive action.

### 9. Footer
- Multi-column layout on desktop (4–5 columns), collapsing to stacked/accordion groups on
  mobile. Suggested columns: **Product** (links to each of the 3 tools + an "All tools" link),
  **Company** (About, Contact), **Legal** (Privacy, Terms), **Account** (Log in, Get started).
  Bottom row beneath the columns: logo mark, one-line tagline, copyright line.

## Layout/positioning rules that apply across the whole page

- Every section shares one centered max-width content container and consistent vertical rhythm
  between sections — no section should visually crowd the next.
- Exactly one H1 (hero headline). Every other section headline is an H2; sub-points inside a
  section are H3. Never skip a heading level.
- All primary CTAs on the page use identical copy (`Get started free`) so the action reads as one
  consistent path, not several different offers.
- Nothing on the page should require JavaScript to be readable — accordions/menus enhance,
  they don't gate content (server-rendered content underneath).

## SEO requirements (apply directly, not optional polish)

- `<title>` (50–60 characters) and meta description (150–160 characters) targeting the core
  intent: one workspace with a resume/CV builder, portfolio builder, and image enhancer.
- Open Graph + Twitter Card meta (title, description, one representative image).
- Structured data (JSON-LD): `Organization`, `WebSite`, and `FAQPage` — the `FAQPage` entries must
  match the visible FAQ copy exactly (no hidden/duplicate content for crawlers).
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, one `<section>` per block above with an
  `aria-labelledby` pointing at its own heading, `<footer>`.
- Every tool card links to a real, crawlable internal URL (not a JS-only click handler) so search
  engines can discover and index each tool's own page.
- Descriptive `alt` text on every image (the hero product visual, any icons rendered as `<img>`);
  no filler like "image" or "screenshot".
- CTA link/button text is descriptive on its own ("Get started free", "Explore CV Builder") —
  never "click here" / "learn more" with no context.
- Design for a fast first paint: one hero visual, no autoplay video, no heavy background imagery
  (also consistent with the design system's flat-background rule) — this page's Core Web Vitals
  matter directly for ranking.
