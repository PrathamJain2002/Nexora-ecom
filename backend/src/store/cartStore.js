// Simple in-memory cart keyed by mock userId
// Structure: { [userId]: { items: [{productId, qty}], updatedAt: ISO } }
import mongoose from "mongoose";
import { CartModel } from "../models/Cart.js";

const carts = new Map();

function isDbConnected() {
  return mongoose?.connection?.readyState === 1;
}

export async function getCart(userId) {
  if (isDbConnected()) {
    let cart = await CartModel.findOne({ userId }).lean();
    if (!cart) {
      cart = await CartModel.create({ userId, items: [] });
      cart = cart.toObject();
    }
    return { items: cart.items || [], updatedAt: new Date().toISOString() };
  }
  if (!carts.has(userId)) {
    carts.set(userId, { items: [], updatedAt: new Date().toISOString() });
  }
  return carts.get(userId);
}

export async function setCart(userId, nextCart) {
  if (isDbConnected()) {
    const doc = await CartModel.findOneAndUpdate(
      { userId },
      { $set: { items: nextCart.items || [] } },
      { new: true, upsert: true }
    ).lean();
    return { items: doc.items || [], updatedAt: new Date().toISOString() };
  }
  carts.set(userId, { ...nextCart, updatedAt: new Date().toISOString() });
  return carts.get(userId);
}

export async function clearCart(userId) {
  if (isDbConnected()) {
    await CartModel.findOneAndUpdate({ userId }, { $set: { items: [] } }, { upsert: true });
    return;
  }
  carts.set(userId, { items: [], updatedAt: new Date().toISOString() });
}


