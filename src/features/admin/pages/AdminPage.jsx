import { useState } from "react";

import { useProducts } from "../../products/hooks/useProduct";
import { useCart } from "../../cart/hooks/useCart";
import { formatPrice } from "../../../utils/formatPrice";
import ProductFormModal from "../components/ProductFormModal";

import "./AdminPage.css";

function AdminPage() {
  const {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const { removeFromCart, syncProductInCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openCreateModal() {
    setSelectedProduct(null);
    setIsModalOpen(true);
  }

  function openEditModal(product) {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  function saveProduct(productData) {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, productData);

      syncProductInCart({
        ...selectedProduct,
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
        images: productData.thumbnail ? [productData.thumbnail] : [],
      });
    } else {
      addProduct(productData);
    }

    closeModal();
  }

  function removeProduct(event, product) {
    event.stopPropagation();

    if (window.confirm(`Supprimer ${product.title} ?`)) {
      deleteProduct(product.id);
      removeFromCart(product.id);
    }
  }

  if (loading) {
    return <p>Chargement des produits...</p>;
  }

  if (error) {
    return <p>Impossible de charger les produits</p>;
  }

  return (
    <section className="admin-page">
      <h1>Administration des produits</h1>

      <p>Gérer les produits de votre catalogue.</p>

      <div className="admin-toolbar">
        <button type="button" className="admin-add" onClick={openCreateModal}>
          + Ajouter un produit
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} onClick={() => openEditModal(product)}>
                <td>
                  <button
                    type="button"
                    className="admin-product-edit"
                    onClick={(event) => {
                      event.stopPropagation();
                      openEditModal(product);
                    }}
                    aria-label={`Modifier ${product.title}`}
                  >
                    {product.title}
                  </button>
                </td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <button
                    type="button"
                    className="admin-delete"
                    onClick={(event) => removeProduct(event, product)}
                    aria-label={`Supprimer ${product.title}`}
                    title={`Supprimer ${product.title}`}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProductFormModal
          product={selectedProduct}
          onClose={closeModal}
          onSubmit={saveProduct}
        />
      )}
    </section>
  );
}

export default AdminPage;
