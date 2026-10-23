import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "../../auth/hooks/useAuth";
import { addressSchema } from "../../checkout/validation/addressSchema";
import AddressFields from "../../checkout/components/AddressFields";

import {
  getCustomerProfile,
  saveCustomerProfile,
} from "../utils/profileStorage";

import "./ProfilePage.css";

// ========================================
// VALIDATION DU PROFIL
// ========================================

const commonFields = {
  firstName: z.string().trim().min(2, "Prénom obligatoire"),

  lastName: z.string().trim().min(2, "Nom obligatoire"),

  email: z.email("Adresse e-mail invalide"),

  shippingAddress: addressSchema,
};

// VALIDATION CONDITIONNELLE DE LA FACTURATION

const profileSchema = z.discriminatedUnion("billingSameAsShipping", [
  z.object({
    ...commonFields,
    billingSameAsShipping: z.literal(true),
    billingAddress: z.unknown().optional(),
  }),

  z.object({
    ...commonFields,
    billingSameAsShipping: z.literal(false),
    billingAddress: addressSchema,
  }),
]);

// ========================================
// COMPOSANT PROFILEPAGE
// ========================================

function ProfilePage() {
  const { user } = useAuth();

  const [saved, setSaved] = useState(false);

  // FORMULAIRE

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    shouldUnregister: true,
    defaultValues: getCustomerProfile(user),
  });

  // SURVEILLER LA CASE DE FACTURATION

  const billingSameAsShipping = useWatch({
    control,
    name: "billingSameAsShipping",
  });

  // ENREGISTREMENT DU PROFIL

  function onSubmit(data) {
    const updatedProfile = {
      ...data,

      billingAddress: data.billingSameAsShipping
        ? data.shippingAddress
        : data.billingAddress,
    };

    saveCustomerProfile(user, updatedProfile);

    setSaved(true);
  }

  return (
    <section className="profile-page">
      {/* EN-TÊTE */}

      <div className="profile-heading">
        <span>MON ESPACE</span>

        <h1>Mon profil</h1>

        <p>Gérez vos informations personnelles et vos adresses.</p>
      </div>

      {/* FORMULAIRE */}

      <form
        className="profile-form"
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => setSaved(false)}
        noValidate
      >
        {/* INFORMATIONS PERSONNELLES */}

        <section className="profile-card">
          <h2>Informations personnelles</h2>

          <div className="checkout-field">
            <label htmlFor="firstName">Prénom</label>

            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              {...register("firstName")}
            />

            {errors.firstName && (
              <p id="firstName-error" className="field-error">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="checkout-field">
            <label htmlFor="lastName">Nom</label>

            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              {...register("lastName")}
            />

            {errors.lastName && (
              <p id="lastName-error" className="field-error">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="checkout-field">
            <label htmlFor="profile-email">Adresse e-mail</label>

            <input
              id="profile-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "profile-email-error" : undefined}
              {...register("email")}
            />

            {errors.email && (
              <p id="profile-email-error" className="field-error">
                {errors.email.message}
              </p>
            )}
          </div>
        </section>

        {/* ADRESSE DE LIVRAISON */}

        <section className="profile-card">
          <h2>Adresse de livraison</h2>

          <AddressFields
            prefix="shippingAddress"
            register={register}
            errors={errors}
          />
        </section>

        {/* ADRESSE DE FACTURATION */}

        <section className="profile-card profile-card-wide">
          <h2>Adresse de facturation</h2>

          <label className="checkout-checkbox">
            <input type="checkbox" {...register("billingSameAsShipping")} />
            Identique à l'adresse de livraison
          </label>

          {!billingSameAsShipping && (
            <AddressFields
              prefix="billingAddress"
              register={register}
              errors={errors}
            />
          )}
        </section>

        {/* ENREGISTREMENT */}

        <div className="profile-actions">
          <button type="submit" disabled={isSubmitting}>
            Enregistrer mes modifications
          </button>

          {saved && (
            <p className="profile-success" role="status">
              Vos informations ont été enregistrées.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

export default ProfilePage;
