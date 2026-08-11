"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { useDebounce } from "@/core/hooks/useDebounce";
import { useCreateSkill, useSkillSearch } from "../hooks";
import type { SkillCatalogEntry } from "../types";

function onCreateSkillError(err: unknown) {
  toast.error("Couldn't add skill", { description: describeApiError(err) });
}

// No category picker here (Skill has none) — every new skill starts at a neutral
// default and is fine-tuned afterward via the slider already on each SkillRow.
const DEFAULT_PROFICIENCY = 50;

interface AddSkillRowProps {
  existingNames: Set<string>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function AddSkillRow({ existingNames, inputRef }: AddSkillRowProps) {
  const [query, setQuery]   = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 250);
  const { data: results, isFetching } = useSkillSearch(debouncedQuery);
  const createSkill = useCreateSkill();

  const trimmed = query.trim();
  const alreadyAdded = trimmed.length > 0 && existingNames.has(trimmed.toLowerCase());
  const canSubmitNew = trimmed.length > 0 && !alreadyAdded && !createSkill.isPending;

  // Query clears but the dropdown is left open (debouncedQuery lags briefly behind) —
  // several skills can be added back-to-back without re-focusing the input each time.
  function addExisting(entry: SkillCatalogEntry) {
    if (existingNames.has(entry.name.toLowerCase()) || createSkill.isPending) return;
    createSkill.mutate(
      { skill_name: entry.name, proficiency: DEFAULT_PROFICIENCY },
      { onError: onCreateSkillError },
    );
    setQuery("");
  }

  function addNew() {
    if (!canSubmitNew) return;
    createSkill.mutate(
      { skill_name: trimmed, proficiency: DEFAULT_PROFICIENCY },
      { onError: onCreateSkillError },
    );
    setQuery("");
  }

  return (
    <div className="field" style={{ position: "relative" }}>
      <label className="label">Add a skill</label>
      <input
        ref={inputRef}
        className="input"
        placeholder="Search or add a skill…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          const exactMatch = results?.find((s) => s.name.toLowerCase() === trimmed.toLowerCase());
          if (exactMatch) addExisting(exactMatch);
          else addNew();
        }}
      />
      {alreadyAdded && <div className="field-error">Already in your skills.</div>}

      {isOpen && debouncedQuery.length > 0 && (
        <div
          className="card card--raised"
          style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, zIndex: 20, maxHeight: 240, overflowY: "auto" }}
        >
          {isFetching && (
            <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 8, color: "var(--text-tertiary)" }}>
              <Loader2 size={14} className="animate-spin" /> Searching…
            </div>
          )}
          {!isFetching && results?.map((entry) => {
            const added = existingNames.has(entry.name.toLowerCase());
            return (
              <button
                key={entry.id}
                type="button"
                className="btn btn--ghost row-hover"
                style={{ width: "100%", justifyContent: "space-between", borderRadius: 0, padding: "0 14px" }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addExisting(entry)}
                disabled={added}
              >
                <span>{entry.name}</span>
                {added && <Check size={14} style={{ color: "var(--accent-primary)" }} />}
              </button>
            );
          })}
          {!isFetching && canSubmitNew && !results?.some((s) => s.name.toLowerCase() === trimmed.toLowerCase()) && (
            <button
              type="button"
              className="btn btn--ghost row-hover"
              onMouseDown={(e) => e.preventDefault()}
              onClick={addNew}
              style={{
                width: "100%", justifyContent: "flex-start", borderRadius: 0, padding: "10px 14px", gap: 8,
                borderTop: results?.length ? "0.5px solid var(--border-default)" : undefined,
              }}
            >
              {createSkill.isPending
                ? <Loader2 size={13} className="animate-spin" />
                : <span className="ds-body-sm" style={{ color: "var(--text-tertiary)" }}>Add &ldquo;{trimmed}&rdquo; as a new skill</span>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
