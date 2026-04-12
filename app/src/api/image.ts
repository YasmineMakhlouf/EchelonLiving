/**
 * image
 * Frontend api module for Echelon Living app.
 */
import api from "./axios";

export const toAbsoluteImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const baseUrl = api.defaults.baseURL ?? "";
  const apiRoot = baseUrl.replace(/\/api\/v1\/?$/, "");

  if (!apiRoot) {
    return imageUrl;
  }

  const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${apiRoot}${normalizedPath}`;
};