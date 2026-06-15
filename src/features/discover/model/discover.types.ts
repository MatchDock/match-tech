export type { RoastPersona } from "@/domain/entities/Shared";

export type ToastType = "error" | "info";

export type ProfileStatus = "looking" | "open" | "complete";

export interface ProfileCanvas {
  loves?: string[];
  comfort?: string[];
  veto?: string[];
  vetoes?: string[];
}

export interface ProfileSkills {
  frontend: number;
  backend: number;
  ux_ui: number;
  dados: number;
  hardware_android: number;
  vibe_coding: number;
}

export interface Profile {
  id: string;
  userId?: string;
  name?: string;
  photoURL?: string | null;
  github?: string;
  linkedin?: string;
  bio?: string;
  primaryRole?: string;
  secondaryRoles?: string[];
  skills?: ProfileSkills;
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
