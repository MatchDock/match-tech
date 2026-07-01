import type { Profile } from "./discover.types";

import { sortByCurrentUserAndName } from "@/shared/lib/utils/entity";

export function sortProfiles(profiles: Profile[], currentUserId?: string): Profile[] {
  return sortByCurrentUserAndName(profiles, currentUserId);
}

export function getPopularTags(profiles: Profile[]): { topTags: string[]; allTags: string[] } {
  const counts: Record<string, number> = {};

  profiles.forEach((profile) => {
    profile.canvas?.loves?.forEach((tag) => {
      const normalizedTag = tag.toLowerCase();
      counts[normalizedTag] = (counts[normalizedTag] || 0) + 1;
    });
    profile.canvas?.comfort?.forEach((tag) => {
      const normalizedTag = tag.toLowerCase();
      counts[normalizedTag] = (counts[normalizedTag] || 0) + 1;
    });
  });

  const sortedByCount = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return {
    topTags: sortedByCount.slice(0, 3).map(([tag]) => tag),
    allTags: Object.keys(counts).sort((a, b) =>
      a.localeCompare(b, "pt-BR", { sensitivity: "base" }),
    ),
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
      profile.canvas?.loves?.some((tag) => tag.toLowerCase() === filters.selectedTag.toLowerCase()) ||
      profile.canvas?.comfort?.some((tag) => tag.toLowerCase() === filters.selectedTag.toLowerCase());

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
