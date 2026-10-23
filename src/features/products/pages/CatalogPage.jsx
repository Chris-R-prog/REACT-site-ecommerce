import { Search, SlidersHorizontal } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProduct";
import { categoryLabels } from "../utils/categoryLabels";

import "./CatalogPage.css";

const PRODUCTS_PER_PAGE = 12;

function CatalogPage() {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") ?? "";
  const search = searchParams.get("q") ?? "";

  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ].sort((a, b) =>
    (categoryLabels[a] ?? a).localeCompare(categoryLabels[b] ?? b, "fr"),
  );

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const requestedPage = Number(searchParams.get("page") ?? 1);
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  function updateFilter(name, value) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    params.delete("page");
    setSearchParams(params, { replace: true });
  }

  function changePage(page) {
    const params = new URLSearchParams(searchParams);

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    setSearchParams(params);
  }

  if (loading) {
    return <p className="catalog-status">Chargement de notre sélection...</p>;
  }

  if (error) {
    return (
      <p className="catalog-status catalog-error" role="alert">
        Une erreur est survenue : {error}
      </p>
    );
  }

  return (
    <section className="catalog">
      <header className="catalog-heading">
        <div>
          <h1>{categoryLabels[selectedCategory] ?? "Notre Catalogue"}</h1>
          <p>Découvrez des objets sélectionnés pour votre quotidien.</p>
        </div>
      </header>

      <div
        className="catalog-controls"
        role="search"
        aria-label="Filtrer le catalogue"
      >
        <label className="catalog-control">
          <span>Catégorie</span>
          <span className="catalog-control-field">
            <SlidersHorizontal size={18} aria-hidden="true" />
            <select
              value={selectedCategory}
              onChange={(event) =>
                updateFilter("category", event.target.value)
              }
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category] ?? category}
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className="catalog-control catalog-control--search">
          <span>Rechercher un produit</span>
          <span className="catalog-control-field">
            <Search size={19} aria-hidden="true" />
            <input
              type="search"
              placeholder="Nom du produit..."
              value={search}
              onChange={(event) => updateFilter("q", event.target.value)}
            />
          </span>
        </label>
      </div>

      <div className="catalog-summary">
        <p className="catalog-results" aria-live="polite">
          {filteredProducts.length} produit
          {filteredProducts.length > 1 ? "s" : ""}
        </p>

        {(selectedCategory || search) && (
          <Link to="/products" className="catalog-reset">
            Réinitialiser les filtres
          </Link>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="catalog-empty">
          <Search size={28} aria-hidden="true" />
          <p>Aucun produit ne correspond à votre recherche.</p>
          <Link to="/products">Effacer les filtres</Link>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="catalog-pagination"
              aria-label="Pagination du catalogue"
            >
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Précédent
              </button>

              <span>
                Page {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Suivant →
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}

export default CatalogPage;
