import type { Request, Response } from "express";

import { adminAuth } from "../../shared/lib/firebase-admin.server";

import { sendEmail } from "./notification.service";

interface EmailNotificationRequestBody {
  senderName: string;
  receiverId: string;
  messageText: string;
}

export async function postEmailNotification(req: Request, res: Response) {
  try {
    const { senderName, receiverId, messageText } = req.body as EmailNotificationRequestBody;

    if (!senderName || !receiverId || !messageText) {
      return res
        .status(400)
        .json({ error: "Parâmetros senderName, receiverId e messageText são obrigatórios." });
    }

    console.log(
      `[API /email] Tentando enviar e-mail. Remetente: "${senderName}", Destinatário UID: "${receiverId}"`,
    );

    // Securely retrieve the receiver's user record (auth metadata) on the server side
    let userRecord;
    try {
      userRecord = await adminAuth.getUser(receiverId);
    } catch (err) {
      console.error(
        `[API /email] Erro ao buscar usuário do Firebase Auth para UID "${receiverId}":`,
        err,
      );
      const errMessage = err instanceof Error ? err.message : String(err);
      return res.status(404).json({
        error: `Destinatário não encontrado no sistema de autenticação (UID: ${receiverId}). Detalhes: ${errMessage}`,
      });
    }

    const receiverEmail = userRecord.email;
    if (!receiverEmail) {
      return res.status(400).json({ error: "O destinatário não possui um e-mail cadastrado." });
    }

    const receiverName = userRecord.displayName || "Operador Match Tech";

    const result = await sendEmail({
      to: receiverEmail,
      toName: receiverName,
      senderName,
      messageText,
    });

    return res.json({ success: true, ...result });
  } catch (error) {
    console.error("Erro no controlador postEmailNotification:", error);
    const message = error instanceof Error ? error.message : "Erro inesperado do servidor";
    return res.status(500).json({ error: message });
  }
}
