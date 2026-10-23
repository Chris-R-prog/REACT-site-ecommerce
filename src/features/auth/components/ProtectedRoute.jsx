import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ requireAdmin = false }) {
  const { user, isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  // Vérification de la session en cours
  if (authLoading) {
    return <p>Vérification de votre session...</p>;
  }

  // Utilisateur non connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Utilisateur connecté, mais non administrateur
  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Autorisation accordée
  return <Outlet />;
}

export default ProtectedRoute;
