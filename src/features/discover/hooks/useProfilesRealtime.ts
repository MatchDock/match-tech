import { useMemo } from "react";

import { sortProfiles } from "../model/discover.selectors";
import type { Profile } from "../model/discover.types";

import { useFirestoreSubscription } from "@/shared/hooks/useFirestoreSubscription";

export function useProfilesRealtime(currentUserId?: string) {
  const { data, loading, error } = useFirestoreSubscription<Profile>({
    collectionName: "profiles",
  });

  const profiles = useMemo(
    () => (currentUserId ? sortProfiles(data, currentUserId) : []),
    [data, currentUserId],
  );

  return { profiles, loading, error };
}
