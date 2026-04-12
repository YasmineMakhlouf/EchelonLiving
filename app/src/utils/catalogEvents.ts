/**
 * catalogEvents
 * Cross-tab and in-tab catalog change event bus utilities.
 */
export type CatalogScope = "all" | "products" | "categories";

export interface CatalogChangeDetail {
  scope: CatalogScope;
  timestamp: number;
}

const CATALOG_CHANGE_EVENT = "echelon-catalog-changed";
const CATALOG_CHANGE_STORAGE_KEY = "echelon-catalog-change";
const CATALOG_CHANGE_CHANNEL = "echelon-catalog-channel";

const isCatalogScope = (value: unknown): value is CatalogScope => {
  return value === "all" || value === "products" || value === "categories";
};

export const emitCatalogChange = (scope: CatalogScope = "all") => {
  const detail: CatalogChangeDetail = {
    scope,
    timestamp: Date.now(),
  };

  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent<CatalogChangeDetail>(CATALOG_CHANGE_EVENT, { detail }));

  // BroadcastChannel propagates updates between open tabs in the same origin.
  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(CATALOG_CHANGE_CHANNEL);
    channel.postMessage(detail);
    channel.close();
  }

  try {
    // Storage writes trigger "storage" events for tabs that do not use BroadcastChannel.
    localStorage.setItem(CATALOG_CHANGE_STORAGE_KEY, JSON.stringify(detail));
  } catch {
    // Ignore storage write failures (private mode/quota) because in-tab dispatch already fired.
  }
};

export const subscribeToCatalogChanges = (
  listener: (detail: CatalogChangeDetail) => void
) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<CatalogChangeDetail>;
    const detail = customEvent.detail;

    if (detail && isCatalogScope(detail.scope)) {
      listener(detail);
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key !== CATALOG_CHANGE_STORAGE_KEY || !event.newValue) {
      return;
    }

    try {
      const detail = JSON.parse(event.newValue) as Partial<CatalogChangeDetail>;

      if (detail && isCatalogScope(detail.scope)) {
        listener({
          scope: detail.scope,
          timestamp: typeof detail.timestamp === "number" ? detail.timestamp : Date.now(),
        });
      }
    } catch {
      listener({ scope: "all", timestamp: Date.now() });
    }
  };

  let channel: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(CATALOG_CHANGE_CHANNEL);
    channel.onmessage = (event: MessageEvent<CatalogChangeDetail>) => {
      const detail = event.data;
      if (detail && isCatalogScope(detail.scope)) {
        listener(detail);
      }
    };
  }

  window.addEventListener(CATALOG_CHANGE_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(CATALOG_CHANGE_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
    channel?.close();
  };
};