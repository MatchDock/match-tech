/**
 * Migração: coleção `members` → `profiles`
 *
 * Contexto: o projeto originalmente usava `members` como coleção de perfis.
 * A coleção `profiles` é o destino definitivo. Este script copia os documentos
 * de `members` para `profiles`, preservando todos os dados e adicionando campos
 * ausentes necessários pelo schema de `profiles`.
 *
 * Uso:
 *   # Dry run (padrão — apenas mostra o que seria migrado):
 *   npx tsx scripts/migrate-members-to-profiles.ts
 *
 *   # Executar de fato:
 *   npx tsx scripts/migrate-members-to-profiles.ts --execute
 *
 * Pré-requisitos:
 *   FIREBASE_SERVICE_ACCOUNT=<json da service account> no ambiente
 *   (ou GOOGLE_APPLICATION_CREDENTIALS apontando para o arquivo JSON)
 *
 * Segurança:
 *   - Documentos já presentes em `profiles` NÃO são sobrescritos.
 *   - A coleção `members` não é modificada (somente leitura).
 *   - Todos os erros são reportados mas não interrompem o batch.
 */

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ── Firebase Admin init ──────────────────────────────────────────────────────

function initAdmin() {
  if (getApps().length > 0) return getApp();

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    const parsed = JSON.parse(raw) as {
      projectId: string;
      clientEmail: string;
      privateKey: string;
    };
    return initializeApp({
      credential: cert({ ...parsed, privateKey: parsed.privateKey.replace(/\\n/g, "\n") }),
    });
  }

  // Falls back to Application Default Credentials (gcloud auth)
  return initializeApp();
}

// ── Field mapping ─────────────────────────────────────────────────────────────

interface MemberDoc {
  userId?: string;
  guildId?: string;
  name?: string;
  photoURL?: string | null;
  github?: string;
  linkedin?: string;
  bio?: string;
  primaryRole?: string;
  secondaryRoles?: string[];
  skills?: Record<string, number>;
  canvas?: { loves?: string[]; comfort?: string[]; veto?: string[] };
  status?: string;
  eventId?: string;
  roast?: string;
  roastBrutal?: string;
  roastMild?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  [key: string]: unknown;
}

function toProfileDoc(memberId: string, data: MemberDoc): Record<string, unknown> {
  // Spread all fields then remove guildId (obsolete hardcoded field from old schema)
  const doc: Record<string, unknown> = { ...data };
  delete doc["guildId"];

  return {
    ...doc,
    // Ensure userId is set (some old docs used only guildId as identity)
    userId: data.userId ?? memberId,
    // Required profile fields with sensible defaults for migrated docs
    status: data.status ?? "looking",
    eventId: data.eventId ?? data.guildId ?? "tech_floripa_2026",
    bio: data.bio ?? "",
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function migrate(dryRun: boolean) {
  const app = initAdmin();
  const db = getFirestore(app);

  const membersSnap = await db.collection("members").get();

  if (membersSnap.empty) {
    console.log("Coleção `members` está vazia. Nada a migrar.");
    return;
  }

  console.log(`\nEncontrados ${membersSnap.size} documentos em \`members\`.`);
  console.log(dryRun ? "MODO DRY RUN — nenhuma escrita será feita.\n" : "MODO EXECUÇÃO\n");

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const memberDoc of membersSnap.docs) {
    const id = memberDoc.id;
    const data = memberDoc.data() as MemberDoc;

    try {
      const profileRef = db.collection("profiles").doc(id);
      const existing = await profileRef.get();

      if (existing.exists) {
        console.log(`  [SKIP]  ${id} — já existe em \`profiles\``);
        skipped++;
        continue;
      }

      const profileData = toProfileDoc(id, data);

      if (dryRun) {
        console.log(`  [DRY]   ${id} → seria migrado (name: ${String(data.name ?? "??")})`);
      } else {
        await profileRef.set(profileData);
        console.log(`  [OK]    ${id} migrado (name: ${String(data.name ?? "??")})`);
      }

      migrated++;
    } catch (err) {
      console.error(`  [ERRO]  ${id}:`, err);
      errors++;
    }
  }

  console.log("\n─────────────────────────────────────────");
  if (dryRun) {
    console.log(`Dry run concluído: ${migrated} seriam migrados, ${skipped} ignorados, ${errors} erros.`);
    console.log("Para executar de fato, rode com --execute");
  } else {
    console.log(`Migração concluída: ${migrated} migrados, ${skipped} ignorados, ${errors} erros.`);
  }
}

// ── Entry point ───────────────────────────────────────────────────────────────

const dryRun = !process.argv.includes("--execute");
migrate(dryRun).catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
