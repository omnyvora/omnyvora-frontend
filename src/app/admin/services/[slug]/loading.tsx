export default function Loading() {
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "0 auto", padding: "36px 40px", display: "flex", flexDirection: "column", gap: 28 }}>
      <div className="skel" style={{ height: 56, width: 280 }} />
      <div className="skel" style={{ height: 260 }} />
    </div>
  );
}
