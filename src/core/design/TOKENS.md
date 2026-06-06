# Omnyvora Token System

All values are sourced from the Omnyvora design file:
`ui_ux/omnyvora_design_system/colors_and_type.css` v1.0

---

## Architecture

```
Primitive tokens  (raw hex — never used in components)
      ↓
Semantic tokens   (light/dark — what components reference)
      ↓
Service tokens    (accent only — 2 vars swap per service)
      ↓
Tailwind @theme   (utility names → CSS vars)
      ↓
shadcn bridge     (--background, --foreground … → semantic vars)
```

---

## Editing rules

| To change | Edit | Then update |
|-----------|------|-------------|
| A global color/shadow/radius | `tokens/global.ts` | `globals.css` matching block |
| A service accent | `tokens/services/<name>.ts` | `globals.css` `[data-service]` block |
| Add a new service | New file in `tokens/services/` | New `[data-service]` block + new `ServiceName` union |

**Never hardcode a color, font, radius, or shadow in any component file.**  
**Never use `style={{ }}` with raw values.**

---

## Global CSS variables — primitives

| Variable | Value | Notes |
|----------|-------|-------|
| `--gray-950` | `#111111` | Page bg (dark), primary text (light) |
| `--gray-900` | `#1A1A1A` | Surface (dark) |
| `--gray-800` | `#2A2A2A` | Surface raised (dark), btn primary hover (light) |
| `--gray-700` | `#444444` | Btn secondary text (light), border strong (dark) |
| `--gray-500` | `#666666` | Text secondary (light), text tertiary (dark) |
| `--gray-400` | `#999999` | Text tertiary (light), text secondary (dark) |
| `--gray-200` | `#CCCCCC` | Text disabled (light), btn primary hover (dark) |
| `--gray-100` | `#E8E8E8` | Border default (light), input border (light) |
| `--gray-50` | `#F6F6F6` | Bg surface (light), btn primary bg (dark) |
| `--white` | `#FFFFFF` | Bg page (light) |
| `--green-500` | `#1DB37B` | Status success |
| `--green-50` | `#DCFCE7` | Status success background |
| `--red-500` | `#E5484D` | Status error / destructive |
| `--red-50` | `#FFE4E6` | Status error background |
| `--amber-500` | `#F5A623` | Status warning |
| `--amber-50` | `#FEF3C7` | Status warning background |
| `--info-500` | `#3B82F6` | Status info |
| `--info-50` | `#DBEAFE` | Status info background |
| `--purple-600` | `#534AB7` | Portfolio accent |
| `--purple-50` | `#EEEDFE` | Portfolio accent subtle (light) |
| `--purple-900` | `#1A1830` | Portfolio accent subtle (dark) |
| `--teal-600` | `#0D9488` | Image Enhancer accent |
| `--teal-50` | `#CCFBF1` | Image Enhancer accent subtle (light) |
| `--teal-900` | `#0A2420` | Image Enhancer accent subtle (dark) |
| `--blue-600` | `#2563EB` | CV Builder accent |
| `--blue-50` | `#DBEAFE` | CV Builder accent subtle (light) |
| `--blue-900` | `#0F1E40` | CV Builder accent subtle (dark) |
| `--indigo-600` | `#4F46E5` | Platform shell / dashboard accent |
| `--indigo-50` | `#EEF0FF` | Platform shell accent subtle (light) |
| `--indigo-900` | `#161634` | Platform shell accent subtle (dark) |

---

## Global CSS variables — type scale

| Variable | Value | Notes |
|----------|-------|-------|
| `--font-sans` | `"Inter", -apple-system…` | Self-hosted variable font |
| `--font-mono` | `"JetBrains Mono", ui-monospace…` | Self-hosted variable font |
| `--display-lg-size` | `32px` | weight 500, lh 1.15, tracking -0.5px |
| `--display-md-size` | `24px` | weight 500, lh 1.2, tracking -0.4px |
| `--display-sm-size` | `20px` | weight 500, lh 1.25, tracking -0.3px |
| `--body-lg-size` | `16px` | weight 400, lh 1.6 |
| `--body-md-size` | `14px` | weight 400, lh 1.6 (body default) |
| `--body-sm-size` | `13px` | weight 400, lh 1.5 |
| `--label-lg-size` | `13px` | weight 500, tracking 0.01em |
| `--label-md-size` | `11px` | weight 500, tracking 0.04em, UPPERCASE (brand signature) |
| `--caption-size` | `11px` | weight 400, lh 1.5 |
| `--code-size` | `13px` | JetBrains Mono, weight 400 |

---

## Global CSS variables — spacing, radius, shadow, motion

| Variable | Value | Controls |
|----------|-------|---------|
| `--space-1…--space-10` | `4px … 64px` | 4px base scale |
| `--radius-input` | `6px` | Text inputs, selects |
| `--radius-button` | `8px` | Buttons, tags |
| `--radius-icon` | `10px` | Icon containers |
| `--radius-card` | `12px` | Cards, menus, toasts |
| `--radius-modal` | `16px` | Modals, logo container |
| `--radius-pill` | `999px` | Badges, avatars |
| `--border-width` | `0.5px` | All hairline borders |
| `--shadow-0` | `none` | Flat |
| `--shadow-1` | `0 1px 3px rgba(0,0,0,0.08)` | Cards (level 1) |
| `--shadow-2` | `0 4px 16px rgba(0,0,0,0.12)` | Menus, floating panels |
| `--shadow-3` | `0 8px 32px rgba(0,0,0,0.16)` | Modals |
| `--duration-fast` | `120ms` | Hover, focus |
| `--duration-base` | `180ms` | Transitions |
| `--duration-slow` | `300ms` | Enter/exit animations |
| `--ease` | `cubic-bezier(0.16,1,0.3,1)` | All transitions (ease-out-expo) |

---

## Service-level overrides

Only `--accent-primary`, `--accent-subtle`, and `--accent-text` change per service.

| Service | Attribute | Accent | Primitive |
|---------|-----------|--------|-----------|
| Platform shell / dashboard | *(none — default)* | Indigo | `#4F46E5` |
| CV Builder | `data-service="cv-builder"` | Blue | `#2563EB` |
| Portfolio | `data-service="portfolio"` | Purple | `#534AB7` |
| Image Enhancer | `data-service="image-enhancer"` | Teal | `#0D9488` |

Dark mode lightens `--accent-text` via `color-mix()` for legibility on dark surfaces.

---

## Values flagged as absent / decisions made

| Decision | Reason |
|----------|--------|
| Dashboard uses indigo (account shell) as default accent | Design system README explicitly defines the account shell as indigo for "authentication, account management, dashboard" |
| CV Builder maps to `productivity` tool (blue) | Closest semantic match from the 3 defined tool accents; CV building = productivity |
| `next-themes` removed from sonner.tsx | Design system uses `data-theme` attribute, not a React context; replaced with MutationObserver |
| `data-theme` on `<html>` instead of `.dark` class | Exact convention from design system quick-start |
| No spacing present in `@theme` as Tailwind utilities | Tailwind v4's default spacing scale (rem-based) is separate from design system px values; both coexist — use `var(--space-*)` directly in components for pixel-precise values |
