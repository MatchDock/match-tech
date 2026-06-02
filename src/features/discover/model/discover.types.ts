export type RoastPersona = "brutal" | "mild";

export type ToastType = "error" | "info";

export type ProfileStatus = "looking" | "open" | "complete";

export interface ProfileCanvas {
  loves?: string[];
  comfort?: string[];
  vetoes?: string[];
}

export interface Profile {
  id: string;
  name?: string;
  github?: string;
  bio?: string;
  primaryRole?: string;
  secondaryRoles?: string[];
  status?: ProfileStatus;
  roast?: string;
  roastBrutal?: string;
  roastMild?: string;
  canvas?: ProfileCanvas;
  updatedAt?: Date;
}

export interface ToastState {
  message: string;
  type: ToastType;
}

export interface DiscoverFiltersState {
  searchQuery: string;
  selectedRole: string;
  selectedStatus: string;
  selectedTag: string;
}

export interface RoastApiResponse {
  roast?: string;
  error?: string;
}