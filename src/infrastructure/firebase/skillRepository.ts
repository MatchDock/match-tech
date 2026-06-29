import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import type { Skill } from "@/domain/entities/Skill";
import type { ISkillRepository } from "@/domain/ports/ISkillRepository";
import { db } from "@/shared/lib/firebase/firebase.client";

export class FirebaseSkillRepository implements ISkillRepository {
  /**
   * Lista todas as skills.
   * Usado para autocomplete inicial e administração.
   */
  async getAllSkills(): Promise<Skill[]> {
    const snapshot = await getDocs(collection(db, "skills"));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Skill[];
  }

  /**
   * Busca skill diretamente pelo ID.
   *
   * DECISÃO:
   * - id = normalizedName
   * - leitura direta O(1)
   */
  async getSkillById(id: string): Promise<Skill | null> {
    const ref = doc(db, "skills", id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Skill;
  }

  /**
   * Cria skill usando ID determinístico.
   */
  async createSkill(skill: Skill): Promise<void> {
    const ref = doc(db, "skills", skill.normalizedName);

    await setDoc(
      ref,
      {
        ...skill,
        id: skill.normalizedName,
        createdAt: serverTimestamp(),
      },
      {
        merge: false,
      },
    );
  }

  /**
   * Atualização parcial.
   * Prefixo _ nos parâmetros indica que são exigidos pela interface
   * mas ainda não implementados nesta versão.
   */
  async updateSkill(_id: string, _data: Partial<Skill>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
