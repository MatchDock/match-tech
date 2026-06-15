import type { Member } from "@/domain/entities/Member";
import type { Tag, SkillRadar } from "@/domain/entities/Shared";

/**
 * Calculate compatibility score between two members
 * Based on skills overlap, shared tags preferences, and mutual interest
 *
 * Score: 0-100 where 100 is perfect compatibility
 *
 * Factors:
 * - Skill overlap (40%)
 * - Tag preferences (40%)
 * - Role diversity bonus (20%)
 */
export function calculateCompatibility(member1: Member, member2: Member): number {
  const skillScore = calculateSkillOverlap(member1.skills, member2.skills);
  const tagScore = calculateTagCompatibility(member1.tags, member2.tags);
  const roleBonus = member1.role !== member2.role ? 10 : 0;

  return Math.round(skillScore * 0.4 + tagScore * 0.4 + roleBonus);
}

/**
 * Calculate skill overlap between two members (0-100)
 * Higher score means more similar skill levels
 */
function calculateSkillOverlap(skills1: SkillRadar, skills2: SkillRadar): number {
  const skillNames = ["frontend", "backend", "design", "data", "devops", "soft"] as const;
  let totalDifference = 0;

  for (const skill of skillNames) {
    const diff = Math.abs(skills1[skill] - skills2[skill]);
    totalDifference += diff;
  }

  const maxDifference = 9 * skillNames.length; // max diff is 9 per skill
  const overlap = 100 - (totalDifference / maxDifference) * 100;

  return Math.max(0, overlap);
}

/**
 * Calculate tag compatibility (0-100)
 * Penalizes veto conflicts, rewards shared loves
 */
function calculateTagCompatibility(tags1: Tag[], tags2: Tag[]): number {
  const set1 = new Map(tags1.map((t) => [t.name, t.sentiment]));
  const set2 = new Map(tags2.map((t) => [t.name, t.sentiment]));

  let compatibility = 100;

  // Check all tags from both members
  const allTags = new Set([...set1.keys(), ...set2.keys()]);

  for (const tag of allTags) {
    const sentiment1 = set1.get(tag);
    const sentiment2 = set2.get(tag);

    // Veto conflicts: if one loves and other vetoes, penalize heavily
    if (
      (sentiment1 === "love" && sentiment2 === "veto") ||
      (sentiment1 === "veto" && sentiment2 === "love")
    ) {
      compatibility -= 20;
    }
    // Both veto: conflict but not as bad
    else if (sentiment1 === "veto" && sentiment2 === "veto") {
      compatibility -= 5;
    }
  }

  return Math.max(0, compatibility);
}

/**
 * Score a member's skills for a specific role (0-100)
 * Used for ranking profiles in discover
 */
export function scoreSkillsForRole(skills: SkillRadar, role: string): number {
  const roleSkillWeights: Record<string, Partial<Record<keyof SkillRadar, number>>> = {
    frontend: { frontend: 0.4, design: 0.2, soft: 0.2, backend: 0.1, data: 0.05, devops: 0.05 },
    backend: { backend: 0.4, data: 0.2, devops: 0.15, soft: 0.15, frontend: 0.05, design: 0.05 },
    design: { design: 0.4, frontend: 0.2, soft: 0.25, backend: 0.05, data: 0.05, devops: 0.05 },
    data: { data: 0.4, backend: 0.2, devops: 0.15, soft: 0.15, frontend: 0.05, design: 0.05 },
    devops: { devops: 0.4, backend: 0.2, data: 0.15, soft: 0.15, frontend: 0.05, design: 0.05 },
  };

  const weights = roleSkillWeights[role] || {
    frontend: 0.167,
    backend: 0.167,
    design: 0.167,
    data: 0.167,
    devops: 0.167,
    soft: 0.167,
  };

  let score = 0;
  let totalWeight = 0;

  (Object.entries(weights) as Array<[keyof SkillRadar, number]>).forEach(([skill, weight]) => {
    score += (skills[skill] / 10) * weight * 100;
    totalWeight += weight;
  });

  return Math.round(score / totalWeight);
}

/**
 * Filter members based on criteria
 */
export function filterMembers(members: Member[], role?: string, squadStatus?: string): Member[] {
  return members.filter((member) => {
    if (role && member.role !== role) {
      return false;
    }
    if (squadStatus && member.squadStatus !== squadStatus) {
      return false;
    }
    return true;
  });
}

/**
 * Sort members by compatibility with a target member
 */
export function sortByCompatibility(members: Member[], targetMember: Member): Member[] {
  const scored = members.map((member) => ({
    member,
    score: calculateCompatibility(targetMember, member),
  }));

  return scored.sort((a, b) => b.score - a.score).map((item) => item.member);
}

/**
 * Get top compatible members
 */
export function getTopCompatibleMembers(
  members: Member[],
  targetMember: Member,
  limit: number = 10,
): Member[] {
  return sortByCompatibility(members, targetMember).slice(0, limit);
}
