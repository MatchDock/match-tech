import { useMemo, useState } from "react";

import { filterProfiles, getPopularTags } from "../model/discover.selectors";
import type { Profile } from "../model/discover.types";

export function useDiscoverFilters(profiles: Profile[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("");

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
    clearSelectedTag: () => setSelectedTag(""),
  };
}
