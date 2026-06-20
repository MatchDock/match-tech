import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "../../shared/lib/firebase-admin.server";

import type { RoastPersona } from "./roast.types";

export async function deleteProfileRoast(memberId: string, persona?: RoastPersona) {
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (persona === "brutal") {
    updateData.roastBrutal = FieldValue.delete();
  } else if (persona === "mild") {
    updateData.roastMild = FieldValue.delete();
  } else {
    updateData.roast = FieldValue.delete();
  }

  await adminDb.collection("profiles").doc(memberId).update(updateData);
}

export async function saveProfileRoast(
  memberId: string,
  roastText: string,
  persona?: RoastPersona,
) {
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (persona === "brutal") {
    updateData.roastBrutal = roastText;
  } else if (persona === "mild") {
    updateData.roastMild = roastText;
  } else {
    updateData.roast = roastText;
  }

  await adminDb.collection("profiles").doc(memberId).update(updateData);
}
