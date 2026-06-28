import { SkillService } from "@/application/services/SkillService";
import { FirebaseSkillRepository } from "@/infrastructure/firebase/skillRepository";

/**
 * Factory simples para evitar acoplamento direto no frontend
 * e manter consistência na criação do service.
 */
export function makeSkillService() {
  const repository = new FirebaseSkillRepository();
  return new SkillService(repository);
}
