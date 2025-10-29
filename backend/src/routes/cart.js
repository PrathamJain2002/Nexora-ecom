import { Router } from "express";
import { getCart, setCart } from "../store/cartStore.js";
import { getProductById } from "../data/products.js";

const router = Router();

// For simplicity, a single mock user
const MOCK_USER_ID = "demo-user";

function calcTotals(items) {
  const enriched = items.map(it => {
    const product = getProductById(it.productId);
    const unitPrice = product ? product.price : 0;
    const lineTotal = unitPrice * it.qty;
    return { ...it, unitPrice, lineTotal, name: product?.name };
  });
  const total = enriched.reduce((sum, it) => sum + it.lineTotal, 0);
  return { items: enriched, total: Number(total.toFixed(2)) };
}

router.get("/", async (req, res, next) => {
  try {
    const cart = await getCart(MOCK_USER_ID);
    const { items, total } = calcTotals(cart.items);
    res.json({ items, total, updatedAt: cart.updatedAt });
  } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try {
    const { productId, qty } = req.body || {};
    if (!productId || typeof qty !== "number" || qty <= 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    const product = getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const cart = await getCart(MOCK_USER_ID);
    const existing = cart.items.find(i => i.productId === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ productId, qty });
    }
    const saved = await setCart(MOCK_USER_ID, cart);
    const { items, total } = calcTotals(saved.items);
    res.status(201).json({ items, total, updatedAt: saved.updatedAt });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const cart = await getCart(MOCK_USER_ID);
    const nextItems = cart.items.filter(i => i.productId !== productId);
    const saved = await setCart(MOCK_USER_ID, { items: nextItems });
    const { items, total } = calcTotals(saved.items);
    res.json({ items, total, updatedAt: saved.updatedAt });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { qty } = req.body || {};
    if (typeof qty !== "number" || qty < 0) {
      return res.status(400).json({ error: "Invalid qty" });
    }
    const cart = await getCart(MOCK_USER_ID);
    const existing = cart.items.find(i => i.productId === productId);
    if (!existing) {
      return res.status(404).json({ error: "Item not in cart" });
    }
    if (qty === 0) {
      cart.items = cart.items.filter(i => i.productId !== productId);
    } else {
      existing.qty = qty;
    }
    const saved = await setCart(MOCK_USER_ID, cart);
    const { items, total } = calcTotals(saved.items);
    res.json({ items, total, updatedAt: saved.updatedAt });
  } catch (e) {
    next(e);
  }
});

export default router;


