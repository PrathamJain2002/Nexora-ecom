# Vibe Mock E-Com Cart

Basic full-stack cart app for screening. React frontend + Node/Express backend. In-memory cart by default; optional MongoDB (bonus).

## Structure

- `backend`: Express REST API
- `frontend`: React app (Vite)

## Features

- Products list (mock 5–10 items)
- Cart: add, update qty, remove
- Totals calculation
- Checkout form (name/email) → mock receipt
- Responsive layout
- Bonus: MongoDB persistence if `MONGO_URI` provided (falls back to memory)

## Prereqs

- Node.js 18+
- npm or pnpm or yarn

## Setup

1. Install deps

```bash
cd backend && npm install
cd ../frontend && npm install
```

2. (Optional) Configure MongoDB

Create `backend/.env`:

```bash
PORT=4000
# MONGO_URI=mongodb://localhost:27017/vibe_mock_ecom
```

3. Run backend and frontend (separate terminals)

```bash
cd backend
npm run dev
# http://localhost:4000
```

```bash
cd frontend
npm run dev
# http://localhost:5173 (proxied to backend /api)
```

## API

- `GET /api/products` → list products
- `GET /api/cart` → cart items + total
- `POST /api/cart` body: `{ productId, qty }`
- `PATCH /api/cart/:id` body: `{ qty }` (0 removes)
- `DELETE /api/cart/:id` removes by productId
- `POST /api/checkout` body: `{ name, email, cartItems: [{productId, qty}] }` → receipt

## Frontend

- Products grid with "Add to Cart"
- Cart panel: qty input, remove, totals, checkout button
- Checkout modal: submit and shows receipt

## Screenshots / Demo

Record a 1–2 min Loom/YouTube showing:
- Adding items, updating qty, removing
- Totals updating
- Checkout and receipt

## Notes

- Safe to run without MongoDB; persistence is in-memory for a single mock user.
- If you enable MongoDB but connection fails, server continues with in-memory store.

## Scripts

Backend:
- `npm run dev` – start with nodemon
- `npm start` – start

Frontend:
- `npm run dev` – Vite dev server
- `npm run build` – production build
- `npm run preview` – preview build
