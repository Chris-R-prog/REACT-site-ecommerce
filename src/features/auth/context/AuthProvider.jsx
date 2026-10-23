import { useEffect, useState } from "react";

import { loginUser, getCurrentUser, refreshSession } from "../services/authApi";
import { AuthContext } from "./AuthContext";

const ACCESS_TOKEN_KEY = "lessentiel-token";
const REFRESH_TOKEN_KEY = "lessentiel-refresh-token";

function clearStoredSession() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

function hasValidTokens(tokens) {
  return Boolean(tokens?.accessToken && tokens?.refreshToken);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // RESTAURER LA SESSION
  useEffect(() => {
    const controller = new AbortController();

    async function restoreSession() {
      try {
        const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);

        // 1. Vérifier si l'accessToken fonctionne encore
        if (accessToken) {
          try {
            const userData = await getCurrentUser(
              accessToken,
              controller.signal,
            );

            setUser(userData);
            return;
          } catch (error) {
            if (error.name === "AbortError") throw error;

            // Le jeton n'est plus valide : on tente le renouvellement
          }
        }

        // 2. Renouveler la session si possible
        if (refreshToken) {
          const tokens = await refreshSession(refreshToken, controller.signal);

          if (!hasValidTokens(tokens)) {
            throw new Error("Jetons d'authentification manquants.");
          }

          const userData = await getCurrentUser(
            tokens.accessToken,
            controller.signal,
          );

          sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
          sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
          setUser(userData);
          return;
        }

        clearStoredSession();
        setUser(null);
      } catch (error) {
        if (error.name === "AbortError") return;

        // Impossible de restaurer la session
        clearStoredSession();
        setUser(null);
      } finally {
        if (!controller.signal.aborted) {
          setAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => controller.abort();
  }, []);

  // CONNEXION
  async function login(username, password, signal) {
    const data = await loginUser(username, password, signal);

    if (!hasValidTokens(data)) {
      throw new Error("Jetons d'authentification manquants.");
    }

    const userData = await getCurrentUser(data.accessToken, signal);

    sessionStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setUser(userData);

    return userData;
  }

  // DÉCONNEXION
  function logout() {
    clearStoredSession();
    setUser(null);
  }

  // PARTAGE DU CONTEXTE
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        authLoading,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
