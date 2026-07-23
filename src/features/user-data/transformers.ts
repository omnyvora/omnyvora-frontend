import {
  TECHNOLOGY_CATEGORIES,
  type Certification,
  type Education,
  type EducationFormValues,
  type Experience,
  type ExperienceFormValues,
  type Project,
  type ProjectImage,
  type Skill,
  type SocialLink,
  type TechnologyCategory,
} from "./types";

export interface SkillUI {
  id:            number;
  technologyId:  number;
  name:          string;
  category:      TechnologyCategory;
  proficiency:   number;
  displayOrder:  number;
}

export function toSkillUI(s: Skill): SkillUI {
  return {
    id:           s.id,
    technologyId: s.technology.id,
    name:         s.technology.name,
    category:     s.technology.category,
    proficiency:  s.proficiency,
    displayOrder: s.display_order,
  };
}

// Groups already-ordered skills by category, preserving display_order within each group,
// and drops empty categories so the UI never renders a heading with nothing under it.
export function groupSkillsByCategory(skills: SkillUI[]): Array<[TechnologyCategory, SkillUI[]]> {
  return TECHNOLOGY_CATEGORIES
    .map((category) => [category, skills.filter((s) => s.category === category)] as [TechnologyCategory, SkillUI[]])
    .filter(([, items]) => items.length > 0);
}

// ── Projects ─────────────────────────────────────────────────────────────────

export interface ProjectImageUI {
  id:           number;
  url:          string;
  caption:      string;
  isCover:      boolean;
  displayOrder: number;
}

export interface ProjectUI {
  id:               number;
  title:            string;
  shortDescription: string;
  description:      string;
  achievements:     string[];
  technologies:     string[];
  githubUrl:        string;
  liveUrl:          string;
  isFeatured:       boolean;
  displayOrder:     number;
  images:           ProjectImageUI[];
}

export function toProjectImageUI(i: ProjectImage): ProjectImageUI {
  return { id: i.id, url: i.image, caption: i.caption, isCover: i.is_cover, displayOrder: i.display_order };
}

export function toProjectUI(p: Project): ProjectUI {
  return {
    id:               p.id,
    title:            p.title,
    shortDescription: p.short_description,
    description:      p.description,
    achievements:     p.achievements,
    technologies:     p.technologies,
    githubUrl:        p.github_url,
    liveUrl:          p.live_url,
    isFeatured:       p.is_featured,
    displayOrder:     p.display_order,
    images:           p.images.map(toProjectImageUI),
  };
}

// ── Experience ───────────────────────────────────────────────────────────────

export interface ExperienceUI {
  id:            number;
  jobTitle:      string;
  companyName:   string;
  companyUrl:    string;
  location:      string;
  description:   string;
  technologies:  string[];
  startDate:     string;
  endDate:       string | null;
  isCurrent:     boolean;
  displayOrder:  number;
}

export function toExperienceUI(e: Experience): ExperienceUI {
  return {
    id:           e.id,
    jobTitle:     e.job_title,
    companyName:  e.company_name,
    companyUrl:   e.company_url,
    location:     e.location,
    description:  e.description,
    technologies: e.technologies,
    startDate:    e.start_date,
    endDate:      e.end_date,
    isCurrent:    e.is_current,
    displayOrder: e.display_order,
  };
}

// isCurrent is a UI-only affordance — the backend only knows end_date === null.
// An empty string is also normalized to null — DRF's DateField rejects "" outright.
export function toExperienceRequest(values: ExperienceFormValues, isCurrent: boolean) {
  return { ...values, end_date: isCurrent || !values.end_date ? null : values.end_date };
}

// ── Certifications ───────────────────────────────────────────────────────────

export interface CertificationUI {
  id:            number;
  title:         string;
  issuer:        string;
  issueDate:     string;
  credentialUrl: string;
  image:         string | null;
  displayOrder:  number;
}

export function toCertificationUI(c: Certification): CertificationUI {
  return {
    id:            c.id,
    title:         c.title,
    issuer:        c.issuer,
    issueDate:     c.issue_date,
    credentialUrl: c.credential_url,
    image:         c.image,
    displayOrder:  c.display_order,
  };
}

// ── Education ────────────────────────────────────────────────────────────────

export interface EducationUI {
  id:               number;
  degree:           string;
  institution:      string;
  department:       string;
  gpa:              string | null;
  gpaScale:         string | null;
  certificationId:  number | null;
  startDate:        string;
  endDate:          string | null;
  displayOrder:     number;
}

export function toEducationUI(e: Education): EducationUI {
  return {
    id:              e.id,
    degree:          e.degree,
    institution:     e.institution,
    department:      e.department,
    gpa:             e.gpa,
    gpaScale:        e.gpa_scale,
    certificationId: e.certification_id,
    startDate:       e.start_date,
    endDate:         e.end_date,
    displayOrder:    e.display_order,
  };
}

// Empty strings from cleared inputs must become null — DRF's DateField/DecimalField
// reject "" outright, they only accept a real value or null.
export function toEducationRequest(values: EducationFormValues) {
  return {
    ...values,
    gpa: values.gpa || null,
    gpa_scale: values.gpa_scale || null,
    end_date: values.end_date || null,
  };
}

// ── Social links ─────────────────────────────────────────────────────────────

export interface SocialLinkUI {
  id:           number;
  platform:     SocialLink["platform"];
  label:        string;
  url:          string;
  displayOrder: number;
}

export function toSocialLinkUI(s: SocialLink): SocialLinkUI {
  return { id: s.id, platform: s.platform, label: s.label, url: s.url, displayOrder: s.display_order };
}
