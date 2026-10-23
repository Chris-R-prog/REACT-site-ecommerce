import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { categoryLabels } from "../../products/utils/categoryLabels";

import "./ProductFormModal.css";

const productSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Le nom du produit est obligatoire")
    .max(120, "Le nom ne peut pas dépasser 120 caractères"),
  category: z.string().trim().min(1, "La catégorie est obligatoire"),
  brand: z
    .string()
    .trim()
    .max(100, "La marque ne peut pas dépasser 100 caractères"),
  price: z
    .number({ error: "Le prix est obligatoire" })
    .min(0, "Le prix doit être positif"),
  stock: z
    .number({ error: "Le stock est obligatoire" })
    .int("Le stock doit être un nombre entier")
    .min(0, "Le stock doit être positif"),
  thumbnail: z.union([
    z.literal(""),
    z.string().trim().url("L’URL de l’image est invalide"),
  ]),
  description: z
    .string()
    .trim()
    .min(1, "La description est obligatoire")
    .max(1000, "La description ne peut pas dépasser 1 000 caractères"),
});

const categoryOptions = Object.entries(categoryLabels);

function getDefaultValues(product) {
  return {
    title: product?.title ?? "",
    category: product?.category ?? "",
    brand: product?.brand ?? "",
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    thumbnail: product?.thumbnail ?? product?.images?.[0] ?? "",
    description: product?.description ?? "",
  };
}

function ProductFormModal({ product, onClose, onSubmit }) {
  const dialogRef = useRef(null);
  const isEditing = Boolean(product);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(product),
  });

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  function submitProduct(data) {
    onSubmit(data);
  }

  return (
    <dialog
      ref={dialogRef}
      className="product-modal"
      aria-labelledby="product-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="product-modal-header">
        <div>
          <span className="product-modal-eyebrow">CATALOGUE</span>
          <h2 id="product-modal-title">
            {isEditing ? "Modifier le produit" : "Ajouter un produit"}
          </h2>
        </div>

        <button
          type="button"
          className="product-modal-close"
          onClick={onClose}
          aria-label="Fermer la fenêtre"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <form
        className="product-form"
        onSubmit={handleSubmit(submitProduct)}
        noValidate
      >
        <div className="product-form-grid">
          <div className="product-form-field product-form-field-wide">
            <label htmlFor="product-title">Nom du produit</label>
            <input
              id="product-title"
              type="text"
              autoFocus
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "product-title-error" : undefined}
              {...register("title")}
            />
            {errors.title && (
              <p id="product-title-error" className="product-form-error">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="product-form-field">
            <label htmlFor="product-category">Catégorie</label>
            <select
              id="product-category"
              aria-invalid={Boolean(errors.category)}
              aria-describedby={
                errors.category ? "product-category-error" : undefined
              }
              {...register("category")}
            >
              <option value="">Choisir une catégorie</option>
              {categoryOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p id="product-category-error" className="product-form-error">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="product-form-field">
            <label htmlFor="product-brand">Marque</label>
            <input id="product-brand" type="text" {...register("brand")} />
            {errors.brand && (
              <p className="product-form-error">{errors.brand.message}</p>
            )}
          </div>

          <div className="product-form-field">
            <label htmlFor="product-price">Prix</label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              aria-invalid={Boolean(errors.price)}
              aria-describedby={errors.price ? "product-price-error" : undefined}
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p id="product-price-error" className="product-form-error">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="product-form-field">
            <label htmlFor="product-stock">Stock</label>
            <input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              aria-invalid={Boolean(errors.stock)}
              aria-describedby={errors.stock ? "product-stock-error" : undefined}
              {...register("stock", { valueAsNumber: true })}
            />
            {errors.stock && (
              <p id="product-stock-error" className="product-form-error">
                {errors.stock.message}
              </p>
            )}
          </div>

          <div className="product-form-field product-form-field-wide">
            <label htmlFor="product-thumbnail">URL de l’image</label>
            <input
              id="product-thumbnail"
              type="url"
              placeholder="https://…"
              aria-invalid={Boolean(errors.thumbnail)}
              aria-describedby={
                errors.thumbnail ? "product-thumbnail-error" : undefined
              }
              {...register("thumbnail")}
            />
            {errors.thumbnail && (
              <p id="product-thumbnail-error" className="product-form-error">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          <div className="product-form-field product-form-field-wide">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              rows="4"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "product-description-error" : undefined
              }
              {...register("description")}
            />
            {errors.description && (
              <p id="product-description-error" className="product-form-error">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="product-form-actions">
          <button type="button" className="product-form-cancel" onClick={onClose}>
            Annuler
          </button>
          <button
            type="submit"
            className="product-form-submit"
            disabled={isSubmitting}
          >
            {isEditing ? "Enregistrer" : "Ajouter le produit"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default ProductFormModal;
