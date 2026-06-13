import { buildMatchPrompt, matchSystemInstruction } from "./match.prompts";
import type { MatchRequestBody, MatchResponseDto } from "./match.types";

import { getGeminiClient } from "@/server/shared/lib/gemini.server";

function isValidMatchResponse(payload: unknown): payload is MatchResponseDto {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Record<string, unknown>;

  return Boolean(candidate.seguro && candidate.inovacao && candidate.surpresa);
}

export async function generateMatchSuggestions({
  challengeDesc,
  members,
}: MatchRequestBody): Promise<MatchResponseDto> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: buildMatchPrompt(challengeDesc, members),
    config: {
      responseMimeType: "application/json",
      systemInstruction: matchSystemInstruction,
    },
  });

  const responseText = response.text ?? "{}";

  let parsed: unknown;

  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error("O Oráculo alucinou um formato inválido. Tente novamente.");
  }

  if (!isValidMatchResponse(parsed)) {
    throw new Error("O Oráculo alucinou um formato inválido. Tente novamente.");
  }

  return parsed;
}
