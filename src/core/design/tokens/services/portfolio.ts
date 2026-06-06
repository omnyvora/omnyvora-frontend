// Service-level token overrides for Portfolio.
// Maps to the "portfolio" tool in the Omnyvora design system.
// Accent: purple-600 — creativity, identity, expression.
// Source: ui_ux/omnyvora_design_system/colors_and_type.css → [data-tool="portfolio"]
// Only these 2 tokens change; everything else inherits globalTokens.

export const portfolioTokens = {
  accentPrimary:    "#534AB7", // --purple-600
  accentSubtle:     "#EEEDFE", // --purple-50  (light mode)
  accentSubtleDark: "#1A1830", // --purple-900 (dark mode)
  accentText:       "#534AB7", // --purple-600 (light) · color-mix with #fff in dark
} as const;
