export interface OnboardingForm {
  name: string;
  github: string;
  linkedin: string;
  bio: string;
  loves: string[];
  comfort: string[];
  veto: string[];
  primaryRole: string;
  secondaryRoles: string[];
  status: "looking" | "open" | "complete";
  createdAt: any;
}

export interface OnboardingSkills {
  frontend: number;
  backend: number;
  ux_ui: number;
  dados: number;
  hardware_android: number;
  vibe_coding: number;
}

export type TagSentiment = "loves" | "comfort" | "veto" | null;
