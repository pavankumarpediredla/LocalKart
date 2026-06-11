import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, fetchWishlist, removeFromWishlist, type WishlistItem } from "./customerApi";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const WishlistPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setIsLoading(true);
        setError("");
        setItems(await fetchWishlist());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load wishlist.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadWishlist();
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      setItems(await removeFromWishlist(productId));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Failed to remove item.");
    }
  };

  const handleMoveToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
      setItems(await removeFromWishlist(productId));
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Failed to move item to cart.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f8] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Localkart Wishlist</p>
            <h1 className="mt-2 text-2xl font-semibold">Your Wishlist</h1>
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
              Go to cart
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-[2rem] border border-slate-200 bg-white p-5">
                <div className="h-48 animate-pulse rounded-3xl bg-slate-200" />
              </div>
            ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <article
                key={item.productId}
                className="overflow-hidden border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-52 overflow-hidden bg-slate-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl font-semibold text-slate-400">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {item.category}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">{item.name}</h2>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-semibold text-slate-900">
                      {formatPrice(item.price)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {item.stockQuantity} left
                    </span>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => void handleRemove(item.productId)}
                      className="flex-1 border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleMoveToCart(item.productId)}
                      className="flex-1 bg-amber-500 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Move to cart
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[2rem] border border-slate-200 bg-white px-5 py-12 text-center text-slate-500 md:col-span-2 xl:col-span-3">
              Your wishlist is empty.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default WishlistPage;
