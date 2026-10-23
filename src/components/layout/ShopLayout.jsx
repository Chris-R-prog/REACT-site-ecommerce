import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

function ShopLayout() {
  return (
    <>
      <Navbar />

      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default ShopLayout;
