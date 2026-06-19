import { Router } from "express";
import rateLimit from "express-rate-limit";

import { asyncHandler } from "../../shared/utils/async-handler";

import { deleteRoast, postRoast } from "./roast.controller";

// 5 roast requests per user per minute — Gemini calls are expensive
const roastLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Aguarde um momento e tente novamente." },
});

export const roastRouter = Router();

roastRouter.post("/", roastLimiter, asyncHandler(postRoast));
roastRouter.delete("/:memberId", asyncHandler(deleteRoast));
