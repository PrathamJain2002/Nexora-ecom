export const products = [
  { id: "p101", name: "Classic Tee", price: 19.99, image: "/images/classic-tee.jpg" },
  { id: "p102", name: "Denim Jacket", price: 59.99, image: "/images/denim-jacket.jpg" },
  { id: "p103", name: "Running Shoes", price: 79.5, image: "/images/running-shoes.jpg" },
  { id: "p104", name: "Wireless Earbuds", price: 49.0, image: "/images/earbuds.jpg" },
  { id: "p105", name: "Leather Wallet", price: 24.75, image: "/images/wallet.jpg" },
  { id: "p106", name: "Smart Watch", price: 129.0, image: "/images/smart-watch.jpg" },
  { id: "p107", name: "Backpack", price: 39.99, image: "/images/backpack.jpg" }
];

export function getProductById(productId) {
  return products.find(p => p.id === productId) || null;
}


