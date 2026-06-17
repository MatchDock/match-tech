import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as {
    projectId?: string;
    project_id?: string;
    clientEmail?: string;
    client_email?: string;
    privateKey?: string;
    private_key?: string;
  };

  const projectId = parsed.projectId ?? parsed.project_id;
  const clientEmail = parsed.clientEmail ?? parsed.client_email;
  const privateKey = parsed.privateKey ?? parsed.private_key;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT in environment variables");
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
}

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const serviceAccount = getServiceAccount();

  if (serviceAccount) {
    return initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return initializeApp();
}

const adminApp = getFirebaseAdminApp();

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
