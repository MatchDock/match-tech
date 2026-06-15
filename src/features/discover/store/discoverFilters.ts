import { create } from "zustand";

interface DiscoverFiltersState {
  searchQuery: string;
  selectedRole: string;
  selectedStatus: string;
  selectedTag: string;
  setSearchQuery: (q: string) => void;
  setSelectedRole: (r: string) => void;
  setSelectedStatus: (s: string) => void;
  setSelectedTag: (t: string) => void;
  clearSelectedTag: () => void;
}

export const useDiscoverFiltersStore = create<DiscoverFiltersState>((set) => ({
  searchQuery: "",
  selectedRole: "ALL",
  selectedStatus: "ALL",
  selectedTag: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedRole: (selectedRole) => set({ selectedRole }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  clearSelectedTag: () => set({ selectedTag: "" }),
}));
