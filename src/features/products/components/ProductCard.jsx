import { Link } from "react-router-dom";

import { formatPrice } from "../../../utils/formatPrice";
import { categoryLabels } from "../utils/categoryLabels";

function ProductCard({ product }) {
  const imageUrl = product.thumbnail ?? product.images?.[0];

  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-card-link"
        aria-label={`Voir ${product.title}`}
      >
        <div className="product-card-image">
          <img src={imageUrl} alt={product.title} loading="lazy" />
        </div>

        <div className="product-card-content">
          <span className="product-category">
            {categoryLabels[product.category] ?? "Autres"}
          </span>
          <h2 className="product-title">{product.title}</h2>
          <p className="product-price">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
