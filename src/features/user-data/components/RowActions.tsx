"use client";

import { Pencil, Trash2 } from "lucide-react";

interface RowActionsProps {
  onEdit:   () => void;
  onDelete: () => void;
}

export function RowActions({ onEdit, onDelete }: RowActionsProps) {
  return (
    <>
      <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} title="Edit" onClick={onEdit}>
        <Pencil size={15} />
      </button>
      <button className="btn btn--ghost btn--sm" style={{ width: 32, padding: 0 }} title="Remove" onClick={onDelete}>
        <Trash2 size={15} />
      </button>
    </>
  );
}
