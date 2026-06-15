import { useMemo } from "react";

import { filterProfiles, getPopularTags } from "../model/discover.selectors";
import type { Profile } from "../model/discover.types";
import { useDiscoverFiltersStore } from "../store/discoverFilters";

export function useDiscoverFilters(profiles: Profile[]) {
  const {
    searchQuery,
    selectedRole,
    selectedStatus,
    selectedTag,
    setSearchQuery,
    setSelectedRole,
    setSelectedStatus,
    setSelectedTag,
    clearSelectedTag,
  } = useDiscoverFiltersStore();

  const popularTags = useMemo(() => getPopularTags(profiles), [profiles]);

  const filteredProfiles = useMemo(
    () =>
      filterProfiles(profiles, {
        searchQuery,
        selectedRole,
        selectedStatus,
        selectedTag,
      }),
    [profiles, searchQuery, selectedRole, selectedStatus, selectedTag],
  );

  return {
    searchQuery,
    selectedRole,
    selectedStatus,
    selectedTag,
    popularTags,
    filteredProfiles,
    setSearchQuery,
    setSelectedRole,
    setSelectedStatus,
    setSelectedTag,
    clearSelectedTag,
  };
}
