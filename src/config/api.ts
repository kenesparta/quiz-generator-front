export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8008";

export function handleUnauthorized(response: Response): void {
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_in");
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }
}
