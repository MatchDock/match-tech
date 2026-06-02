import { useEffect, useState } from "react";
import { subscribeToProfiles } from "../services/discover.repository";
import { sortProfiles } from "../model/discover.selectors";
import type { Profile } from "../model/discover.types";

export function useProfilesRealtime(currentUserId?: string) {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (!currentUserId) {
      setProfiles([]);
      return;
    }

    const unsubscribe = subscribeToProfiles((data) => {
      setProfiles(sortProfiles(data, currentUserId));
    });

    return unsubscribe;
  }, [currentUserId]);

  return {
    profiles,
  };
}