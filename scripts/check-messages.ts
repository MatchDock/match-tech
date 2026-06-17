import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
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

const db = getFirestore(app, process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "ai-studio-a1333439-9ab3-4356-9f79-ac211cc82b20");

async function main() {
  const snap = await db.collection("messages").limit(10).get();
  console.log(`Encontradas ${snap.size} mensagens:`);
  snap.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id}, SenderId: ${data.senderId}, ReceiverId: ${data.receiverId}, Text: "${data.text}"`);
  });
}

main().catch(console.error);
