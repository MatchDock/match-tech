import type { Tag, SkillRadar } from "@/infrastructure/firebase/schemas";

export interface MemberIdentity {
  uid: string;
  displayName: string;
  photoURL?: string;
  bio: string;
}

export interface MemberRoles {
  role: string;
  secondaryRoles: string[];
}

export interface MemberSkills {
  skills: SkillRadar;
}

export interface MemberTags {
  tags: Tag[];
}

export interface MemberSquadStatus {
  squadId?: string;
  squadStatus: "open" | "looking" | "closed";
}

export type Member = MemberIdentity &
  MemberRoles &
  MemberSkills &
  MemberTags &
  MemberSquadStatus & {
    createdAt: Record<string, unknown>;
    updatedAt: Record<string, unknown>;
    visibility: "public" | "private";
  };

export type PublicMember = MemberIdentity &
  MemberRoles & {
    visibility: "public";
    tags?: Tag[];
  };

export type { Tag, SkillRadar } from "@/infrastructure/firebase/schemas";
