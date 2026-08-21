import { create } from "zustand";

type PreviewDevice = "desktop" | "mobile";

// Client-only UI state for the portfolio builder — never server data.
interface PortfolioStore {
  activeSectionKey:    string | null;
  setActiveSectionKey: (key: string | null) => void;

  previewOpen:    boolean;
  togglePreview:  () => void;

  previewDevice:    PreviewDevice;
  setPreviewDevice: (device: PreviewDevice) => void;

  galleryCategory:    string;
  setGalleryCategory: (category: string) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  activeSectionKey:    null,
  setActiveSectionKey: (key) => set({ activeSectionKey: key }),

  previewOpen:   true,
  togglePreview: () => set((s) => ({ previewOpen: !s.previewOpen })),

  previewDevice:    "desktop",
  setPreviewDevice: (device) => set({ previewDevice: device }),

  galleryCategory:    "All",
  setGalleryCategory: (category) => set({ galleryCategory: category }),
}));
