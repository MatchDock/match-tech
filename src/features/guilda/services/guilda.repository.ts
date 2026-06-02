import { doc, updateDoc } from "firebase/firestore";

import type { GuildMember } from "../model/guilda.types";

import type { RoastPersona } from "@/domain/entities/Shared";
import { db } from "@/shared/lib/firebase/firebase.client";

export async function saveRoast(memberId: string, roast: string, persona: RoastPersona) {
  const updateData: Partial<GuildMember> & { updatedAt: Date } = {
    updatedAt: new Date(),
    ...(persona === "brutal" ? { roastBrutal: roast } : { roastMild: roast }),
  };

  await updateDoc(doc(db, "members", memberId), updateData);

  return updateData;
}
