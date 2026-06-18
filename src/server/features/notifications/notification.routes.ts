import { Router } from "express";
import rateLimit from "express-rate-limit";

import { asyncHandler } from "../../shared/utils/async-handler";

import { postEmailNotification } from "./notification.controller";

// Limit to 5 notifications per minute to avoid spam abuse
const notificationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Muitas requisições de e-mail. Por favor, aguarde um minuto e tente novamente.",
  },
});

export const notificationRouter = Router();

notificationRouter.post("/email", notificationLimiter, asyncHandler(postEmailNotification));
