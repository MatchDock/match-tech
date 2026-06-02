import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import {
  firebaseClientConfig,
  firestoreDatabaseId,
  validateFirebaseClientConfig,
} from "./firebase.config";

validateFirebaseClientConfig();

const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseClientConfig);

export { app };

export const auth = getAuth(app);

export const db =
  getApps().length > 1
    ? getFirestore(app, firestoreDatabaseId)
    : initializeFirestore(
        app,
        {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        },
        firestoreDatabaseId
      );