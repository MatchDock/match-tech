import type { Profile } from "./discover.types";

import { sortByCurrentUserAndName } from "@/shared/lib/utils/entity";

export function sortProfiles(profiles: Profile[], currentUserId?: string): Profile[] {
  return sortByCurrentUserAndName(profiles, currentUserId);
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

export function getPopularTags(profiles: Profile[]): { topTags: string[]; allTags: string[] } {
  const counts: Record<string, number> = {};
  const displayLabels: Record<string, string> = {};

  profiles.forEach((profile) => {
    profile.canvas?.loves?.forEach((tag) => {
      const normalized = normalizeTag(tag);
      counts[normalized] = (counts[normalized] || 0) + 1;
      if (!displayLabels[normalized]) {
        displayLabels[normalized] = normalized;
      }
    });
    profile.canvas?.comfort?.forEach((tag) => {
      const normalized = normalizeTag(tag);
      counts[normalized] = (counts[normalized] || 0) + 1;
      if (!displayLabels[normalized]) {
        displayLabels[normalized] = normalized;
      }
    });
  });

  const sortedByCount = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return {
    topTags: sortedByCount.slice(0, 3).map(([normalizedTag]) => displayLabels[normalizedTag]),
    allTags: Object.keys(counts)
      .map((normalizedTag) => displayLabels[normalizedTag])
      .sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" })),
  };
}

export function filterProfiles(
  profiles: Profile[],
  filters: {
    searchQuery: string;
    selectedRole: string;
    selectedStatus: string;
    selectedTag: string;
  },
): Profile[] {
  const query = filters.searchQuery.trim().toLowerCase();
  const normalizedSelectedTag = filters.selectedTag ? normalizeTag(filters.selectedTag) : "";

  return profiles.filter((profile) => {
    const matchesSearch =
      !query ||
      profile.name?.toLowerCase().includes(query) ||
      profile.github?.toLowerCase().includes(query) ||
      profile.bio?.toLowerCase().includes(query);

    const matchesRole =
      filters.selectedRole === "ALL" ||
      profile.primaryRole === filters.selectedRole ||
      profile.secondaryRoles?.includes(filters.selectedRole);

    const matchesStatus =
      filters.selectedStatus === "ALL" || profile.status === filters.selectedStatus;

    const matchesTag =
      !filters.selectedTag ||
      profile.canvas?.loves?.some((tag) => normalizeTag(tag) === normalizedSelectedTag) ||
      profile.canvas?.comfort?.some((tag) => normalizeTag(tag) === normalizedSelectedTag);

    return Boolean(matchesSearch && matchesRole && matchesStatus && matchesTag);
  });
}

export function getInitialPersona(profile: Profile) {
  if (profile.roastBrutal) return "brutal" as const;
  if (profile.roastMild) return "mild" as const;
  return "brutal" as const;
}

export function getDisplayedRoast(profile: Profile, persona: "brutal" | "mild" | null): string {
  if (persona === "brutal") {
    return profile.roastBrutal || profile.roast || "";
  }

  return profile.roastMild || profile.roastBrutal || profile.roast || "";
}
