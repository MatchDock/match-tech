import type { Member, PublicMember } from "@/domain/entities/Member";

export interface ProfileFilters {
  role?: string;
  tags?: string[];
  squadStatus?: "open" | "looking" | "closed";
  minSkillLevel?: number;
}

export interface IProfileRepository {
  getProfile(uid: string): Promise<Member>;
  getPublicProfile(uid: string): Promise<PublicMember>;
  updateProfile(uid: string, data: Partial<Member>): Promise<void>;
  listPublicProfiles(filters?: ProfileFilters): Promise<Member[]>;
  deleteProfile(uid: string): Promise<void>;
}
