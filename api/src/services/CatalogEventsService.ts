/**
 * CatalogEventsService
 * Maintains server-sent event clients and broadcasts catalog changes.
 */
import { Response } from "express";

export type CatalogEventScope = "products" | "categories" | "all";
export type CatalogEventAction = "created" | "updated" | "deleted" | "changed";

interface CatalogEventPayload {
  scope: CatalogEventScope;
  action: CatalogEventAction;
  timestamp: number;
}

class CatalogEventsService {
  private static clients = new Set<Response>();
  private static keepAliveTimer: NodeJS.Timeout | null = null;

  static subscribe(res: Response): void {
    // SSE headers keep the connection open and disable buffering.
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();
    res.write("retry: 3000\n\n");

    this.clients.add(res);
    this.startKeepAlive();
  }

  static unsubscribe(res: Response): void {
    this.clients.delete(res);

    if (this.clients.size === 0 && this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  static emit(scope: CatalogEventScope, action: CatalogEventAction): void {
    const payload: CatalogEventPayload = {
      scope,
      action,
      timestamp: Date.now(),
    };

    const eventPayload = `event: catalog-change\ndata: ${JSON.stringify(payload)}\n\n`;

    // Fan out the event to all active subscribers.
    for (const client of this.clients) {
      client.write(eventPayload);
    }
  }

  private static startKeepAlive(): void {
    if (this.keepAliveTimer) {
      return;
    }

    this.keepAliveTimer = setInterval(() => {
      // Comment lines keep some proxies/load balancers from closing idle streams.
      for (const client of this.clients) {
        client.write(`: keepalive ${Date.now()}\n\n`);
      }
    }, 25000);
  }
}

export default CatalogEventsService;
