import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";

import type { Profile } from "../model/discover.types";

import { db } from "@/shared/lib/firebase/firebase.client";

export function subscribeToProfiles(
  onData: (profiles: Profile[]) => void,
  onError?: (error: unknown) => void,
) {
  const profilesQuery = query(collection(db, "profiles"));

  return onSnapshot(
    profilesQuery,
    (snapshot) => {
      const profiles = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Profile[];

      onData(profiles);
    },
    onError,
  );
}

export async function updateProfile(profileId: string, data: Partial<Profile>) {
  await updateDoc(doc(db, "profiles", profileId), data);
}
