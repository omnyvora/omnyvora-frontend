// Service-level token overrides for CV Builder.
// Maps to the "productivity" tool in the Omnyvora design system.
// Accent: blue-600 — productivity, focus, precision.
// Source: ui_ux/omnyvora_design_system/colors_and_type.css → [data-tool="productivity"]
// Only these 2 tokens change; everything else inherits globalTokens.

export const cvBuilderTokens = {
  accentPrimary:    "#2563EB", // --blue-600
  accentSubtle:     "#DBEAFE", // --blue-50  (light mode)
  accentSubtleDark: "#0F1E40", // --blue-900 (dark mode)
  accentText:       "#2563EB", // --blue-600 (light) · color-mix with #fff in dark
} as const;
