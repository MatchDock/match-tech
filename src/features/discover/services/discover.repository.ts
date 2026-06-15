import { doc, updateDoc } from "firebase/firestore";

import type { Profile } from "../model/discover.types";

import { db } from "@/shared/lib/firebase/firebase.client";

export async function updateProfile(profileId: string, data: Partial<Profile>) {
  await updateDoc(doc(db, "profiles", profileId), data);
}
