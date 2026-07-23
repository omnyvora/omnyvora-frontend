"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/context";
import { Page, PageHead } from "@/shared/workspace/components/ui";
import { AppCard } from "@/shared/workspace/components/AppCard";
import { usePlatformServices } from "../hooks";
import { uniqueCategories } from "../transformers";
import { getServiceOpenPath } from "../utils";
import type { PlatformServiceUI } from "../types";
import type { UserRole } from "@/shared/auth/types";

function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active:     string;
  onChange:   (c: string) => void;
}) {
  const all = ["All", ...categories];
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {all.map((c) => {
        const isActive = c === active;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            style={{
              height: 32,
              padding: "0 14px",
              borderRadius: "var(--radius-pill)",
              cursor: "pointer",
              border: `0.5px solid ${isActive ? "var(--accent-primary)" : "var(--border-default)"}`,
              background: isActive ? "var(--accent-subtle)" : "var(--bg-surface-raised)",
              color: isActive ? "var(--accent-text)" : "var(--text-secondary)",
              font: `${isActive ? 500 : 400} 13px var(--font-sans)`,
              transition: "background var(--duration-fast) var(--ease), border-color var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease)",
            }}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

function ServiceGrid({ services, role }: { services: PlatformServiceUI[]; role: UserRole | undefined }) {
  const router = useRouter();
  if (services.length === 0) {
    return (
      <div style={{ padding: "40px 0", color: "var(--text-tertiary)", textAlign: "center", font: "400 14px var(--font-sans)" }}>
        No applications found in this category.
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
      {services.map((s) => (
        <AppCard
          key={s.id}
          service={s}
          showCategory
          onOpen={(svc) => router.push(getServiceOpenPath(svc, role))}
        />
      ))}
    </div>
  );
}

export function ApplicationsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { user } = useAuth();
  const { data: services = [], isLoading, isError } = usePlatformServices();

  const categories = uniqueCategories(services);
  const filtered   = activeCategory === "All"
    ? services
    : services.filter((s) => s.category === activeCategory);

  return (
    <Page>
      <PageHead
        title="Applications"
        subtitle="All available services on Omnyvora."
      />

      {isLoading ? (
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skel" style={{ height: 32, width: 80, borderRadius: "var(--radius-pill)" }} />
          ))}
        </div>
      ) : (
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />
      )}

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skel" style={{ height: 180 }} />
          ))}
        </div>
      ) : isError ? (
        <div style={{ padding: "40px 0", color: "var(--status-error)", textAlign: "center" }}>
          Failed to load applications. Please refresh.
        </div>
      ) : (
        <ServiceGrid services={filtered} role={user?.role} />
      )}
    </Page>
  );
}
