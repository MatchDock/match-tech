export interface EmailNotificationPayload {
  senderName: string;
  receiverId: string;
  messageText: string;
}

export interface EmailNotificationResponse {
  success: boolean;
  previewUrl?: string;
  error?: string;
}

export async function sendEmailNotification(
  payload: EmailNotificationPayload,
): Promise<EmailNotificationResponse> {
  const response = await fetch("/api/notifications/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as EmailNotificationResponse;

  if (!response.ok) {
    throw new Error(data.error || "Erro ao disparar notificação por e-mail.");
  }

  return data;
}
