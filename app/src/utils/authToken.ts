/**
 * authToken
 * Helpers for lightweight JWT expiry checks on the client.
 */

interface JwtPayload {
  exp?: number;
}

const decodeJwtPayload = (token: string): JwtPayload | null => {
  const segments = token.split(".");

  if (segments.length !== 3) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(segments[1])) as JwtPayload;
    return payload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return false;
  }

  return Date.now() >= payload.exp * 1000;
};
