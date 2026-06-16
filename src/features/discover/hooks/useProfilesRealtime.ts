import { useMemo } from "react";

import { sortProfiles } from "../model/discover.selectors";
import type { Profile } from "../model/discover.types";

import { useFirestoreSubscription } from "@/shared/hooks/useFirestoreSubscription";

export function useProfilesRealtime(currentUserId?: string) {
  const { data, loading, error } = useFirestoreSubscription<Profile>({
    collectionName: "profiles",
  });

  const profiles = useMemo(() => {
    console.log("useProfilesRealtime: raw data from Firestore:", data);
    console.log("useProfilesRealtime: currentUserId:", currentUserId);
    const sorted = currentUserId ? sortProfiles(data, currentUserId) : [];
    console.log("useProfilesRealtime: sorted profiles:", sorted);
    return sorted;
  }, [data, currentUserId]);

  return { profiles, loading, error };
}
