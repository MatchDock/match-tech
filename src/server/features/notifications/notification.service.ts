import nodemailer from "nodemailer";

async function getTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  console.log("Criando conta de testes Ethereal Mail para envio de notificações...");
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export async function sendEmail({
  to,
  toName,
  senderName,
  messageText,
}: {
  to: string;
  toName: string;
  senderName: string;
  messageText: string;
}) {
  const transporter = await getTransporter();
  const appUrl = process.env.APP_URL || "http://localhost:3000";

  const mailOptions = {
    from: '"Match Tech" <no-reply@matchtech.com>',
    to: `"${toName}" <${to}>`,
    subject: `⚡ Nova mensagem de ${senderName} na Match Tech!`,
    text: `Olá ${toName}, você recebeu uma nova mensagem de ${senderName} na Match Tech!\n\nMensagem:\n"${messageText}"\n\nResponda acessando a plataforma: ${appUrl}/messages`,
    html: `
      <div style="font-family: monospace; background-color: #F3F3F3; border: 4px solid #000; padding: 24px; max-width: 600px; margin: 0 auto; box-shadow: 8px 8px 0px 0px #000;">
        <div style="background-color: #000; color: #B8FF29; padding: 16px; border-bottom: 4px solid #000; font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
          MATCH_TECH // NOTIFICAÇÃO
        </div>
        <div style="padding: 20px 0; color: #000;">
          <p style="font-size: 16px; font-weight: bold; text-transform: uppercase;">
            Olá ${toName},
          </p>
          <p style="font-size: 14px; line-height: 1.6;">
            O operador <strong>${senderName}</strong> enviou uma notificação para você na Match Tech:
          </p>
          <div style="background-color: #FFF; border: 3px solid #000; padding: 16px; margin: 20px 0; box-shadow: 4px 4px 0px 0px #000; font-size: 14px; white-space: pre-wrap; font-family: monospace;">
            "${messageText}"
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 24px;">
            Para responder, acesse a plataforma clicando no link abaixo:
          </p>
          <div style="margin: 20px 0;">
            <a href="${appUrl}/messages" style="display: inline-block; background-color: #00E5FF; color: #000; border: 3px solid #000; padding: 12px 24px; font-weight: bold; text-transform: uppercase; text-decoration: none; box-shadow: 4px 4px 0px 0px #000;">
              ACESSAR MENSAGENS ⚡
            </a>
          </div>
        </div>
        <div style="border-top: 3px solid #000; padding-top: 16px; font-size: 10px; color: #666; text-transform: uppercase;">
          [SISTEMA DE COMUNICAÇÃO MATCH TECH] &copy; 2026
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`E-mail enviado com sucesso! MessageID: ${info.messageId}`);

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[ETHEREAL MAIL] Link de visualização do e-mail: ${previewUrl}`);
    return { previewUrl };
  }
  return { success: true };
}
