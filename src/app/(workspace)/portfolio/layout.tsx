import { ServiceThemeProvider } from "@/core/design/ServiceThemeProvider";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <ServiceThemeProvider service="portfolio">
      {children}
    </ServiceThemeProvider>
  );
}
