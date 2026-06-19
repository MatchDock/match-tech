import { getRoastSystemInstruction } from "./roast.prompts";
import { saveProfileRoast } from "./roast.repository";
import type { RoastPersona, RoastRequestBody } from "./roast.types";

import { getGeminiClient } from "@/server/shared/lib/gemini.server";

export async function* generateRoastStream({
  memberId,
  memberData,
  persona,
}: RoastRequestBody): AsyncGenerator<string> {
  const ai = getGeminiClient();

  const result = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: `Analise este membro. DADOS DO MEMBRO:\n${JSON.stringify(memberData, null, 2)}`,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      systemInstruction: getRoastSystemInstruction(persona as RoastPersona),
    },
  });

  let fullText = "";

  for await (const chunk of result) {
    const text = chunk.text ?? "";
    if (text) {
      fullText += text;
      yield text;
    }
  }

  await saveProfileRoast(memberId, fullText, persona);
}
