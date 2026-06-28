import type { Request, Response } from "express";

import { deleteProfileRoast } from "./roast.repository.js";
import { generateRoastStream } from "./roast.service.js";
import type { RoastPersona, RoastRequestBody } from "./roast.types.js";

export async function deleteRoast(req: Request, res: Response) {
  const { memberId } = req.params;
  const persona = req.query.persona as RoastPersona | undefined;

  if (!memberId) {
    res.status(400).json({ error: "Missing memberId" });
    return;
  }

  await deleteProfileRoast(memberId, persona);
  res.status(200).json({ success: true });
}

export async function postRoast(req: Request, res: Response) {
  const body = req.body as RoastRequestBody;
  const { memberId, memberData } = body;

  if (!memberId || !memberData) {
    res.status(400).json({ error: "Missing memberId or memberData" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    for await (const chunk of generateRoastStream(body)) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    const errorMessage = message.includes("API key not valid")
      ? "Chave da API do Gemini inválida ou não configurada. Por favor, adicione uma chave válida no painel de configurações."
      : message;
    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
  } finally {
    res.end();
  }
}
