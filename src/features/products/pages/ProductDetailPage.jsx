import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ArrowLeft, Star, Check, ChevronRight } from "lucide-react";
import { categoryLabels } from "../utils/categoryLabels";

import { formatPrice } from "../../../utils/formatPrice";
import { useCart } from "../../cart/hooks/useCart";
import { useProduct } from "../hooks/useProduct";

import "./ProductDetailPage.css";

function ProductDetailPage() {
  const { id } = useParams();

  const { product, loading, error } = useProduct(id);

  const [selectedImage, setSelectedImage] = useState(null);

  const { addToCart } = useCart();

  if (loading) {
    return <p>Chargement du produit...</p>;
  }

  if (error) {
    return <p>Une erreur est survenue : {error}</p>;
  }

  if (!product) {
    return <p>Produit introuvable.</p>;
  }

  //Récupération des images
  const images = product.images?.length
    ? product.images
    : [product.thumbnail].filter(Boolean);

  // Image principale
  const mainImage = images.includes(selectedImage) ? selectedImage : images[0];

  return (
    <section className="product-detail">
      {/* FIL D'ARIANE */}

      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">Accueil</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <Link to="/products">Catalogue</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">{product.title}</span>
      </nav>

      <div className="detail-layout">
        {/* PHOTOGRAPHIES */}

        <div className="detail-gallery">
          <div className="detail-main-image">
            {mainImage && <img src={mainImage} alt={product.title} />}
          </div>

          <div className="detail-thumbnails">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                className={
                  mainImage === image ? "thumbnail active" : "thumbnail"
                }
                onClick={() => setSelectedImage(image)}
                aria-label={`Afficher l'image ${index + 1}`}
                aria-pressed={mainImage === image}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* INFORMATIONS */}
        <div className="detail-info">
          <span className="detail-category">
            {categoryLabels[product.category] ?? "Autres"}
          </span>
          <h1>{product.title}</h1>

          {product.brand && <p className="detail-brand">Par {product.brand}</p>}
          <div className="detail-rating">
            <Star size={17} />
            <span>{product.rating} / 5</span>
          </div>

          <p className="detail-price">{formatPrice(product.price)}</p>

          {/* DESCRIPTION */}
          <div className="detail-description">
            <h2>À propos de ce produit</h2>
            <p>{product.description} </p>

            {/* DISPONIBILITÉ */}
            <p className="detail-stock">
              {product.stock > 0 ? (
                <>
                  <Check size={18} />
                  En stock — {product.stock} disponible{product.stock === 1 ? "" : "s"}
                </>
              ) : (
                "Indisponible"
              )}
            </p>

            {/* AJOUT AU PANIER */}
            <button
              className="detail-cart-button"
              type="button"
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
            >
              Ajouter au panier
            </button>

            {/* RETOUR CATALOGUE */}
            <Link to="/products" className="detail-back">
              <ArrowLeft size={17} />
              Retour au catalogue
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;
