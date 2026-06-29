const { initializeTestEnvironment, assertFails, assertSucceeds } = require("@firebase/rules-unit-testing");
const { doc, setDoc, serverTimestamp, getDoc } = require("firebase/firestore");
const fs = require("fs");

async function runTests() {
  const rules = fs.readFileSync("firestore.rules", "utf8");
  const testEnv = await initializeTestEnvironment({
    projectId: "match-tech-test-rules",
    firestore: { rules },
  });

  const alice = testEnv.authenticatedContext("alice", { email: "alice@example.com" });
  
  // Test reading skills
  console.log("Testing read skill...");
  await assertSucceeds(getDoc(doc(alice.firestore(), "skills", "react")));

  // Test creating skill
  console.log("Testing create skill...");
  await assertSucceeds(
    setDoc(doc(alice.firestore(), "skills", "react"), {
      id: "react",
      name: "React",
      normalizedName: "react",
      category: "core_tech",
      status: "pending",
      usageCount: 1,
      createdBy: "",
      createdAt: serverTimestamp(),
    })
  );

  console.log("All tests passed!");
  await testEnv.cleanup();
}

runTests().catch(console.error);
