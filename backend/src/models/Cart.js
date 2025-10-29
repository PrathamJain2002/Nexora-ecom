import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    qty: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: { type: [CartItemSchema], default: [] }
  },
  { timestamps: true }
);

export const CartModel = mongoose.models.Cart || mongoose.model("Cart", CartSchema);


