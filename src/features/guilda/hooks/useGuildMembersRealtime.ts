import { useMemo } from "react";

import { sortMembers } from "../model/guilda.selectors";
import type { GuildMember } from "../model/guilda.types";

import { useFirestoreSubscription } from "@/shared/hooks/useFirestoreSubscription";

export function useGuildMembersRealtime(currentUserId?: string) {
  const { data, loading, error } = useFirestoreSubscription<GuildMember>({
    collectionName: "profiles",
  });

  const members = useMemo(
    () => (currentUserId ? sortMembers(data, currentUserId) : []),
    [data, currentUserId],
  );

  return { members, loading, error };
}
