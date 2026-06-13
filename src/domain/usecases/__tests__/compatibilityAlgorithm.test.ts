import { describe, it, expect } from "vitest";

import {
  calculateCompatibility,
  filterMembers,
  getTopCompatibleMembers,
  scoreSkillsForRole,
  sortByCompatibility,
} from "../compatibilityAlgorithm";

import type { Member } from "@/domain/entities/Member";

// ── Helpers ──────────────────────────────────────────────────────────────────

function member(overrides: Partial<Member> = {}): Member {
  return {
    uid: "uid",
    displayName: "User",
    bio: "",
    role: "frontend",
    secondaryRoles: [],
    skills: { frontend: 5, backend: 5, design: 5, data: 5, devops: 5, soft: 5 },
    tags: [],
    squadStatus: "open",
    visibility: "public",
    createdAt: {},
    updatedAt: {},
    ...overrides,
  };
}

const baseSkills = { frontend: 8, backend: 4, design: 3, data: 2, devops: 3, soft: 7 };

// ── calculateCompatibility ───────────────────────────────────────────────────

describe("calculateCompatibility", () => {
  it("returns 80 when both members are identical (same role, no tags)", () => {
    // Max score with same role: skillOverlap(1.0)*40 + tagCompat(1.0)*40 + roleBonus(0) = 80
    const m = member({ skills: baseSkills, tags: [] });
    expect(calculateCompatibility(m, m)).toBe(80);
  });

  it("awards 10-point role diversity bonus for different roles", () => {
    const m1 = member({ skills: baseSkills, tags: [], role: "frontend" });
    const m2 = member({ skills: baseSkills, tags: [], role: "backend" });
    // Same skills → skillScore=100, no tags → tagScore=100, different roles → bonus=10
    expect(calculateCompatibility(m1, m2)).toBe(90);
  });

  it("penalises love/veto conflicts by 20 points each", () => {
    const m1 = member({ tags: [{ name: "React", sentiment: "love" }] });
    const m2 = member({ tags: [{ name: "React", sentiment: "veto" }] });
    // tagScore = 100 - 20 = 80; skillScore = 100 (identical mid-level skills); no role bonus
    expect(calculateCompatibility(m1, m2)).toBe(72);
  });

  it("penalises shared veto tags by 5 points each", () => {
    const m1 = member({ tags: [{ name: "PHP", sentiment: "veto" }] });
    const m2 = member({ tags: [{ name: "PHP", sentiment: "veto" }] });
    // tagScore = 100 - 5 = 95
    expect(calculateCompatibility(m1, m2)).toBe(78);
  });

  it("floors tag compatibility at 0 when conflicts exceed 100", () => {
    const m1 = member({
      tags: [
        { name: "A", sentiment: "love" },
        { name: "B", sentiment: "love" },
        { name: "C", sentiment: "love" },
        { name: "D", sentiment: "love" },
        { name: "E", sentiment: "love" },
        { name: "F", sentiment: "love" },
      ],
    });
    const m2 = member({
      tags: [
        { name: "A", sentiment: "veto" },
        { name: "B", sentiment: "veto" },
        { name: "C", sentiment: "veto" },
        { name: "D", sentiment: "veto" },
        { name: "E", sentiment: "veto" },
        { name: "F", sentiment: "veto" },
      ],
    });
    // 6 love/veto conflicts → tagScore = max(0, 100 - 120) = 0
    // skillScore = 100, tagScore = 0, roleBonus = 0
    // result = Math.round(100*0.4 + 0*0.4 + 0) = 40
    expect(calculateCompatibility(m1, m2)).toBe(40);
  });

  it("lowers score for members with very different skill levels", () => {
    const specialist = member({
      skills: { frontend: 10, backend: 1, design: 1, data: 1, devops: 1, soft: 1 },
    });
    const generalist = member({
      skills: { frontend: 5, backend: 5, design: 5, data: 5, devops: 5, soft: 5 },
    });
    const identical = member({ skills: baseSkills });
    expect(calculateCompatibility(specialist, generalist)).toBeLessThan(
      calculateCompatibility(identical, identical),
    );
  });

  it("returns a value in the range [0, 90]", () => {
    const m1 = member({ skills: baseSkills, role: "frontend" });
    const m2 = member({
      skills: { frontend: 1, backend: 10, design: 1, data: 10, devops: 10, soft: 1 },
      role: "backend",
    });
    const score = calculateCompatibility(m1, m2);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(90);
  });
});

// ── scoreSkillsForRole ───────────────────────────────────────────────────────

describe("scoreSkillsForRole", () => {
  it("scores a frontend specialist higher for frontend than backend", () => {
    const frontendSkills = { frontend: 9, backend: 2, design: 5, data: 2, devops: 2, soft: 5 };
    const frontendScore = scoreSkillsForRole(frontendSkills, "frontend");
    const backendScore = scoreSkillsForRole(frontendSkills, "backend");
    expect(frontendScore).toBeGreaterThan(backendScore);
  });

  it("scores a backend specialist higher for backend than frontend", () => {
    const backendSkills = { frontend: 2, backend: 9, design: 2, data: 7, devops: 7, soft: 5 };
    expect(scoreSkillsForRole(backendSkills, "backend")).toBeGreaterThan(
      scoreSkillsForRole(backendSkills, "frontend"),
    );
  });

  it("returns 100 for perfect skills in any known role", () => {
    const perfect = { frontend: 10, backend: 10, design: 10, data: 10, devops: 10, soft: 10 };
    expect(scoreSkillsForRole(perfect, "frontend")).toBe(100);
    expect(scoreSkillsForRole(perfect, "backend")).toBe(100);
    expect(scoreSkillsForRole(perfect, "design")).toBe(100);
  });

  it("uses equal weights for unknown roles", () => {
    const even = { frontend: 6, backend: 6, design: 6, data: 6, devops: 6, soft: 6 };
    // Equal skills → equal weights → score = 60
    expect(scoreSkillsForRole(even, "unknown-role")).toBe(60);
  });

  it("returns a value in [0, 100]", () => {
    const skills = { frontend: 3, backend: 7, design: 5, data: 4, devops: 6, soft: 8 };
    const score = scoreSkillsForRole(skills, "devops");
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

// ── filterMembers ────────────────────────────────────────────────────────────

describe("filterMembers", () => {
  const members = [
    member({ uid: "1", role: "frontend", squadStatus: "open" }),
    member({ uid: "2", role: "backend", squadStatus: "looking" }),
    member({ uid: "3", role: "frontend", squadStatus: "closed" }),
    member({ uid: "4", role: "design", squadStatus: "open" }),
  ];

  it("returns all members when no filters are provided", () => {
    expect(filterMembers(members)).toHaveLength(4);
  });

  it("filters by role", () => {
    const result = filterMembers(members, "frontend");
    expect(result).toHaveLength(2);
    expect(result.every((m) => m.role === "frontend")).toBe(true);
  });

  it("filters by squadStatus", () => {
    const result = filterMembers(members, undefined, "open");
    expect(result).toHaveLength(2);
    expect(result.every((m) => m.squadStatus === "open")).toBe(true);
  });

  it("filters by both role and squadStatus (AND logic)", () => {
    const result = filterMembers(members, "frontend", "open");
    expect(result).toHaveLength(1);
    expect(result[0].uid).toBe("1");
  });

  it("returns empty array when no members match", () => {
    expect(filterMembers(members, "devops")).toHaveLength(0);
  });
});

// ── sortByCompatibility ──────────────────────────────────────────────────────

describe("sortByCompatibility", () => {
  it("places the most compatible member first", () => {
    const target = member({ uid: "target", skills: baseSkills, tags: [] });
    const similar = member({
      uid: "similar",
      skills: baseSkills,
      tags: [],
    });
    const different = member({
      uid: "different",
      skills: { frontend: 1, backend: 9, design: 1, data: 9, devops: 9, soft: 1 },
      tags: [{ name: "React", sentiment: "veto" }],
    });

    const sorted = sortByCompatibility([different, similar], target);
    expect(sorted[0].uid).toBe("similar");
    expect(sorted[1].uid).toBe("different");
  });

  it("preserves all members in output", () => {
    const target = member({ uid: "t" });
    const pool = [member({ uid: "a" }), member({ uid: "b" }), member({ uid: "c" })];
    expect(sortByCompatibility(pool, target)).toHaveLength(3);
  });
});

// ── getTopCompatibleMembers ──────────────────────────────────────────────────

describe("getTopCompatibleMembers", () => {
  it("returns at most `limit` members", () => {
    const target = member({ uid: "t" });
    const pool = Array.from({ length: 20 }, (_, i) => member({ uid: String(i) }));
    expect(getTopCompatibleMembers(pool, target, 5)).toHaveLength(5);
  });

  it("returns all members when pool is smaller than limit", () => {
    const target = member({ uid: "t" });
    const pool = [member({ uid: "a" }), member({ uid: "b" })];
    expect(getTopCompatibleMembers(pool, target, 10)).toHaveLength(2);
  });

  it("defaults to top 10", () => {
    const target = member({ uid: "t" });
    const pool = Array.from({ length: 15 }, (_, i) => member({ uid: String(i) }));
    expect(getTopCompatibleMembers(pool, target)).toHaveLength(10);
  });
});
