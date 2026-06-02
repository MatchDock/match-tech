import { Router } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { postMatch } from "./match.controller";

export const matchRouter = Router();

matchRouter.post("/", asyncHandler(postMatch));