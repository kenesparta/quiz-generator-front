"use client";

import { useState } from "react";
import { BASE_URL } from "@/config/api";

interface UseLogoutReturn {
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

export const useLogout = (redirectTo = "/admin/login"): UseLogoutReturn => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async (): Promise<void> => {
    setIsLoggingOut(true);
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await fetch(`${BASE_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("expires_in");
      window.location.href = redirectTo;
    }
  };

  return { logout, isLoggingOut };
};
