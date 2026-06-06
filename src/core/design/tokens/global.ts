// Single source of truth for all global design decisions.
// Values sourced from: ui_ux/omnyvora_design_system/colors_and_type.css v1.0
// Changing a value here affects the entire product immediately.

export const globalTokens = {

  // ── Primitive palette ────────────────────────────────────────────────────
  primitives: {
    // 10-step neutral ramp
    gray950: "#111111",
    gray900: "#1A1A1A",
    gray800: "#2A2A2A",
    gray700: "#444444",
    gray500: "#666666",
    gray400: "#999999",
    gray200: "#CCCCCC",
    gray100: "#E8E8E8",
    gray50:  "#F6F6F6",
    white:   "#FFFFFF",

    // Status — identical in both modes
    green500: "#1DB37B", green50: "#DCFCE7",
    red500:   "#E5484D", red50:   "#FFE4E6",
    amber500: "#F5A623", amber50: "#FEF3C7",
    info500:  "#3B82F6", info50:  "#DBEAFE",

    // Accent families — only two tokens swap per tool
    purple600: "#534AB7", purple50: "#EEEDFE", purple900: "#1A1830",
    teal600:   "#0D9488", teal50:   "#CCFBF1", teal900:   "#0A2420",
    blue600:   "#2563EB", blue50:   "#DBEAFE", blue900:   "#0F1E40",
    // Account shell — indigo: trust, security, stability
    indigo600: "#4F46E5", indigo50: "#EEF0FF", indigo900: "#161634",
  },

  // ── Typography ───────────────────────────────────────────────────────────
  typography: {
    fontSans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',

    // Size scale
    displayLgSize: "32px",
    displayMdSize: "24px",
    displaySmSize: "20px",
    bodyLgSize:    "16px",
    bodyMdSize:    "14px",
    bodySmSize:    "13px",
    labelLgSize:   "13px",
    labelMdSize:   "11px",
    captionSize:   "11px",
    codeSize:      "13px",

    // Weight scale — display is medium (500), not bold
    displayLgWeight: "500",
    displayMdWeight: "500",
    displaySmWeight: "500",
    bodyLgWeight:    "400",
    bodyMdWeight:    "400",
    bodySmWeight:    "400",
    labelLgWeight:   "500",
    labelMdWeight:   "500",
    captionWeight:   "400",
    codeWeight:      "400",

    // Line-height scale
    displayLgLh: "1.15",
    displayMdLh: "1.2",
    displaySmLh: "1.25",
    bodyLgLh:    "1.6",
    bodyMdLh:    "1.6",
    bodySmLh:    "1.5",
    labelLgLh:   "1.4",
    labelMdLh:   "1.4",
    captionLh:   "1.5",

    // Letter-spacing — tightened on display; label-md is the signature uppercase accent
    displayLgTracking: "-0.5px",
    displayMdTracking: "-0.4px",
    displaySmTracking: "-0.3px",
    labelLgTracking:   "0.01em",
    labelMdTracking:   "0.04em",
  },

  // ── Spacing (4px base, 10 steps) ─────────────────────────────────────────
  spacing: {
    space1:  "4px",
    space2:  "8px",
    space3:  "12px",
    space4:  "16px",
    space5:  "20px",
    space6:  "24px",
    space7:  "32px",
    space8:  "40px",
    space9:  "48px",
    space10: "64px",
  },

  // ── Radii — purposeful ladder, larger surfaces get rounder corners ────────
  radii: {
    input:   "6px",
    button:  "8px",
    icon:    "10px",
    card:    "12px",
    modal:   "16px",
    logo:    "16px",
    tooltip: "6px",
    pill:    "999px",
  },

  // ── Border ───────────────────────────────────────────────────────────────
  borderWidth: "0.5px",

  // ── Shadows — restrained 4-step system, pure black at low opacity ─────────
  shadows: {
    shadow0: "none",
    shadow1: "0 1px 3px rgba(0,0,0,0.08)",
    shadow2: "0 4px 16px rgba(0,0,0,0.12)",
    shadow3: "0 8px 32px rgba(0,0,0,0.16)",
  },

  // ── Motion — one easing curve, three durations ────────────────────────────
  transitions: {
    durationFast: "120ms",
    durationBase: "180ms",
    durationSlow: "300ms",
    // Soft fast-out-slow-in: transitions fade/slide, nothing bounces
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  },

  // ── Layout grid ──────────────────────────────────────────────────────────
  layout: {
    gridColumns:  "12",
    gridGutter:   "24px",
    gridMargin:   "32px",
    contentMax:   "1200px",
    sidebarWidth: "220px",
  },

  // ── Semantic tokens — light mode ─────────────────────────────────────────
  light: {
    bgPage:           "#FFFFFF",
    bgSurface:        "#F6F6F6",
    bgSurfaceRaised:  "#FFFFFF",
    bgOverlay:        "#FFFFFF",
    borderDefault:    "#E8E8E8",
    borderStrong:     "#CCCCCC",
    textPrimary:      "#111111",
    textSecondary:    "#666666",
    textTertiary:     "#999999",
    textDisabled:     "#CCCCCC",
    textOnAccent:     "#FFFFFF",
    btnPrimaryBg:     "#111111",
    btnPrimaryText:   "#FFFFFF",
    btnPrimaryHover:  "#2A2A2A",
    btnSecondaryBg:       "#FFFFFF",
    btnSecondaryBorder:   "#E8E8E8",
    btnSecondaryText:     "#444444",
    btnSecondaryHoverBg:  "#F6F6F6",
    inputBg:          "#FFFFFF",
    inputBorder:      "#E8E8E8",
    inputBorderFocus: "#444444",
    inputText:        "#111111",
    inputPlaceholder: "#999999",
  },

  // ── Semantic tokens — dark mode ──────────────────────────────────────────
  dark: {
    bgPage:           "#111111",
    bgSurface:        "#1A1A1A",
    bgSurfaceRaised:  "#2A2A2A",
    bgOverlay:        "#1A1A1A",
    borderDefault:    "#2A2A2A",
    borderStrong:     "#444444",
    textPrimary:      "#F6F6F6",
    textSecondary:    "#999999",
    textTertiary:     "#666666",
    textDisabled:     "#444444",
    textOnAccent:     "#FFFFFF",
    btnPrimaryBg:     "#F6F6F6",
    btnPrimaryText:   "#111111",
    btnPrimaryHover:  "#CCCCCC",
    btnSecondaryBg:       "#1A1A1A",
    btnSecondaryBorder:   "#2A2A2A",
    btnSecondaryText:     "#999999",
    btnSecondaryHoverBg:  "#2A2A2A",
    inputBg:          "#111111",
    inputBorder:      "#2A2A2A",
    inputBorderFocus: "#999999",
    inputText:        "#F6F6F6",
    inputPlaceholder: "#666666",
  },

  // ── Status — identical in both modes ─────────────────────────────────────
  status: {
    success:   "#1DB37B", successBg:  "#DCFCE7",
    error:     "#E5484D", errorBg:    "#FFE4E6",
    warning:   "#F5A623", warningBg:  "#FEF3C7",
    info:      "#3B82F6", infoBg:     "#DBEAFE",
  },

  // ── Default accent — account/dashboard shell (indigo) ─────────────────────
  defaultAccent: {
    primary:    "#4F46E5",
    subtle:     "#EEF0FF",
    subtleDark: "#161634",
    text:       "#4F46E5",
  },

} as const;

export type GlobalTokens = typeof globalTokens;
