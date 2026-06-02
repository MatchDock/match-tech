import type { Express } from "express";

import { matchRouter } from "../features/oraculo/match.routes";
import { roastRouter } from "../features/roast/roast.routes";

export function registerRoutes(app: Express) {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/roast", roastRouter);
  app.use("/api/oraculo/match", matchRouter);
}
