/**
 * CatalogEventsController
 * Streams server-sent events (SSE) to clients watching catalog updates.
 */
import { Request, Response } from "express";
import CatalogEventsService from "../services/CatalogEventsService";

class CatalogEventsController {
  static stream(_req: Request, res: Response): void {
    // Keep an open SSE connection so clients receive live catalog notifications.
    CatalogEventsService.subscribe(res);

    res.on("close", () => {
      // Always unsubscribe on disconnect to avoid stale response handles.
      CatalogEventsService.unsubscribe(res);
      res.end();
    });
  }
}

export default CatalogEventsController;
