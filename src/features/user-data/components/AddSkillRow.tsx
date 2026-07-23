"use client";

import { useRef, useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import { useDebounce } from "@/core/hooks/useDebounce";
import { useCreateSkill, useTechnologySearch } from "../hooks";
import { TECHNOLOGY_CATEGORIES, TECHNOLOGY_CATEGORY_LABELS, type Technology, type TechnologyCategory } from "../types";
import { ProficiencySlider } from "./ProficiencySlider";

interface AddSkillRowProps {
  existingNames: Set<string>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function AddSkillRow({ existingNames, inputRef }: AddSkillRowProps) {
  const [query, setQuery]           = useState("");
  const [isOpen, setIsOpen]         = useState(false);
  const [selected, setSelected]     = useState<Technology | null>(null);
  const [newCategory, setNewCategory] = useState<TechnologyCategory>("other");
  const [proficiency, setProficiency] = useState(50);

  const debouncedQuery = useDebounce(query, 250);
  const { data: results, isFetching } = useTechnologySearch(debouncedQuery);
  const createSkill = useCreateSkill();

  const containerRef = useRef<HTMLDivElement>(null);
  const trimmed = query.trim();
  const alreadyAdded = trimmed.length > 0 && existingNames.has(trimmed.toLowerCase());
  const exactMatch = results?.find((t) => t.name.toLowerCase() === trimmed.toLowerCase());
  const canSubmit = trimmed.length > 0 && !alreadyAdded && !createSkill.isPending;

  function selectTechnology(tech: Technology) {
    setSelected(tech);
    setQuery(tech.name);
    setIsOpen(false);
  }

  function reset() {
    setQuery("");
    setSelected(null);
    setNewCategory("other");
    setProficiency(50);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    const category = selected?.category ?? newCategory;
    createSkill.mutate(
      { technology_name: trimmed, category, proficiency },
      { onSuccess: reset },
    );
  }

  return (
    <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div className="field" style={{ position: "relative", flex: 1 }} ref={containerRef}>
          <div className="input-wrap">
            <input
              ref={inputRef}
              className="input"
              placeholder="Search or add a technology…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 120)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
              }}
            />
          </div>

          {isOpen && debouncedQuery.length > 0 && (
            <div
              className="card card--raised"
              style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 20,
                maxHeight: 240, overflowY: "auto",
              }}
            >
              {isFetching && (
                <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 8, color: "var(--text-tertiary)" }}>
                  <Loader2 size={14} className="animate-spin" /> Searching…
                </div>
              )}
              {!isFetching && results?.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  className="btn btn--ghost row-hover"
                  style={{ width: "100%", justifyContent: "space-between", borderRadius: 0, padding: "0 14px" }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectTechnology(tech)}
                >
                  <span>{tech.name}</span>
                  <span className="badge badge--neutral">{TECHNOLOGY_CATEGORY_LABELS[tech.category]}</span>
                </button>
              ))}
              {!isFetching && !exactMatch && (
                <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, borderTop: results?.length ? "0.5px solid var(--border-default)" : undefined }}>
                  <span className="ds-body-sm" style={{ color: "var(--text-tertiary)" }}>
                    Add &ldquo;{trimmed}&rdquo; as
                  </span>
                  <select
                    className="input"
                    style={{ height: 30, width: "auto" }}
                    value={newCategory}
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => setNewCategory(e.target.value as TechnologyCategory)}
                  >
                    {TECHNOLOGY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{TECHNOLOGY_CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          {alreadyAdded && (
            <div className="field-error">Already in your skills.</div>
          )}
        </div>

        <button
          type="button"
          className="btn btn--primary"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {createSkill.isPending
            ? <Loader2 size={15} className="animate-spin" />
            : selected ? <Check size={15} /> : <Plus size={15} />}
          Add skill
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className="label" style={{ marginBottom: 0, flex: "none" }}>Proficiency</span>
        <ProficiencySlider value={proficiency} onCommit={setProficiency} />
      </div>
    </div>
  );
}
