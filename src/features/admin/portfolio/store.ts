import { create } from "zustand";

export type AdminPortfolioTab = "overview" | "templates" | "portfolios";

// Client-only UI state for the portfolio admin panel.
interface AdminPortfolioStore {
  tab:    AdminPortfolioTab;
  setTab: (tab: AdminPortfolioTab) => void;

  templateStatusFilter:    string;
  setTemplateStatusFilter: (status: string) => void;
  templateSearch:          string;
  setTemplateSearch:       (q: string) => void;

  portfolioStatusFilter:    string;
  setPortfolioStatusFilter: (status: string) => void;
  portfolioSearch:          string;
  setPortfolioSearch:       (q: string) => void;
  selectedPortfolioId:      number | null;
  setSelectedPortfolioId:   (id: number | null) => void;
}

export const useAdminPortfolioStore = create<AdminPortfolioStore>((set) => ({
  tab:    "overview",
  setTab: (tab) => set({ tab }),

  templateStatusFilter:    "All",
  setTemplateStatusFilter: (status) => set({ templateStatusFilter: status }),
  templateSearch:          "",
  setTemplateSearch:       (q) => set({ templateSearch: q }),

  portfolioStatusFilter:    "All",
  setPortfolioStatusFilter: (status) => set({ portfolioStatusFilter: status }),
  portfolioSearch:          "",
  setPortfolioSearch:       (q) => set({ portfolioSearch: q }),
  selectedPortfolioId:      null,
  setSelectedPortfolioId:   (id) => set({ selectedPortfolioId: id }),
}));
