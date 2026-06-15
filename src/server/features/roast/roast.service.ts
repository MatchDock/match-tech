import { getRoastSystemInstruction } from "./roast.prompts";
import { saveProfileRoast } from "./roast.repository";
import type { RoastPersona, RoastRequestBody } from "./roast.types";

import { getGeminiClient } from "@/server/shared/lib/gemini.server";

export async function generateRoast({ memberId, memberData, persona }: RoastRequestBody) {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Analise este membro. DADOS DO MEMBRO:\n${JSON.stringify(memberData, null, 2)}`,
    config: {
      systemInstruction: getRoastSystemInstruction(persona as RoastPersona),
    },
  });

  const roastText = response.text ?? "";

  if (!roastText) {
    throw new Error("A IA não retornou conteúdo para o roast.");
  }

  await saveProfileRoast(memberId, roastText, persona);

  return roastText;
}
