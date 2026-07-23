"use client";

import { Award, Briefcase, Folder, GraduationCap, Share2, Star } from "lucide-react";
import {
  useCertifications,
  useEducations,
  useExperiences,
  useProjects,
  useSkills,
  useSocialLinks,
} from "../hooks";
import { CategoryCard } from "./CategoryCard";

interface IdentityOverviewProps {
  onNavigate: (tabId: string) => void;
}

export function IdentityOverview({ onNavigate }: IdentityOverviewProps) {
  const { data: projects }      = useProjects();
  const { data: experiences }   = useExperiences();
  const { data: educations }    = useEducations();
  const { data: certifications } = useCertifications();
  const { data: skills }        = useSkills();
  const { data: socialLinks }   = useSocialLinks();

  const cats = [
    { id: "projects",       icon: Folder,        label: "Projects",       count: projects?.length ?? 0 },
    { id: "experience",     icon: Briefcase,     label: "Experience",     count: experiences?.length ?? 0 },
    { id: "education",      icon: GraduationCap, label: "Education",      count: educations?.length ?? 0 },
    { id: "certifications", icon: Award,          label: "Certifications", count: certifications?.length ?? 0 },
    { id: "skills",         icon: Star,           label: "Skills",         count: skills?.length ?? 0 },
    { id: "social",         icon: Share2,        label: "Social links",   count: socialLinks?.length ?? 0 },
  ];
  const filled = cats.filter((c) => c.count > 0).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div className="ds-display-sm" style={{ color: "var(--text-primary)" }}>My Data</div>
          <div className="ds-body-sm" style={{ color: "var(--text-secondary)", marginTop: 4 }}>The facts about you, used across every Omnyvora tool.</div>
        </div>
        <span className="badge badge--neutral badge--md">{filled} of {cats.length} started</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {cats.map((c) => (
          <CategoryCard key={c.id} icon={c.icon} label={c.label} count={c.count} complete={c.count > 0} onManage={() => onNavigate(c.id)} />
        ))}
      </div>
    </div>
  );
}
