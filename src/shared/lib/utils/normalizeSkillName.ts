/**
 * Normaliza nome da skill para garantir consistência no banco.
 */
export function normalizeSkillName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}
