import { z } from "zod";

// ========================================
// VALIDATION DES ADRESSES
// ========================================

export const addressSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Le nom et le prénom sont obligatoires")
      .max(100, "Le nom ne peut pas dépasser 100 caractères"),

    street: z
      .string()
      .trim()
      .min(5, "L'adresse doit contenir au moins 5 caractères")
      .max(200, "L'adresse ne peut pas dépasser 200 caractères"),

    postalCode: z
      .string()
      .trim()
      .min(2, "Le code postal est obligatoire")
      .max(12, "Le code postal est trop long"),

    city: z
      .string()
      .trim()
      .min(2, "La ville est obligatoire")
      .max(100, "La ville ne peut pas dépasser 100 caractères"),

    country: z
      .string()
      .trim()
      .min(2, "Le pays est obligatoire")
      .max(100, "Le pays ne peut pas dépasser 100 caractères"),
  })
  .superRefine((address, ctx) => {
    if (
      address.country.toLowerCase() === "france" &&
      !/^\d{5}$/.test(address.postalCode)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["postalCode"],
        message: "Le code postal français doit contenir 5 chiffres",
      });
    }
  });
