import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";

import { useAuth } from "../hooks/useAuth";

import "./LoginPage.css";

//SCHÉMA DE VALIDATION
const loginSchema = z.object({
  username: z.string().trim().min(1, "L'identifiant est obligatoire"),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const loginRequestRef = useRef(null);

  useEffect(() => {
    return () => loginRequestRef.current?.abort();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // SOUMISSION DU FORMULAIRE

  async function onSubmit(data) {
    loginRequestRef.current?.abort();

    const controller = new AbortController();
    loginRequestRef.current = controller;

    setServerError("");

    try {
      await login(data.username, data.password, controller.signal);

      if (controller.signal.aborted) return;

      const requestedPage = location.state?.from;
      const destination = requestedPage
        ? `${requestedPage.pathname}${requestedPage.search}${requestedPage.hash}`
        : "/";

      navigate(destination, { replace: true });
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      } else if (error?.code === "INVALID_CREDENTIALS") {
        setServerError("Identifiants incorrects.");
      } else if (error instanceof TypeError) {
        setServerError(
          "Impossible de contacter le serveur. Vérifiez votre connexion.",
        );
      } else {
        setServerError(
          "Le service de connexion est temporairement indisponible.",
        );
      }
    } finally {
      if (loginRequestRef.current === controller) {
        loginRequestRef.current = null;
      }
    }
  }
  return (
    <section className="login-page">
      <div className="login-card">
        <span className="login-intro">VOTRE ESPACE</span>

        <h1>Heureux de vous retrouver.</h1>

        <p className="login-description">
          Connectez-vous pour retrouver votre espace personnel.
        </p>

        <form
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event);
          }}
          noValidate
        >
          {/* IDENTIFIANT */}
          <div className="login-field">
            <label htmlFor="username">Identifiant</label>

            <input
              id="username"
              type="text"
              placeholder="Votre identifiant"
              autoComplete="username"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? "username-error" : undefined}
              {...register("username")}
            />

            {errors.username && (
              <p className="field-error" id="username-error">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* MOT DE PASSE */}
          <div className="login-field">
            <label htmlFor="password">Mot de passe</label>

            <input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />

            {errors.password && (
              <p className="field-error" id="password-error">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* ERREUR API */}
          {serverError && (
            <p className="login-error" role="alert">
              {serverError}
            </p>
          )}

          {/* CONNEXION */}
          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Connexion en cours..."
            ) : (
              <>
                Se connecter
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <Link to="/" className="login-back">
          ← Retour à la boutique
        </Link>
      </div>
    </section>
  );
}

export default LoginPage;
