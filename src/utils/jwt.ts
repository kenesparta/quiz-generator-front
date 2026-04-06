export const getSubFromJWT = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.sub || null;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};
