import type { FirebaseOptions } from "firebase/app";

export const firebaseClientConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firestoreDatabaseId =
  import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "(default)";

export function validateFirebaseClientConfig() {
  const requiredValues = {
    apiKey: firebaseClientConfig.apiKey,
    authDomain: firebaseClientConfig.authDomain,
    projectId: firebaseClientConfig.projectId,
    appId: firebaseClientConfig.appId,
  };

  const missingKeys = Object.entries(requiredValues)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase client environment variables: ${missingKeys.join(", ")}`
    );
  }
}