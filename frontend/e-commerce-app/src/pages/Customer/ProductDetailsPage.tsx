import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  addToWishlist,
  fetchCart,
  fetchWishlist,
  removeFromCart,
  removeFromWishlist,
  type CartItem,
  type WishlistItem,
} from "./customerApi";
import {
  fetchProductById,
  fetchRelatedProducts,
  type Product,
} from "../SellerDashboard/sellerApi";

const accentStyles = [
  "from-amber-300 via-orange-300 to-rose-300",
  "from-sky-300 via-cyan-300 to-teal-300",
  "from-lime-300 via-emerald-300 to-green-300",
  "from-fuchsia-300 via-pink-300 to-rose-300",
  "from-violet-300 via-indigo-300 to-sky-300",
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const getAccentStyle = (productId: number) =>
  accentStyles[productId % accentStyles.length];

const renderProductImage = (product: Product, heightClass = "h-full") => {
  if (product.imageUrl && product.imageUrl.trim().length > 0) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name}
        className={`${heightClass} w-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${heightClass} w-full items-center justify-center bg-gradient-to-br ${getAccentStyle(product.id)}`}
    >
      <span className="text-4xl font-semibold text-slate-950/75">
        {product.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
};

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const productId = Number(params.productId);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const loadProductPage = async () => {
      if (!Number.isFinite(productId)) {
        setError("Invalid product id.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const [productData, relatedData, cartData, wishlistData] = await Promise.all([
          fetchProductById(productId),
          fetchRelatedProducts(productId),
          fetchCart(),
          fetchWishlist(),
        ]);

        setProduct(productData);
        setRelatedProducts(relatedData);
        setCartItems(cartData);
        setWishlistItems(wishlistData);
        setQuantity(productData.stockQuantity > 0 ? 1 : 0);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load product details.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProductPage();
  }, [productId]);

  const isInCart = cartItems.some((item) => item.productId === productId);
  const isWishlisted = wishlistItems.some((item) => item.productId === productId);

  const handleCartAction = async () => {
    if (!product) {
      return;
    }

    try {
      setActionError("");
      const updated = isInCart
        ? await removeFromCart(product.id)
        : await addToCart(product.id, Math.max(1, quantity));
      setCartItems(updated);
    } catch (cartError) {
      setActionError(
        cartError instanceof Error ? cartError.message : "Failed to update cart.",
      );
    }
  };

  const handleWishlistAction = async () => {
    if (!product) {
      return;
    }

    try {
      setActionError("");
      const updated = isWishlisted
        ? await removeFromWishlist(product.id)
        : await addToWishlist(product.id);
      setWishlistItems(updated);
    } catch (wishlistError) {
      setActionError(
        wishlistError instanceof Error
          ? wishlistError.message
          : "Failed to update wishlist.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f8] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Localkart Assured</p>
            <h1 className="mt-2 text-2xl font-semibold">Product Details</h1>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Back to shop
            </button>
            <Link
              to="/cart"
              className="bg-teal-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Open cart
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        {actionError ? (
          <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
            {actionError}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="h-[32rem] animate-pulse rounded-[2rem] bg-slate-200" />
            <div className="h-[32rem] animate-pulse rounded-[2rem] bg-slate-200" />
          </div>
        ) : product ? (
          <>
            <section className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <article className="overflow-hidden border border-slate-200 bg-white shadow-sm">
                <div className="h-[32rem]">{renderProductImage(product)}</div>
              </article>

              <article className="border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {product.category}
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-950">
                  {product.name}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {product.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="text-3xl font-semibold text-slate-950">
                    {formatPrice(product.price)}
                  </span>
                  <span className="rounded-sm bg-emerald-600 px-2 py-1 text-sm font-semibold text-white">
                    {product.stockQuantity} in stock
                  </span>
                  <span className="rounded-sm bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                    Product #{product.id}
                  </span>
                </div>

                <div className="mt-8 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <label className="flex-1">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">
                        Quantity
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={Math.max(product.stockQuantity, 1)}
                        value={quantity}
                        onChange={(event) =>
                          setQuantity(
                            Math.min(
                              Math.max(Number(event.target.value) || 1, 1),
                              Math.max(product.stockQuantity, 1),
                            ),
                          )
                        }
                        disabled={product.stockQuantity === 0}
                        className="w-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => void handleCartAction()}
                      disabled={product.stockQuantity === 0}
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        isInCart
                          ? "bg-teal-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {isInCart ? "Remove from cart" : "Add to cart"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleWishlistAction()}
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                        isWishlisted
                          ? "bg-rose-100 text-rose-700"
                          : "border border-slate-200 text-slate-700"
                      }`}
                    >
                      {isWishlisted ? "Remove wishlist" : "Add to wishlist"}
                    </button>
                  </div>
                </div>
              </article>
            </section>

            <section className="mt-5 border border-white/70 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">Related products</p>
                  <p className="text-sm text-slate-500">
                    More items from the same category
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.length > 0 ? (
                  relatedProducts.map((relatedProduct) => (
                    <article
                      key={relatedProduct.id}
                      className="overflow-hidden border border-slate-200 bg-white"
                    >
                      <div className="h-44">{renderProductImage(relatedProduct, "h-44")}</div>
                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {relatedProduct.category}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">
                          {relatedProduct.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                          {relatedProduct.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-lg font-semibold text-slate-900">
                            {formatPrice(relatedProduct.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => navigate(`/products/${relatedProduct.id}`)}
                          className="bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-3xl bg-slate-50 px-5 py-8 text-sm text-slate-500 md:col-span-2 xl:col-span-4">
                    No related products found for this category yet.
                  </div>
                )}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
