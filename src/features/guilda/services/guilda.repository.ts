import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { db } from "../../../shared/lib/firebase/firebase.client";
import type { GuildMember, RoastPersona } from "../model/guilda.types";

type MembersListener = (members: GuildMember[]) => void;

export function subscribeToGuildMembers(listener: MembersListener) {
  const membersQuery = query(collection(db, "members"));

  return onSnapshot(membersQuery, (snapshot) => {
    const data = snapshot.docs.map((memberDoc) => ({
      id: memberDoc.id,
      ...memberDoc.data(),
    })) as GuildMember[];

    listener(data);
  });
}

export async function saveRoast(memberId: string, roast: string, persona: RoastPersona) {
  const updateData: Partial<GuildMember> & { updatedAt: Date } = {
    updatedAt: new Date(),
    ...(persona === "brutal" ? { roastBrutal: roast } : { roastMild: roast }),
  };

  await updateDoc(doc(db, "members", memberId), updateData);

  return updateData;
}
