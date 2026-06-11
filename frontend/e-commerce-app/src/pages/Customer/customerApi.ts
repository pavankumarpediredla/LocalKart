import type { Product } from "../SellerDashboard/sellerApi";

const CUSTOMER_CART_API_URL =
  import.meta.env.VITE_CART_API_URL ?? "http://localhost:8080/api/cart";
const CUSTOMER_WISHLIST_API_URL =
  import.meta.env.VITE_WISHLIST_API_URL ?? "http://localhost:8080/api/wishlist";
const CUSTOMER_ORDER_API_URL =
  import.meta.env.VITE_ORDER_API_URL ?? "http://localhost:8080/api/orders";

export type CartItem = Product & {
  productId: number;
  quantity: number;
  lineTotal: number;
};

export type WishlistItem = Product & {
  productId: number;
};

export type CheckoutPayload = {
  customerName: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
};

export type OrderItem = {
  productId: number;
  name: string;
  imageUrl?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: number;
  customerName: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  grandTotal: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

const getUsername = () => {
  const username = sessionStorage.getItem("username");

  if (!username) {
    throw new Error("You must be logged in to access customer collections.");
  }

  return username;
};

const buildHeaders = () => ({
  "Content-Type": "application/json",
  "X-Username": getUsername(),
});

export const fetchCart = async () => {
  const response = await fetch(CUSTOMER_CART_API_URL, {
    headers: {
      "X-Username": getUsername(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load cart.");
  }

  return (await response.json()) as CartItem[];
};

export const addToCart = async (productId: number, quantity = 1) => {
  const response = await fetch(CUSTOMER_CART_API_URL, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "Failed to update cart.");
  }

  return (await response.json()) as CartItem[];
};

export const setCartQuantity = async (productId: number, quantity: number) => {
  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  return addToCart(productId, quantity);
};

export const removeFromCart = async (productId: number) => {
  const response = await fetch(`${CUSTOMER_CART_API_URL}/${productId}`, {
    method: "DELETE",
    headers: {
      "X-Username": getUsername(),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "Failed to remove cart item.");
  }

  return (await response.json()) as CartItem[];
};

export const fetchWishlist = async () => {
  const response = await fetch(CUSTOMER_WISHLIST_API_URL, {
    headers: {
      "X-Username": getUsername(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load wishlist.");
  }

  return (await response.json()) as WishlistItem[];
};

export const addToWishlist = async (productId: number) => {
  const response = await fetch(CUSTOMER_WISHLIST_API_URL, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "Failed to update wishlist.");
  }

  return (await response.json()) as WishlistItem[];
};

export const removeFromWishlist = async (productId: number) => {
  const response = await fetch(`${CUSTOMER_WISHLIST_API_URL}/${productId}`, {
    method: "DELETE",
    headers: {
      "X-Username": getUsername(),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "Failed to remove wishlist item.");
  }

  return (await response.json()) as WishlistItem[];
};

export const checkoutOrder = async (payload: CheckoutPayload) => {
  const response = await fetch(`${CUSTOMER_ORDER_API_URL}/checkout`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "Failed to place order.");
  }

  return (await response.json()) as Order;
};

export const fetchOrders = async () => {
  const response = await fetch(CUSTOMER_ORDER_API_URL, {
    headers: {
      "X-Username": getUsername(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load orders.");
  }

  return (await response.json()) as Order[];
};
