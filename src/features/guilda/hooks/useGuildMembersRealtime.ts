import { useEffect, useState } from "react";
import { sortMembers } from "../model/guilda.selectors";
import type { GuildMember } from "../model/guilda.types";
import { subscribeToGuildMembers } from "../services/guilda.repository";

export function useGuildMembersRealtime(currentUserId?: string) {
  const [members, setMembers] = useState<GuildMember[]>([]);

  useEffect(() => {
    if (!currentUserId) {
      setMembers([]);
      return;
    }

    const unsubscribe = subscribeToGuildMembers((data) => {
      setMembers(sortMembers(data, currentUserId));
    });

    return unsubscribe;
  }, [currentUserId]);

  return {
    members,
  };
}
