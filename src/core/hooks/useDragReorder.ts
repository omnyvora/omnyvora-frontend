"use client";

import { useRef } from "react";

// Native HTML5 drag reorder — no drag library. Operates on the id list itself:
// on drop, computes the full reordered id array and hands it to the caller,
// which is expected to fire the reorder mutation (typically optimistic).
export function useDragReorder(orderedIds: number[], onReorder: (orderedIds: number[]) => void) {
  const dragIndex = useRef<number | null>(null);

  return {
    onDragStart: (i: number) => () => { dragIndex.current = i; },
    onDragOver: () => (e: React.DragEvent) => e.preventDefault(),
    onDrop: (i: number) => (e: React.DragEvent) => {
      e.preventDefault();
      const from = dragIndex.current;
      dragIndex.current = null;
      if (from === null || from === i) return;

      const next = [...orderedIds];
      const [moved] = next.splice(from, 1);
      // from is a valid index into the pre-splice array, so moved always
      // exists — this guard only satisfies strict array-destructure typing.
      if (moved === undefined) return;
      next.splice(i, 0, moved);
      onReorder(next);
    },
  };
}
