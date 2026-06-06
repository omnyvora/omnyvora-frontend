import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Omnyvora", template: "%s | Omnyvora" },
  description: "Your workspace for creative tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme="light" activates the design system's light semantic tokens.
    // Toggle to "dark" here (or via client-side JS) to activate dark mode.
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
