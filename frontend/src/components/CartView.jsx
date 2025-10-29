import { useCart } from "../cart/CartContext.jsx";

export default function CartView({ onCheckout }) {
  const { cart, updateQty, removeFromCart } = useCart();

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <div className="muted">Cart is empty</div>
      ) : (
        <ul className="cart-list">
          {cart.items.map((it) => (
            <li key={it.productId} className="cart-item">
              <div className="cart-info">
                <div className="cart-name">{it.name || it.productId}</div>
                <div className="cart-sub">${it.unitPrice?.toFixed(2)} each</div>
              </div>
              <div className="cart-actions">
                <input
                  type="number"
                  min={0}
                  value={it.qty}
                  onChange={(e) => updateQty(it.productId, Number(e.target.value))}
                />
                <button className="btn btn-secondary" onClick={() => removeFromCart(it.productId)}>Remove</button>
                <div className="cart-line-total">${(it.lineTotal || (it.unitPrice || 0) * it.qty).toFixed(2)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <strong>${cart.total?.toFixed(2) || "0.00"}</strong>
        </div>
        <button className="btn" disabled={cart.items.length === 0} onClick={onCheckout}>Checkout</button>
      </div>
    </div>
  );
}


