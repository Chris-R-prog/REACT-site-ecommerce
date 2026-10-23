import { useState, useEffect } from "react";

import { ProductsContext } from "./ProductsContext";
import { getProducts } from "../services/productApi";

const STORAGE_KEY = "lessentiel-products-v1";

function normalizeStoredProduct(product) {
  if (
    !product ||
    typeof product !== "object" ||
    product.id == null ||
    typeof product.title !== "string"
  ) {
    return null;
  }

  const price = Number(product.price);
  const stock = Number(product.stock);

  if (!Number.isFinite(price) || !Number.isFinite(stock)) {
    return null;
  }

  const legacyImages = Array.isArray(product.image) ? product.image : [];
  const images = Array.isArray(product.images)
    ? product.images
    : legacyImages.length > 0
      ? legacyImages
      : product.thumbnail
        ? [product.thumbnail]
        : [];

  return {
    ...product,
    price,
    stock,
    rating: Number.isFinite(Number(product.rating))
      ? Number(product.rating)
      : 0,
    images,
  };
}

function readStoredProducts() {
  const savedCatalog = localStorage.getItem(STORAGE_KEY);

  if (!savedCatalog) return null;

  const parsedCatalog = JSON.parse(savedCatalog);

  if (!Array.isArray(parsedCatalog)) return null;

  const normalizedCatalog = parsedCatalog.map(normalizeStoredProduct);

  return normalizedCatalog.every(Boolean) ? normalizedCatalog : null;
}

function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CHARGEMENT DES PRODUITS

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        // Vérifier si le catalogue a déjà été enregistré
        let savedProducts = null;

        try {
          savedProducts = readStoredProducts();
        } catch (storageError) {
          // Données locales invalides : on utilisera l'API.
          console.warn(
            "Impossible de lire les produits enregistrés :",
            storageError,
          );
        }

        if (Array.isArray(savedProducts)) {
          setProducts(savedProducts);
          return;
        }

        //Sinon, récupérer les produits depuis l'api
        const data = await getProducts(controller.signal);

        if (!controller.signal.aborted) {
          setProducts(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  // SAUVEGARDE DU CATALOGUE
  useEffect(() => {
    if (!loading && !error) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch (storageError) {
        console.warn(
          "Impossible d'enregistrer les produits :",
          storageError,
        );
      }
    }
  }, [products, loading, error]);

  // AJOUTER UN PRODUIT
  function addProduct(productData) {
    const newProduct = {
      ...productData,
      id: Date.now(),
      price: Number(productData.price),
      stock: Number(productData.stock),
      rating: Number(productData.rating ?? 0),
      images:
        (Array.isArray(productData.images) && productData.images) ||
        (productData.thumbnail ? [productData.thumbnail] : []),
    };

    setProducts((currentProducts) => [newProduct, ...currentProducts]);
  }

  //MODIFIER UN PRODUIT
  function updateProduct(id, changes) {
    const normalizedChanges = { ...changes };

    for (const property of ["price", "stock", "rating"]) {
      if (property in changes) {
        const numericValue = Number(changes[property]);

        if (Number.isFinite(numericValue)) {
          normalizedChanges[property] = numericValue;
        } else {
          delete normalizedChanges[property];
        }
      }
    }

    if ("thumbnail" in changes) {
      normalizedChanges.images = changes.thumbnail ? [changes.thumbnail] : [];
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === Number(id)
          ? { ...product, ...normalizedChanges, id: product.id }
          : product,
      ),
    );
  }

  // SUPPRIMER UN PRODUIT
  function deleteProduct(id) {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== Number(id)),
    );
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export default ProductsProvider;
