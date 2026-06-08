export default function Loading() {
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "0 auto", padding: "36px 40px", display: "flex", flexDirection: "column", gap: 28 }}>
      <div className="skel" style={{ height: 56, width: 200 }} />
      <div style={{ display: "flex", gap: 36 }}>
        <div className="skel" style={{ height: 120, width: 200 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="skel" style={{ height: 38 }} />
          <div className="skel" style={{ height: 38 }} />
        </div>
      </div>
    </div>
  );
}
