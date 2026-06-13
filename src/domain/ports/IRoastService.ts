import type { RoastPersona } from "@/domain/entities/Shared";

export interface RoastInput {
  entityId: string;
  entityType: "member" | "squad";
  persona: RoastPersona;
}

export interface RoastResult {
  text: string;
  persona: RoastPersona;
  createdAt: Record<string, unknown>;
}

export interface IRoastService {
  requestRoast(input: RoastInput): Promise<RoastResult>;
  updateRoast(entityId: string, roastResult: RoastResult): Promise<void>;
}
