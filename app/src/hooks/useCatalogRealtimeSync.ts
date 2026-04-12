/**
 * useCatalogRealtimeSync
 * Subscribes to backend SSE catalog events and rebroadcasts them locally.
 */
import { useEffect } from "react";
import api from "../api/axios";
import { emitCatalogChange } from "../utils/catalogEvents";

const getCatalogEventsUrl = () => {
  const baseUrl = api.defaults.baseURL ?? "";

  if (!baseUrl) {
    return "/api/v1/events/catalog";
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBase}/events/catalog`;
};

export default function useCatalogRealtimeSync() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }

    // Connect once and keep the stream open for live catalog updates.
    const eventSource = new EventSource(getCatalogEventsUrl());

    eventSource.addEventListener("catalog-change", (event) => {
      try {
        const payload = JSON.parse((event as MessageEvent<string>).data) as { scope?: "all" | "products" | "categories" };
        emitCatalogChange(payload.scope ?? "all");
      } catch {
        // Fall back to broad refresh if payload parsing fails.
        emitCatalogChange();
      }
    });

    eventSource.onerror = () => {
    };

    return () => {
      eventSource.close();
    };
  }, []);
}