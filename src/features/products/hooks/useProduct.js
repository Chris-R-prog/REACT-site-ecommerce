import { useContext } from "react";
import { ProductsContext } from "../context/ProductsContext";

//ACCEDER AU CATALOGUE PARTAGÉ
export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts doit être utilisé dans ProductsProvider");
  }

  return context;
}

//RÉCUPÉRER UN PRODUIT DU CATALOGUE
export function useProduct(id) {
  const { products, loading, error } = useProducts();

  const product = products.find((item) => String(item.id) === String(id));

  return {
    product: product ?? null,
    loading,
    error: error || (!loading && !product ? "Produit introuvable." : null),
  };
}
