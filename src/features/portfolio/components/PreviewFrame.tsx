"use client";

interface PreviewFrameProps {
  html:     string | undefined;
  loading:  boolean;
  error:    string | null;
  height?:  number | string;
  width?:   number | string;
}

export function PreviewFrame({ html, loading, error, height = "100%", width = "100%" }: PreviewFrameProps) {
  if (loading) {
    return <div className="skel" style={{ height, width, borderRadius: "var(--radius-card)" }} />;
  }

  if (error) {
    return (
      <div
        style={{
          height, width, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24, textAlign: "center", borderRadius: "var(--radius-card)",
          border: "0.5px solid var(--status-error)", color: "var(--status-error)",
          font: "400 13px var(--font-sans)",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <iframe
      title="Portfolio preview"
      srcDoc={html ?? ""}
      // The rendered page is admin-authored template HTML filled with user data.
      // It is already autoescaped server-side, but it still runs in the viewer's
      // origin if unsandboxed — allow-scripts only, never allow-same-origin.
      sandbox="allow-scripts"
      style={{
        width, height, border: "0.5px solid var(--border-default)",
        borderRadius: "var(--radius-card)", background: "#fff", display: "block",
      }}
    />
  );
}
