"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import type { UserTechnologyUI } from "../transformers";
import { ProficiencySlider } from "./ProficiencySlider";

interface TechnologyRowProps {
  technology:  UserTechnologyUI;
  onCommit:    (proficiency: number) => void;
  onRemove:    () => void;
  isRemoving:  boolean;
}

export function TechnologyRow({ technology, onCommit, onRemove, isRemoving }: TechnologyRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: technology.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 12px",
        border: "0.5px solid var(--border-default)",
        borderRadius: "var(--radius-card)",
        background: "var(--bg-surface-raised)",
      }}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="btn btn--ghost btn--sm"
        style={{ width: 28, padding: 0, cursor: "grab", touchAction: "none" }}
      >
        <GripVertical size={15} />
      </button>

      <span style={{ width: 140, flex: "none", font: "500 14px var(--font-sans)", color: "var(--text-primary)" }}>
        {technology.name}
      </span>

      {/* Auto-synced entries (tagged on a project/experience but never manually rated) start at 0 */}
      <ProficiencySlider value={technology.proficiency ?? 0} onCommit={onCommit} disabled={isRemoving} />

      <button
        type="button"
        onClick={onRemove}
        disabled={isRemoving}
        aria-label={`Remove ${technology.name}`}
        className="btn btn--ghost btn--sm"
        style={{ width: 28, padding: 0, flex: "none", color: "var(--text-tertiary)" }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
