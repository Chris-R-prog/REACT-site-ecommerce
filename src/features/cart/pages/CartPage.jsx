import { Link } from "react-router-dom";
import { ArrowRight, Trash2 } from "lucide-react";

import { formatPrice } from "../../../utils/formatPrice";
import { useCart } from "../hooks/useCart";

import "./CartPage.css";

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // CALCUL DU TOTAL
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // NOMBRE TOTAL D'ARTICLES
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // PANIER VIDE
  if (cartItems.length === 0) {
    return (
      <section className="cart-page">
        <h1>Votre panier</h1>
        <p>Votre panier est vide pour le moment.</p>

        <Link to="/products">Découvrir nos produits</Link>
      </section>
    );
  }

  // PANIER AVEC ARTICLES
  return (
    <section className="cart-page">
      <h1>Votre panier</h1>

      <div className="cart-layout">
        {/* LISTE DES ARTICLES */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              {/* IMAGE DU PRODUIT */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                {/* NOM ET PRIX */}
                <h2>{item.title}</h2>

                <p className="cart-item-price">{formatPrice(item.price)}</p>

                {/* STOCK DISPONIBLE */}
                {item.stock != null && (
                  <p className="cart-item-stock">
                    {item.stock} disponible
                    {item.stock === 1 ? "" : "s"}
                  </p>
                )}

                {/* ACTIONS SUR LE PRODUIT */}
                <div className="cart-item-actions">
                  {/* GESTION DE LA QUANTITÉ */}
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label={`Diminuer la quantité de ${item.title}`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={
                        item.stock != null && item.quantity >= item.stock
                      }
                      aria-label={`Augmenter la quantité de ${item.title}`}
                    >
                      +
                    </button>
                  </div>

                  {/* SUPPRESSION DU PRODUIT */}
                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Supprimer ${item.title} du panier`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* MESSAGE LIMITE DE STOCK */}
                {item.stock != null && item.quantity >= item.stock && (
                  <p className="stock-limit">Quantité maximale atteinte</p>
                )}

                {/* SOUS-TOTAL DU PRODUIT */}
                <p className="cart-item-subtotal">
                  Sous-total : {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </article>
          ))}

          {/* RETOUR AU CATALOGUE */}
          <Link to="/products" className="continue-shopping">
            Continuer mes achats
          </Link>
        </div>

        {/* RÉCAPITULATIF DE COMMANDE */}
        <aside className="cart-summary">
          <h2>Votre commande</h2>

          <div className="cart-summary-line">
            <span>Articles ({totalItems})</span>

            <span>{formatPrice(total)}</span>
          </div>

          <div className="cart-summary-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          {/* VALIDATION DE COMMANDE */}
          <Link to="/checkout" className="checkout-button">
            Passer commande
            <ArrowRight size={18} />
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;
