"use client";

import { useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import { useDebounce } from "@/core/hooks/useDebounce";
import { useCreateSkill, useTechnologySearch } from "../hooks";
import { TECHNOLOGY_CATEGORIES, TECHNOLOGY_CATEGORY_LABELS, type Technology, type TechnologyCategory } from "../types";

// Proficiency is no longer collected here — every new skill starts at a neutral
// default and is fine-tuned afterward via the slider already on each SkillRow.
// Dropping that step (and the confirm button it required) turns "search, pick a
// category, drag a slider, click Add" into "search, click" for the common case.
const DEFAULT_PROFICIENCY = 50;

interface AddSkillRowProps {
  existingNames: Set<string>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function AddSkillRow({ existingNames, inputRef }: AddSkillRowProps) {
  const [query, setQuery]             = useState("");
  const [isOpen, setIsOpen]           = useState(false);
  const [newCategory, setNewCategory] = useState<TechnologyCategory>("other");

  const debouncedQuery = useDebounce(query, 250);
  const { data: results, isFetching } = useTechnologySearch(debouncedQuery);
  const createSkill = useCreateSkill();

  const trimmed = query.trim();
  const alreadyAdded = trimmed.length > 0 && existingNames.has(trimmed.toLowerCase());
  const exactMatch = results?.find((t) => t.name.toLowerCase() === trimmed.toLowerCase());
  const canSubmitNew = trimmed.length > 0 && !alreadyAdded && !createSkill.isPending;

  // Query clears but the dropdown is left open (debouncedQuery lags briefly behind) —
  // several skills can be added back-to-back without re-focusing the input each time.
  function addExisting(tech: Technology) {
    if (existingNames.has(tech.name.toLowerCase()) || createSkill.isPending) return;
    createSkill.mutate({ technology_name: tech.name, category: tech.category, proficiency: DEFAULT_PROFICIENCY });
    setQuery("");
  }

  function addNew() {
    if (!canSubmitNew) return;
    createSkill.mutate({ technology_name: trimmed, category: newCategory, proficiency: DEFAULT_PROFICIENCY });
    setQuery("");
    setNewCategory("other");
  }

  return (
    <div className="field" style={{ position: "relative" }}>
      <label className="label">Add a skill</label>
      <input
        ref={inputRef}
        className="input"
        placeholder="Search or add a technology…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
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
          {!isFetching && results?.map((tech) => {
            const added = existingNames.has(tech.name.toLowerCase());
            return (
              <button
                key={tech.id}
                type="button"
                className="btn btn--ghost row-hover"
                style={{ width: "100%", justifyContent: "space-between", borderRadius: 0, padding: "0 14px" }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addExisting(tech)}
                disabled={added}
              >
                <span>{tech.name}</span>
                {added
                  ? <Check size={14} style={{ color: "var(--accent-primary)" }} />
                  : <span className="badge badge--neutral">{TECHNOLOGY_CATEGORY_LABELS[tech.category]}</span>}
              </button>
            );
          })}
          {!isFetching && !exactMatch && trimmed.length > 0 && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              style={{
                padding: "10px 14px", display: "flex", alignItems: "center", gap: 8,
                borderTop: results?.length ? "0.5px solid var(--border-default)" : undefined,
              }}
            >
              <span className="ds-body-sm" style={{ color: "var(--text-tertiary)" }}>
                Add &ldquo;{trimmed}&rdquo; as
              </span>
              <select
                className="input"
                style={{ height: 30, width: "auto" }}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as TechnologyCategory)}
              >
                {TECHNOLOGY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{TECHNOLOGY_CATEGORY_LABELS[c]}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                style={{ width: 30, padding: 0, flex: "none" }}
                disabled={!canSubmitNew}
                onClick={addNew}
              >
                {createSkill.isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
