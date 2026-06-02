import type { Request, Response } from "express";

import { generateMatchSuggestions } from "./match.service";
import type { MatchRequestBody } from "./match.types";

export async function postMatch(req: Request, res: Response) {
  try {
    const body = req.body as MatchRequestBody;
    const { challengeDesc, members } = body;

    if (!challengeDesc || !Array.isArray(members)) {
      return res.status(400).json({
        error: "Missing challengeDesc or invalid members payload",
      });
    }

    const result = await generateMatchSuggestions(body);

    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";

    const errorMessage = message.includes("API key not valid")
      ? "Chave da API do Gemini inválida ou não configurada. Por favor, adicione uma chave válida no painel de configurações."
      : message;

    return res.status(500).json({ error: errorMessage });
  }
}
