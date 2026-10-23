import { Navigate, Route, Routes } from "react-router-dom";

import ShopLayout from "./components/layout/ShopLayout";
import AdminPage from "./features/admin/pages/AdminPage";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage";
import CartPage from "./features/cart/pages/CartPage";
import CheckoutPage from "./features/checkout/pages/CheckoutPage";
import HomePage from "./features/home/pages/HomePage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import CatalogPage from "./features/products/pages/CatalogPage";
import ProductDetailPage from "./features/products/pages/ProductDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ShopLayout />}>
        {/* Routes publiques */}
        <Route index element={<HomePage />} />
        <Route path="products" element={<CatalogPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />

        {/* Routes réservées aux utilisateurs connectés */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        {/* Routes réservées à l'administrateur */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>

        {/* Toute URL inconnue revient à l'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
