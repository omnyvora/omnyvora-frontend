import { create } from "zustand";
import type { LogLevelFilter } from "./types";

// Client-only UI state for the admin console — grows as later steps add
// the Settings tab.
interface AdminStore {
  logLevelFilter:    LogLevelFilter;
  setLogLevelFilter: (level: LogLevelFilter) => void;
  expandedLogId:     number | null;
  toggleExpandedLog: (id: number) => void;

  userSearchQuery:    string;
  setUserSearchQuery: (q: string) => void;
  selectedUserId:     number | null;
  setSelectedUserId:  (id: number | null) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  logLevelFilter:    "ALL",
  setLogLevelFilter: (level) => set({ logLevelFilter: level }),
  expandedLogId:     null,
  toggleExpandedLog: (id) => set((s) => ({ expandedLogId: s.expandedLogId === id ? null : id })),

  userSearchQuery:    "",
  setUserSearchQuery: (q) => set({ userSearchQuery: q }),
  selectedUserId:     null,
  setSelectedUserId:  (id) => set({ selectedUserId: id }),
}));
