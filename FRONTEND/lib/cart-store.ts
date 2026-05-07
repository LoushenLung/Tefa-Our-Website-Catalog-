"use client";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CART_KEY = "tefa_cart";

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Dispatch a custom event to notify other components
  window.dispatchEvent(new Event("cart-updated"));
};

export const addToCart = (product: any) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart(cart);
};

export const removeFromCart = (id: string) => {
  const cart = getCart();
  const updated = cart.filter((item) => item.id !== id);
  saveCart(updated);
};

export const clearCart = () => {
  saveCart([]);
};
