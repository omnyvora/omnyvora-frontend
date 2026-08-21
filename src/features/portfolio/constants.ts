import type { PortfolioItemType } from "./types";

export const PORTFOLIO_BASE_PATH = "/services/portfolio";

// Section keys the template declares that are driven by a "My Data" list — each
// maps to the item_type the visibility API expects for that section.
export const SECTION_ITEM_TYPES: Record<string, PortfolioItemType> = {
  projects:       "project",
  experience:     "experience",
  education:      "education",
  certifications: "certification",
  skills:         "skill",
  contact:        "social_link",
};

export const ITEM_TYPE_LABELS: Record<PortfolioItemType, string> = {
  project:       "Projects",
  experience:    "Experience",
  education:     "Education",
  certification: "Certifications",
  skill:         "Skills",
  social_link:   "Social links",
};

export const MY_DATA_PATH = "/profile";
