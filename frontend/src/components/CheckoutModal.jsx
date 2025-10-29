import { useState } from "react";
import { useCart } from "../cart/CartContext.jsx";

export default function CheckoutModal({ onClose }) {
  const { cart, fetchCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(`/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, cartItems: cart.items.map(i => ({ productId: i.productId, qty: i.qty })) })
      });
      if (!res.ok) throw new Error("Checkout failed");
      const r = await res.json();
      setReceipt(r);
      // refresh cart so UI shows empty after successful checkout
      try { await fetchCart(); } catch {}
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal>
      <div className="modal">
        {!receipt ? (
          <>
            <div className="modal-header">
              <h3>Checkout</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
            </div>
            <form onSubmit={submit} className="modal-body">
              <label>
                <span>Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              {error && <div className="error">{error}</div>}
              <button className="btn" disabled={submitting}>{submitting ? "Processing…" : "Submit Order"}</button>
            </form>
          </>
        ) : (
          <>
            <div className="modal-header">
              <h3>Receipt</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              <div className="muted">Order ID: {receipt.id}</div>
              <ul className="receipt-list">
                {receipt.items.map((it) => (
                  <li key={it.productId}>
                    <span>{it.name} × {it.qty}</span>
                    <span>${it.lineTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="receipt-total">
                <span>Total</span>
                <strong>${receipt.total.toFixed(2)}</strong>
              </div>
              <div className="muted">{new Date(receipt.timestamp).toLocaleString()}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


