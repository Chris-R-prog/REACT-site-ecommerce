import { useState } from "react";
import { Link } from "react-router-dom";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "../../cart/hooks/useCart";
import { addressSchema } from "../validation/addressSchema";
import { formatPrice } from "../../../utils/formatPrice";
import AddressFields from "../components/AddressFields";
import { getCustomerProfile } from "../../profile/utils/profileStorage";

import "./CheckoutPage.css";

// ========================================
// CHAMPS COMMUNS DU CHECKOUT
// ========================================

const sharedCheckoutFields = {
  email: z
    .string()
    .trim()
    .min(1, "L'adresse e-mail est obligatoire")
    .email("L'adresse e-mail est invalide"),

  shippingAddress: addressSchema,
};

// ========================================
// VALIDATION CONDITIONNELLE
// ========================================

const checkoutSchema = z.discriminatedUnion("billingSameAsShipping", [
  // Même adresse pour la livraison et la facturation
  z.object({
    ...sharedCheckoutFields,
    billingSameAsShipping: z.literal(true),
    billingAddress: z.unknown().optional(),
  }),

  // Adresses différentes
  z.object({
    ...sharedCheckoutFields,
    billingSameAsShipping: z.literal(false),
    billingAddress: addressSchema,
  }),
]);

// ========================================
// PAGE CHECKOUT
// ========================================

function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const customerProfile = getCustomerProfile(user);

  // Données validées, en attente de notre futur backend
  const [validatedCheckout, setValidatedCheckout] = useState(null);

  // GESTION DU FORMULAIRE
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    shouldUnregister: true,

    defaultValues: {
      email: customerProfile.email,
      shippingAddress: customerProfile.shippingAddress,
      billingSameAsShipping: customerProfile.billingSameAsShipping,
      billingAddress: customerProfile.billingAddress,
    },
  });

  // SURVEILLER LA CASE À COCHER
  const billingSameAsShipping = useWatch({
    control,
    name: "billingSameAsShipping",
  });

  // CALCUL DU TOTAL DES PRODUITS
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // ========================================
  // VALIDATION DU CHECKOUT
  // ========================================

  function onSubmit(data) {
    // Déterminer l'adresse de facturation
    const billingAddress = data.billingSameAsShipping
      ? data.shippingAddress
      : data.billingAddress;

    // Préparer les informations pour notre futur backend
    const checkoutData = {
      email: data.email,
      shippingAddress: data.shippingAddress,
      billingAddress,
    };

    setValidatedCheckout(checkoutData);
  }

  // ========================================
  // PANIER VIDE
  // ========================================

  if (cartItems.length === 0) {
    return (
      <section className="checkout-page checkout-empty">
        <h1>Finaliser votre commande</h1>

        <p>Votre panier est vide.</p>

        <Link to="/products">Découvrir nos produits</Link>
      </section>
    );
  }

  // ========================================
  // AFFICHAGE DU CHECKOUT
  // ========================================

  return (
    <section className="checkout-page">
      {/* EN-TÊTE */}

      <div className="checkout-heading">
        <span>VOTRE COMMANDE</span>

        <h1>Finaliser votre commande</h1>

        <p>Renseignez vos coordonnées avant de poursuivre vers le paiement.</p>
      </div>

      {/* FORMULAIRE PRINCIPAL */}

      <form
        className="checkout-layout"
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => setValidatedCheckout(null)}
        noValidate
      >
        {/* INFORMATIONS CLIENT */}

        <div className="checkout-form-card">
          <fieldset>
            <legend>Coordonnées</legend>

            <div className="checkout-field">
              <label htmlFor="checkout-email">Adresse e-mail</label>

              <input
                id="checkout-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "checkout-email-error" : undefined
                }
                {...register("email")}
              />

              {errors.email && (
                <p id="checkout-email-error" className="field-error">
                  {errors.email.message}
                </p>
              )}
            </div>
          </fieldset>

          {/* LIVRAISON */}

          <fieldset>
            <legend>Adresse de livraison</legend>

            <AddressFields
              prefix="shippingAddress"
              register={register}
              errors={errors}
            />
          </fieldset>

          {/* ADRESSE IDENTIQUE */}

          <label className="checkout-checkbox">
            <input type="checkbox" {...register("billingSameAsShipping")} />
            Utiliser cette adresse pour la facturation
          </label>

          {/* FACTURATION DIFFÉRENTE */}

          {!billingSameAsShipping && (
            <fieldset>
              <legend>Adresse de facturation</legend>

              <AddressFields
                prefix="billingAddress"
                register={register}
                errors={errors}
              />
            </fieldset>
          )}
        </div>

        {/* RÉCAPITULATIF */}

        <aside className="checkout-summary">
          <h2>Récapitulatif</h2>

          <ul className="checkout-items">
            {cartItems.map((item) => (
              <li key={item.id}>
                <span>
                  {item.title} × {item.quantity}
                </span>

                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </li>
            ))}
          </ul>

          {/* TOTAL */}

          <div className="checkout-total">
            <span>Total des produits</span>

            <strong>{formatPrice(total)}</strong>
          </div>

          {/* VALIDATION */}

          <button type="submit" disabled={isSubmitting}>
            Valider mes informations
          </button>

          {/* CONFIRMATION */}

          {validatedCheckout && (
            <p className="checkout-success" role="status">
              Vos informations ont été validées. Le paiement Stripe sera bientôt
              disponible.
            </p>
          )}
        </aside>
      </form>
    </section>
  );
}

export default CheckoutPage;
