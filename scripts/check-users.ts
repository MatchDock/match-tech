import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as dotenv from "dotenv";

dotenv.config();

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT");
  process.exit(1);
}

const parsed = JSON.parse(raw);
const projectId = parsed.projectId ?? parsed.project_id;
const clientEmail = parsed.clientEmail ?? parsed.client_email;
const privateKey = parsed.privateKey ?? parsed.private_key;

const app = initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey: privateKey?.replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth(app);

async function main() {
  const list = await auth.listUsers();
  console.log(`Encontrados ${list.users.length} usuários no Firebase Auth:`);
  list.users.forEach(u => {
    console.log(`UID: ${u.uid}, Email: ${u.email}, Name: ${u.displayName}`);
  });
}

main().catch(console.error);
