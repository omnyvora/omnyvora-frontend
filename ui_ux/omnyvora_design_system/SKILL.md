---
name: omnyvora-design
description: Use this skill to generate well-branded interfaces and assets for Omnyvora, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

Omnyvora is a multi-tool SaaS platform with one shared visual language. Its defining rule:
**a tool re-skins itself by swapping only two tokens — `accent-primary` and `accent-subtle`.**
Everything else (type, spacing, components, elevation, motion) stays identical. Honor this when
designing: reach for the neutral ramp + semantic tokens first, and let the single accent carry
only the primary action, active nav, focus rings, and accent badges.

Key files:
- `colors_and_type.css` — all design tokens (primitive → semantic light/dark → per-tool accent),
  type scale, spacing, radius, shadow, motion. Self-hosted Inter + JetBrains Mono. **Import first.**
- `components.css` — the component layer (button, input, badge, card, avatar, switch, menu, toast,
  stat, divider, tooltip, skeleton, empty state). All values resolve to semantic tokens.
- `assets/` — two-color cube logo marks (black for light, white for dark) + originals.
- `fonts/` — Inter and JetBrains Mono.
- `preview/` — small spec cards for every foundation + component.
- `ui_kits/omnyvora-app/` — interactive React recreation of the app shell; copy components from here.

Usage:
- Set `data-theme="light|dark"` and `data-tool="portfolio|photo|productivity"` on `<html>` or any
  wrapper (they nest). Then use the `.btn`, `.input`, `.card`, … classes.
- If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create
  static HTML files for the user to view. If working on production code, copy assets and read the
  rules here to become an expert in designing with this brand.
- If the user invokes this skill without other guidance, ask them what they want to build, ask a
  few clarifying questions, and act as an expert designer who outputs HTML artifacts _or_
  production code, depending on the need.

Hard rules from the brand: no emoji; no gradients/textures/background imagery; hairline 0.5px
borders; restrained black-only shadows; interactive states change only color/opacity/border —
never size or position (zero layout shift). Icons are Lucide-style line icons (a flagged
substitution — see README).
