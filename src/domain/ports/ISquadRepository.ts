import type { Squad } from "@/domain/entities/Squad";

export interface ISquadRepository {
  getSquad(squadId: string): Promise<Squad>;
  getSquadsByUserId(userId: string): Promise<Squad[]>;
  createSquad(data: Omit<Squad, "id" | "createdAt" | "updatedAt">): Promise<Squad>;
  updateSquad(squadId: string, data: Partial<Squad>): Promise<void>;
  deleteSquad(squadId: string): Promise<void>;
  addMemberToSquad(squadId: string, memberId: string): Promise<void>;
  removeMemberFromSquad(squadId: string, memberId: string): Promise<void>;
}
