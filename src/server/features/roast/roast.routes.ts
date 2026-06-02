import { Router } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { postRoast } from "./roast.controller";

export const roastRouter = Router();

roastRouter.post("/", asyncHandler(postRoast));