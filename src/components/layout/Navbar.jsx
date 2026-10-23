import { NavLink } from "react-router-dom";
import { UserRound, ShoppingBag, LogOut } from "lucide-react";

import { useCart } from "../../features/cart/hooks/useCart";
import { useAuth } from "../../features/auth/hooks/useAuth";

import Logo from "./Logo";

function Navbar() {
  // PANIER
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // AUTHENTIFICATION
  const { user, logout, authLoading } = useAuth();

  return (
    <header className="site-header">
      <Logo />

      {/* NAVIGATION PRINCIPALE */}
      <nav className="main-nav" aria-label="Navigation principale">
        <NavLink to="/" end>
          Découvrir
        </NavLink>

        <span className="nav-separator" aria-hidden="true">
          ·
        </span>
        <NavLink to="/products">Catalogue</NavLink>

        {/* LIEN ADMINISTRATION */}

        {user?.role === "admin" && (
          <>
            <span className="nav-separator" aria-hidden="true">
              ·
            </span>

            <NavLink to="/admin">Administration</NavLink>
          </>
        )}
      </nav>

      {/* ACTIONS UTILISATEURS */}

      <div className="nav-actions">
        {/* CONNEXION / DECONNEXION */}

        {!authLoading &&
          (user ? (
            <>
              <NavLink
                to="/profile"
                className="nav-user"
                aria-label="Accéder à mon profil"
              >
                <UserRound size={22} aria-hidden="true" />
                <span className="nav-user-name">
                  {user.firstName || user.username}
                </span>
              </NavLink>

              <button
                type="button"
                className="nav-logout"
                onClick={logout}
                aria-label="Se déconnecter"
                title="Se déconnecter"
              >
                <LogOut size={22} aria-hidden="true" />
              </button>
            </>
          ) : (
            <NavLink to="/login" aria-label="Se connecter">
              <UserRound size={22} aria-hidden="true" />
            </NavLink>
          ))}

        {/* PANIER */}
        <NavLink
          to="/cart"
          className="cart-icon"
          aria-label={`Panier, ${cartCount} article${cartCount > 1 ? "s" : ""}`}
        >
          <ShoppingBag size={22} aria-hidden="true" />

          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;
