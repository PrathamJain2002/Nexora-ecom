import { useEffect, useState } from "react";
import { CartProvider, useCart } from "./cart/CartContext.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import CartView from "./components/CartView.jsx";
import CheckoutModal from "./components/CheckoutModal.jsx";

function AppShell() {
  const { fetchCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="container">
      <header className="header">
        <h1>Vibe Mock E-Com</h1>
      </header>
      <main className="content">
        <section>
          <h2>Products</h2>
          <ProductGrid />
        </section>
        <aside>
          <CartView onCheckout={() => setShowCheckout(true)} />
        </aside>
      </main>
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
      <footer className="footer">Demo app for screening</footer>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppShell />
    </CartProvider>
  );
}


