import type { Profile } from "./discover.types";

import { sortByCurrentUserAndName } from "@/shared/lib/utils/entity";

export function sortProfiles(profiles: Profile[], currentUserId?: string): Profile[] {
  return sortByCurrentUserAndName(profiles, currentUserId);
}

export function getPopularTags(profiles: Profile[]): string[] {
  const counts: Record<string, number> = {};

  profiles.forEach((profile) => {
    profile.canvas?.loves?.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);
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
      profile.canvas?.loves?.includes(filters.selectedTag) ||
      profile.canvas?.comfort?.includes(filters.selectedTag);

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
