export const PRODUCT_API_URL =
  import.meta.env.VITE_PRODUCT_API_URL ?? "http://localhost:8080/api/products";

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
};

export const fetchProducts = async () => {
  const response = await fetch(PRODUCT_API_URL);

  if (!response.ok) {
    throw new Error("Failed to load products.");
  }

  return (await response.json()) as Product[];
};
