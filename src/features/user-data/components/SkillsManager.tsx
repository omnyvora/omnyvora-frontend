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
import type { UserSkillUI } from "../transformers";
import { AddSkillRow } from "./AddSkillRow";
import { SkillRow } from "./SkillRow";

export function SkillsManager() {
  const { data: skills, isLoading } = useSkills();
  const updateProficiency = useUpdateSkillProficiency();
  const removeSkill        = useDeleteSkill();
  const reorder            = useReorderSkills();

  const [pendingRemoval, setPendingRemoval] = useState<UserSkillUI | null>(null);
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
  const listIds = list.map((s) => s.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = listIds.indexOf(Number(active.id));
    const newIndex = listIds.indexOf(Number(over.id));
    const nextIds = arrayMove(listIds, oldIndex, newIndex);

    reorder.mutate(nextIds, {
      onError: () => toast.error("Couldn't save the new order", { description: "Reverted — try again." }),
    });
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={listIds} strategy={verticalListSortingStrategy}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {list.map((skill) => (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  isRemoving={removeSkill.isPending && removeSkill.variables === skill.id}
                  onCommit={(proficiency) => updateProficiency.mutate({ userSkillId: skill.id, proficiency })}
                  onRemove={() => setPendingRemoval(skill)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
