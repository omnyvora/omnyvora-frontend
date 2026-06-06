"use client";

// Sets data-service on a layout wrapper to activate service-level CSS token overrides.
// Only --accent-primary and --accent-subtle swap per service — everything else is global.
// className="contents" makes this wrapper invisible to flexbox/grid — layout is not affected.

export type ServiceName = "cv-builder" | "portfolio" | "image-enhancer";

interface Props {
  service: ServiceName;
  children: React.ReactNode;
}

export function ServiceThemeProvider({ service, children }: Props) {
  return (
    <div data-service={service} className="contents">
      {children}
    </div>
  );
}
