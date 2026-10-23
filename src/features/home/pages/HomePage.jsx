import { Link } from "react-router-dom";

import ProductCard from "../../products/components/ProductCard";
import { useProducts } from "../../products/hooks/useProduct";

import "./HomePage.css";

const featuredCategories = [
  {
    slug: "home-decoration",
    title: "Décoration",
    description: "Des objets qui rendent le quotidien plus beau.",
  },

  {
    slug: "furniture",
    title: "Mobilier",
    description: "Des pièces simples pensées pour durer.",
  },

  {
    slug: "beauty",
    title: "Beauté",
    description: "Prendre soin de soi tout simplement.",
  },
  {
    slug: "fragrances",
    title: "Parfums",
    description: "Des fragrances qui vous emportent.",
  },
];

function HomePage() {
  const { products, loading, error } = useProducts();

  const categorySections = featuredCategories
    .map((category) => ({
      ...category,
      products: products
        .filter((product) => product.category === category.slug)
        .slice(0, 4),
    }))
    .filter((category) => category.products.length > 0);

  return (
    <section className="home-categories">
      <div className="home-categories-intro">
        <span>NOTRE UNIVERS</span>
        <h2>Des essentiels pour chaque envie</h2>
      </div>

      {loading && (
        <p className="home-categories-status">
          Chargement de notre sélection...
        </p>
      )}

      {error && (
        <p className="home-categories-status" role="alert">
          Notre sélection est momentanément indisponible.
        </p>
      )}

      {!loading &&
        !error &&
        categorySections.map((category) => (
          <section className="home-category-section" key={category.slug}>
            <div className="home-category-heading">
              <div>
                <h3>{category.title}</h3>
                <p className="home-category-description">
                  {category.description}
                </p>
              </div>

              <Link to={`/products?category=${category.slug}`}>
                Voir la collection →
              </Link>
            </div>

            <div className="product-grid">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}

      {!loading && !error && categorySections.length === 0 && (
        <p className="home-categories-status">
          Aucune sélection n'est disponible pour le moment.
        </p>
      )}
    </section>
  );
}

export default HomePage;
