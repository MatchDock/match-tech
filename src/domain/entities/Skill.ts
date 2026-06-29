import type { Timestamp } from "firebase/firestore";

export type SkillStatus = "pending" | "approved" | "rejected";

export interface Skill {
  id: string;
  name: string;
  normalizedName: string;
  category: string | null;
  status: SkillStatus;
  usageCount: number;
  createdBy: string;
  createdAt: Timestamp;
}
