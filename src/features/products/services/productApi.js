const API_URL = import.meta.env.VITE_API_URL;

export async function getProducts(signal) {
  const response = await fetch(`${API_URL}/products?limit=0`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les produits");
  }

  const data = await response.json();

  return data.products;
}
