import { doc, getDocFromServer } from "firebase/firestore";

import { firebaseLog } from "../logger/logger";

import { db } from "./firebase.client";

export async function testFirebaseConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    firebaseLog.info("Firebase connection verified.");
    return true;
  } catch (error) {
    firebaseLog.error("Firebase connection check failed.", error);

    return false;
  }
}
