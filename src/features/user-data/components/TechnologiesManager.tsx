"use client";

import { useRef, useState } from "react";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Cpu } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import { useDeleteTechnology, useReorderTechnologies, useTechnologies, useUpdateTechnologyProficiency } from "../hooks";
import { groupTechnologiesByCategory, type UserTechnologyUI } from "../transformers";
import { TECHNOLOGY_CATEGORY_LABELS } from "../types";
import { AddTechnologyRow } from "./AddTechnologyRow";
import { TechnologyRow } from "./TechnologyRow";

export function TechnologiesManager() {
  const { data: technologies, isLoading } = useTechnologies();
  const updateProficiency = useUpdateTechnologyProficiency();
  const removeTechnology  = useDeleteTechnology();
  const reorder           = useReorderTechnologies();

  const [pendingRemoval, setPendingRemoval] = useState<UserTechnologyUI | null>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2, 3].map((i) => <div key={i} className="skel" style={{ height: 46 }} />)}
      </div>
    );
  }

  const list = technologies ?? [];
  const existingNames = new Set(list.map((t) => t.name.toLowerCase()));
  const grouped = groupTechnologiesByCategory(list);

  function handleDragEnd(categoryIds: number[]) {
    return (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = categoryIds.indexOf(Number(active.id));
      const newIndex = categoryIds.indexOf(Number(over.id));
      const reorderedCategoryIds = arrayMove(categoryIds, oldIndex, newIndex);

      // Splice the reordered category slice back into the full display_order,
      // leaving every other category's relative order untouched.
      const categorySet = new Set(categoryIds);
      const fullIds = list.map((t) => t.id);
      let cursor = 0;
      const nextFullIds = fullIds.map((id) => (categorySet.has(id) ? (reorderedCategoryIds[cursor++] ?? id) : id));

      reorder.mutate(nextFullIds, {
        onError: () => toast.error("Couldn't save the new order", { description: "Reverted — try again." }),
      });
    };
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <AddTechnologyRow existingNames={existingNames} inputRef={addInputRef} />

      {list.length === 0 ? (
        <EmptyState
          icon={Cpu}
          title="No technologies added yet"
          desc="Add the technologies you work with. Shared across all Omnyvora services."
          actionLabel="Add your first technology"
          onAction={() => addInputRef.current?.focus()}
        />
      ) : (
        grouped.map(([category, items]) => {
          const categoryIds = items.map((t) => t.id);
          return (
            <div key={category} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="label">{TECHNOLOGY_CATEGORY_LABELS[category]}</div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd(categoryIds)}>
                <SortableContext items={categoryIds} strategy={verticalListSortingStrategy}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {items.map((technology) => (
                      <TechnologyRow
                        key={technology.id}
                        technology={technology}
                        isRemoving={removeTechnology.isPending && removeTechnology.variables === technology.id}
                        onCommit={(proficiency) => updateProficiency.mutate({ userTechnologyId: technology.id, proficiency })}
                        onRemove={() => setPendingRemoval(technology)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          );
        })
      )}

      <ConfirmModal
        config={
          pendingRemoval
            ? ({
                title: "Remove technology",
                body: `Remove "${pendingRemoval.name}" from your technologies? You can add it again later.`,
                confirmLabel: "Remove",
                tone: "danger",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setPendingRemoval(null)}
        onConfirm={() => {
          if (pendingRemoval) removeTechnology.mutate(pendingRemoval.id);
          setPendingRemoval(null);
        }}
      />
    </div>
  );
}
