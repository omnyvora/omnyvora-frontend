"use client";

import { useRef, useState } from "react";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/shared/workspace/components/ui";
import { ConfirmModal, type ConfirmConfig } from "@/shared/components/ConfirmModal";
import { useDeleteSkill, useReorderSkills, useSkills, useUpdateSkillProficiency } from "../hooks";
import { groupSkillsByCategory, type SkillUI } from "../transformers";
import { TECHNOLOGY_CATEGORY_LABELS } from "../types";
import { AddSkillRow } from "./AddSkillRow";
import { SkillRow } from "./SkillRow";

export function SkillsManager() {
  const { data: skills, isLoading } = useSkills();
  const updateProficiency = useUpdateSkillProficiency();
  const removeSkill        = useDeleteSkill();
  const reorder            = useReorderSkills();

  const [pendingRemoval, setPendingRemoval] = useState<SkillUI | null>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2, 3].map((i) => <div key={i} className="skel" style={{ height: 46 }} />)}
      </div>
    );
  }

  const list = skills ?? [];
  const existingNames = new Set(list.map((s) => s.name.toLowerCase()));
  const grouped = groupSkillsByCategory(list);

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
      const fullIds = list.map((s) => s.id);
      let cursor = 0;
      const nextFullIds = fullIds.map((id) => (categorySet.has(id) ? reorderedCategoryIds[cursor++] : id));

      reorder.mutate(nextFullIds, {
        onError: () => toast.error("Couldn't save the new order", { description: "Reverted — try again." }),
      });
    };
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <AddSkillRow existingNames={existingNames} inputRef={addInputRef} />

      {list.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No skills added yet"
          desc="Add your skills here. Shared across all Omnyvora services."
          actionLabel="Add your first skill"
          onAction={() => addInputRef.current?.focus()}
        />
      ) : (
        grouped.map(([category, items]) => {
          const categoryIds = items.map((s) => s.id);
          return (
            <div key={category} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="label">{TECHNOLOGY_CATEGORY_LABELS[category]}</div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd(categoryIds)}>
                <SortableContext items={categoryIds} strategy={verticalListSortingStrategy}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {items.map((skill) => (
                      <SkillRow
                        key={skill.id}
                        skill={skill}
                        isRemoving={removeSkill.isPending && removeSkill.variables === skill.id}
                        onCommit={(proficiency) => updateProficiency.mutate({ skillId: skill.id, proficiency })}
                        onRemove={() => setPendingRemoval(skill)}
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
                title: "Remove skill",
                body: `Remove "${pendingRemoval.name}" from your skills? You can add it again later.`,
                confirmLabel: "Remove",
                tone: "danger",
              } satisfies ConfirmConfig)
            : null
        }
        onClose={() => setPendingRemoval(null)}
        onConfirm={() => {
          if (pendingRemoval) removeSkill.mutate(pendingRemoval.id);
          setPendingRemoval(null);
        }}
      />
    </div>
  );
}
