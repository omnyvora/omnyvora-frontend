export default function Loading() {
  return (
    <div style={{ padding: "36px 40px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="skel" style={{ height: 56, width: 320 }} />
      <div className="skel" style={{ height: 190 }} />
      <div className="skel" style={{ height: 190 }} />
    </div>
  );
}
