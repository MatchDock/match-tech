import { Timestamp } from "firebase/firestore";

import type { Skill } from "@/domain/entities/Skill";
import type { ISkillRepository } from "@/domain/ports/ISkillRepository";

const normalizeSkillName = (name: string) => name.trim().toLowerCase().replace(/\s+/g, " ");

export class SkillService {
  constructor(private readonly repository: ISkillRepository) {}

  async createOrGetSkill(rawName: string, category: string | null = null): Promise<Skill> {
    if (!rawName || rawName.trim().length === 0) {
      throw new Error("Skill inválida");
    }

    const normalizedName = normalizeSkillName(rawName);

    const existing = await this.repository.getSkillById(normalizedName);
    if (existing) return existing;

    const newSkill: Skill = {
      id: normalizedName,
      name: rawName.trim(),
      normalizedName,
      category,
      status: "pending",
      usageCount: 1,
      createdBy: "",
      createdAt: Timestamp.now(), // ← tipagem correta, sem any
    };

    try {
      await this.repository.createSkill(newSkill);
    } catch {
      const fallback = await this.repository.getSkillById(normalizedName);
      if (fallback) return fallback;
      throw new Error(`Erro ao criar skill: ${rawName}`);
    }

    return newSkill;
  }
}
