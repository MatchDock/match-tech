import type { Skill } from "@/domain/entities/Skill";

export interface ISkillRepository {
  getAllSkills(): Promise<Skill[]>;

  getSkillById(id: string): Promise<Skill | null>;

  createSkill(skill: Skill): Promise<void>;

  updateSkill(id: string, data: Partial<Skill>): Promise<void>;
}
