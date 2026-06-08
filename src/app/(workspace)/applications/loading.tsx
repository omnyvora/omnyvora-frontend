export default function Loading() {
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "0 auto", padding: "36px 40px", display: "flex", flexDirection: "column", gap: 28 }}>
      <div className="skel" style={{ height: 56, width: 280 }} />
      <div style={{ display: "flex", gap: 8 }}>
        {[1, 2, 3, 4].map((i) => <div key={i} className="skel" style={{ height: 32, width: 80, borderRadius: "999px" }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skel" style={{ height: 180 }} />)}
      </div>
    </div>
  );
}
