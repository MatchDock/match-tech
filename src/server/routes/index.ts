import type { Express } from "express";

import { notificationRouter } from "../features/notifications/notification.routes.js";
import { matchRouter } from "../features/oraculo/match.routes.js";
import { roastRouter } from "../features/roast/roast.routes.js";

export function registerRoutes(app: Express) {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/roast", roastRouter);
  app.use("/api/oraculo/match", matchRouter);
  app.use("/api/notifications", notificationRouter);
}
