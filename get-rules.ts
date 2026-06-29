import "dotenv/config";
import * as admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
const dbId = process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID!;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function run() {
  const securityRules = admin.securityRules();
  try {
    // The Rules API handles generic rules, let's try to get Firestore rules
    // Using the REST API directly is easier since the SDK might not expose getRules for specific DBs easily.
    console.log("Database ID from env:", dbId);
  } catch(e) {
    console.error(e);
  }
}

run();
