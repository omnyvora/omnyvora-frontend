"use client";

import { useState } from "react";
import { Award, Briefcase, Cpu, Folder, GraduationCap, LayoutGrid, Share2, Star } from "lucide-react";
import { Tabs } from "@/shared/workspace/components/ui";
import {
  useCertifications,
  useEducations,
  useExperiences,
  useProjects,
  useSkills,
  useSocialLinks,
  useTechnologies,
} from "../hooks";
import { CertificationsManager } from "../components/CertificationsManager";
import { EducationManager } from "../components/EducationManager";
import { ExperienceManager } from "../components/ExperienceManager";
import { IdentityOverview } from "../components/IdentityOverview";
import { ProjectsManager } from "../components/ProjectsManager";
import { SkillsManager } from "../components/SkillsManager";
import { SocialLinksManager } from "../components/SocialLinksManager";
import { TechnologiesManager } from "../components/TechnologiesManager";

type IdentityTab =
  | "overview" | "projects" | "experience" | "education" | "certifications"
  | "skills" | "technologies" | "social";

export function IdentityPanel() {
  const [tab, setTab] = useState<IdentityTab>("overview");

  const { data: projects }       = useProjects();
  const { data: experiences }    = useExperiences();
  const { data: educations }     = useEducations();
  const { data: certifications } = useCertifications();
  const { data: skills }         = useSkills();
  const { data: technologies }   = useTechnologies();
  const { data: socialLinks }    = useSocialLinks();

  const tabs = [
    { id: "overview",       label: "Overview",       icon: LayoutGrid },
    { id: "projects",       label: "Projects",       icon: Folder,        count: projects?.length ?? 0 },
    { id: "experience",     label: "Experience",     icon: Briefcase,     count: experiences?.length ?? 0 },
    { id: "education",      label: "Education",      icon: GraduationCap, count: educations?.length ?? 0 },
    { id: "certifications", label: "Certifications", icon: Award,          count: certifications?.length ?? 0 },
    { id: "skills",         label: "Skills",         icon: Star,           count: skills?.length ?? 0 },
    { id: "technologies",   label: "Technologies",   icon: Cpu,            count: technologies?.length ?? 0 },
    { id: "social",         label: "Social links",   icon: Share2,        count: socialLinks?.length ?? 0 },
  ];

  return (
    <div className="card" style={{ maxWidth: 920 }}>
      <div style={{ padding: "6px 20px 0", overflowX: "auto" }}>
        <Tabs items={tabs} value={tab} onChange={(id) => setTab(id as IdentityTab)} />
      </div>
      <div style={{ padding: 24 }}>
        {tab === "overview" && <IdentityOverview onNavigate={(id) => setTab(id as IdentityTab)} />}
        {tab === "projects" && <ProjectsManager />}
        {tab === "experience" && <ExperienceManager />}
        {tab === "education" && <EducationManager />}
        {tab === "certifications" && <CertificationsManager />}
        {tab === "skills" && <SkillsManager />}
        {tab === "technologies" && <TechnologiesManager />}
        {tab === "social" && <SocialLinksManager />}
      </div>
    </div>
  );
}
