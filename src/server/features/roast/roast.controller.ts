import type { Request, Response } from "express";
import { generateRoast } from "./roast.service";
import type { RoastRequestBody } from "./roast.types";

export async function postRoast(req: Request, res: Response) {
  try {
    const body = req.body as RoastRequestBody;
    const { memberId, memberData } = body;

    if (!memberId || !memberData) {
      return res
        .status(400)
        .json({ error: "Missing memberId or memberData" });
    }

    const roast = await generateRoast(body);

    return res.json({ roast });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";

    const errorMessage = message.includes("API key not valid")
      ? "Chave da API do Gemini inválida ou não configurada. Por favor, adicione uma chave válida no painel de configurações."
      : message;

    return res.status(500).json({ error: errorMessage });
  }
}