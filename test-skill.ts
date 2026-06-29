import "dotenv/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./src/shared/lib/firebase/firebase.client";

async function test() {
  const skill = {
    id: "test skill",
    name: "Test Skill",
    normalizedName: "test skill",
    category: "core_tech",
    status: "pending",
    usageCount: 1,
    createdBy: "",
  };

  console.log("Trying to create skill...");
  try {
    await setDoc(doc(db, "skills", skill.normalizedName), {
      ...skill,
      createdAt: serverTimestamp(),
    }, { merge: false });
    console.log("Success!");
  } catch (err) {
    console.error("Failed:", err);
  }
}

test();
