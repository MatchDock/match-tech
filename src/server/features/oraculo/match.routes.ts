import { Router } from "express";
import rateLimit from "express-rate-limit";

import { asyncHandler } from "../../shared/utils/async-handler.js";

import { postMatch } from "./match.controller.js";

// 10 match requests per user per minute
const matchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Aguarde um momento e tente novamente." },
});

export const matchRouter = Router();

matchRouter.post("/", matchLimiter, asyncHandler(postMatch));
