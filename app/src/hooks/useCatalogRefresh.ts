/**
 * useCatalogRefresh
 * Returns a revision counter that increments when relevant catalog changes occur.
 */
import { useEffect, useState } from "react";
import { subscribeToCatalogChanges } from "../utils/catalogEvents";
import type { CatalogScope } from "../utils/catalogEvents";

const shouldRefreshForScope = (listenerScope: CatalogScope, changeScope: CatalogScope) => {
  return listenerScope === "all" || changeScope === "all" || listenerScope === changeScope;
};

export default function useCatalogRefresh(scope: CatalogScope = "all") {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    // Subscribers decide whether to refresh based on event scope matching.
    return subscribeToCatalogChanges((detail) => {
      if (shouldRefreshForScope(scope, detail.scope)) {
        setRevision((currentRevision) => currentRevision + 1);
      }
    });
  }, [scope]);

  return revision;
}