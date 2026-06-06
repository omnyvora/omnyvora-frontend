import type { Config } from "tailwindcss";

// Tailwind v4 — theme configuration lives in src/app/globals.css via @theme inline.
// This file handles content paths and any plugins only.
// Color mapping: bg-background → var(--color-background) → var(--bg-page) → runtime value.
// To trace any token: src/core/design/tokens/ → globals.css @theme block → component utility.

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  plugins: [],
};

export default config;
