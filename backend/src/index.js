import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import checkoutRouter from "./routes/checkout.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 4000;

async function start() {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri) {
    try {
      const dbName = process.env.MONGO_DB_NAME || undefined;
      await mongoose.connect(mongoUri, dbName ? { dbName } : undefined);
      console.log("Connected to MongoDB");
    } catch (e) {
      console.warn("MongoDB connection failed, continuing with in-memory store.");
    }
  }

  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

start();


