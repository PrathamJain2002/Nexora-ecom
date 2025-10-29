import { Router } from "express";
import { getProductById } from "../data/products.js";
import { clearCart } from "../store/cartStore.js";

const router = Router();

// For simplicity, use the same mock user as cart routes
const MOCK_USER_ID = "demo-user";

router.post("/", async (req, res) => {
  const { name, email, cartItems } = req.body || {};
  if (!name || !email || !Array.isArray(cartItems)) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const enriched = cartItems.map(it => {
    const product = getProductById(it.productId);
    const unitPrice = product ? product.price : 0;
    return { ...it, unitPrice, name: product?.name, lineTotal: unitPrice * it.qty };
  });
  const total = enriched.reduce((sum, it) => sum + it.lineTotal, 0);
  const receipt = {
    id: Math.random().toString(36).slice(2),
    name,
    email,
    items: enriched,
    total: Number(total.toFixed(2)),
    timestamp: new Date().toISOString()
  };
  // clear cart post-checkout (best-effort)
  try { await clearCart(MOCK_USER_ID); } catch {}
  res.status(201).json(receipt);
});

export default router;


