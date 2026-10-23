const API_URL = import.meta.env.VITE_API_URL;

function createAuthError(message, code) {
  const error = new Error(message);
  error.code = code;

  return error;
}

// CONNECTER UN UTILISATEUR

export async function loginUser(username, password, signal) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      password,
    }),
    signal,
  });

  if (!response.ok) {
    const invalidCredentials = response.status === 400 || response.status === 401;

    throw createAuthError(
      invalidCredentials
        ? "Identifiants incorrects."
        : "Le service de connexion est indisponible.",
      invalidCredentials ? "INVALID_CREDENTIALS" : "AUTH_SERVICE_ERROR",
    );
  }

  return response.json();
}

// RECUPÉRER L'UTILISATEUR CONNECTÉ
export async function getCurrentUser(accessToken, signal) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal,
  });

  if (!response.ok) {
    throw new Error("Session expirée ou invalide.");
  }

  return response.json();
}

// RENOUVELER LA SESSION
export async function refreshSession(refreshToken, signal) {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
    signal,
  });

  if (!response.ok) {
    throw new Error("Impossible de renouveler la session");
  }

  return response.json();
}
