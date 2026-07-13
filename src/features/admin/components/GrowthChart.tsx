"use client";

import type { AdminGrowthPointUI } from "../transformers";

interface GrowthChartProps {
  points: AdminGrowthPointUI[];
}

function buildPaths(values: number[], w: number, h: number, pad: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const n = values.length;
  const x = (i: number) => (n === 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (v: number) => h - ((v - min) / range) * (h - pad * 2) - pad;
  const pts = values.map((v, i) => `${x(i).toFixed(1)} ${y(v).toFixed(1)}`);
  const line = "M" + pts.join(" L ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  return { line, area };
}

function formatAxisDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function GrowthChart({ points }: GrowthChartProps) {
  const W = 640;
  const H = 200;
  const PAD = 14;

  if (points.length === 0) {
    return (
      <div
        style={{
          height: H, display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-tertiary)", font: "400 13px var(--font-sans)",
        }}
      >
        Not enough activity yet to show a trend.
      </div>
    );
  }

  const { line, area } = buildPaths(points.map((p) => p.count), W, H, PAD);
  const labelCount = Math.min(5, points.length);
  const labelIdxs = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i / Math.max(1, labelCount - 1)) * (points.length - 1)),
  );

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: H, display: "block" }}>
        <defs>
          <linearGradient id="admin-growth-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <line x1={0} y1={H * 0.2} x2={W} y2={H * 0.2} stroke="var(--border-default)" strokeWidth={1} strokeDasharray="3 4" />
        <line x1={0} y1={H * 0.55} x2={W} y2={H * 0.55} stroke="var(--border-default)" strokeWidth={1} strokeDasharray="3 4" />
        <line x1={0} y1={H * 0.9} x2={W} y2={H * 0.9} stroke="var(--border-default)" strokeWidth={1} strokeDasharray="3 4" />
        <path d={area} fill="url(#admin-growth-area)" />
        <path
          d={line} fill="none" stroke="var(--accent-primary)" strokeWidth={2.5}
          vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"
        />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "0 2px" }}>
        {labelIdxs.map((idx) => (
          <span key={idx} style={{ font: "400 11px var(--font-sans)", color: "var(--text-tertiary)" }}>
            {formatAxisDate(points[idx]?.date ?? "")}
          </span>
        ))}
      </div>
    </div>
  );
}
