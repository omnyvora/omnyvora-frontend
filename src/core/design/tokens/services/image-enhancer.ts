// Service-level token overrides for Image Enhancer.
// Maps to the "photo" tool in the Omnyvora design system.
// Accent: teal-600 — clarity, processing, technical.
// Source: ui_ux/omnyvora_design_system/colors_and_type.css → [data-tool="photo"]
// Only these 2 tokens change; everything else inherits globalTokens.

export const imageEnhancerTokens = {
  accentPrimary:    "#0D9488", // --teal-600
  accentSubtle:     "#CCFBF1", // --teal-50  (light mode)
  accentSubtleDark: "#0A2420", // --teal-900 (dark mode)
  accentText:       "#0D9488", // --teal-600 (light) · color-mix with #fff in dark
} as const;
