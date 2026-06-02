export type RoastPersona = "brutal" | "gentle";

export interface Tag {
  name: string;
  sentiment: "love" | "ok" | "veto";
}

export interface SkillRadar {
  frontend: number;
  backend: number;
  design: number;
  data: number;
  devops: number;
  soft: number;
}

export type SquadStatus = "open" | "looking" | "closed";
