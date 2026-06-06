import { ServiceThemeProvider } from "@/core/design/ServiceThemeProvider";

export default function ImageEnhancerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ServiceThemeProvider service="image-enhancer">
      {children}
    </ServiceThemeProvider>
  );
}
