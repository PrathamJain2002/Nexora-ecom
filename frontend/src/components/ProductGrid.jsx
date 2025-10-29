import { useEffect, useState } from "react";
import { useCart } from "../cart/CartContext.jsx";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products`);
        if (!res.ok) throw new Error("Failed to load products");
        setProducts(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading products…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="grid">
      {products.map(p => (
        <div key={p.id} className="card">
          <div className="thumb" aria-hidden>
            <span>{p.name[0]}</span>
          </div>
          <div className="card-body">
            <div className="card-title">{p.name}</div>
            <div className="card-price">${p.price.toFixed(2)}</div>
            <button onClick={() => addToCart(p.id, 1)} className="btn">
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}


