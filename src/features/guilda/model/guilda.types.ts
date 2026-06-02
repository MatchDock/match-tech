import type { User } from "firebase/auth";

export type RoastPersona = "brutal" | "mild";
export type RoastStep = "selecting" | "loading" | null;

export interface MemberSkills {
  frontend?: number;
  backend?: number;
  ux_ui?: number;
  dados?: number;
  hardware_android?: number;
  vibe_coding?: number;
}

export interface MemberCanvas {
  loves?: string[];
  comfort?: string[];
  veto?: string[];
}

export interface GuildMember {
  id: string;
  name?: string;
  photoURL?: string;
  github?: string;
  linkedin?: string;
  primaryRole?: string;
  secondaryRoles?: string[];
  skills?: MemberSkills;
  canvas?: MemberCanvas;
  roast?: string;
  roastBrutal?: string;
  roastMild?: string;
}

export interface AvatarProps {
  member: GuildMember;
  currentUser: User | null;
  getGithubUrl: (value: string) => string;
}

export interface RadarDatum {
  subject: string;
  A: number;
  fullMark: number;
}
