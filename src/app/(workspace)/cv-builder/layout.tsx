import { ServiceThemeProvider } from "@/core/design/ServiceThemeProvider";

export default function CvBuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <ServiceThemeProvider service="cv-builder">
      {children}
    </ServiceThemeProvider>
  );
}
