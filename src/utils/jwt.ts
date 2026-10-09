interface JWTPayload {
  sub?: string;
  rol?: string;
  exp?: number;
}

// For UI decisions only: the signature is not checked here, the API verifies
// it on every request. Returns null for a missing, malformed or expired token.
const decodePayload = (token: string | null): JWTPayload | null => {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // JWTs are base64url; atob() needs the standard alphabet.
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload: JWTPayload = JSON.parse(atob(base64));
    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      return null;
    }
    return payload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export const getSubFromJWT = (token: string | null): string | null =>
  decodePayload(token)?.sub || null;

export const getRolFromJWT = (token: string | null): string | null =>
  decodePayload(token)?.rol || null;

export const isAdminOrPsicologo = (token: string | null): boolean => {
  const rol = getRolFromJWT(token);
  return rol === "admin" || rol === "psicologo";
};
