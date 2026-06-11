import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  checkoutOrder,
  fetchCart,
  removeFromCart,
  setCartQuantity,
  type CartItem,
  type CheckoutPayload,
} from "./customerApi";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const CartPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [form, setForm] = useState<CheckoutPayload>({
    customerName: sessionStorage.getItem("username") ?? "",
    shippingAddress: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        setError("");
        setItems(await fetchCart());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load cart.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadCart();
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      setError("");
      setItems(await removeFromCart(productId));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Failed to remove item.");
    }
  };

  const handleQuantityChange = async (productId: number, nextQuantity: number) => {
    try {
      setError("");
      setItems(await setCartQuantity(productId, nextQuantity));
    } catch (quantityError) {
      setError(quantityError instanceof Error ? quantityError.message : "Failed to update quantity.");
    }
  };

  const handleCheckout = async () => {
    if (!form.customerName.trim() || !form.shippingAddress.trim() || !form.city.trim() || !form.postalCode.trim() || !form.phoneNumber.trim()) {
      setError("Please fill in all delivery details before placing the order.");
      return;
    }

    try {
      setIsCheckingOut(true);
      setError("");
      setSuccessMessage("");
      const order = await checkoutOrder(form);
      setItems([]);
      setSuccessMessage(`Order #${order.id} placed successfully.`);
      navigate("/orders", { state: { orderId: order.id } });
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Failed to place order.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const grandTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <div className="min-h-screen bg-[#f4f7f8] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Localkart Cart</p>
            <h1 className="mt-2 text-2xl font-semibold">Your Cart</h1>
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
              to="/orders"
              className="bg-teal-600 px-4 py-3 text-sm font-semibold text-white"
            >
              View orders
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        {successMessage ? (
          <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-[2rem] border border-slate-200 bg-white p-5">
                  <div className="h-24 animate-pulse rounded-3xl bg-slate-200" />
                </div>
              ))
            ) : items.length > 0 ? (
              items.map((item) => (
                <article
                  key={item.productId}
                  className="grid gap-4 border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[160px_minmax(0,1fr)]"
                >
                  <div className="overflow-hidden rounded-3xl bg-slate-100">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-40 w-full object-cover" />
                    ) : (
                      <div className="flex h-40 items-center justify-center text-3xl font-semibold text-slate-400">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {item.category}
                        </p>
                        <h2 className="mt-2 text-xl font-semibold">{item.name}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-slate-900">{formatPrice(item.price)}</p>
                        <p className="mt-1 text-sm text-slate-500">Qty {item.quantity}</p>
                        <p className="mt-1 text-sm font-semibold text-emerald-600">
                          {formatPrice(item.lineTotal)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {item.stockQuantity} in stock
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void handleQuantityChange(item.productId, item.quantity - 1)}
                          className="flex h-10 w-10 items-center justify-center border border-slate-200 text-lg font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          -
                        </button>
                        <span className="min-w-12 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => void handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQuantity}
                          className="flex h-10 w-10 items-center justify-center border border-slate-200 text-lg font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleRemove(item.productId)}
                          className="border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="border border-slate-200 bg-white px-5 py-12 text-center text-slate-500">
                Your cart is empty.
              </div>
            )}
          </section>

          <aside className="border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold">Price Details</p>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total quantity</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                <span>Grand total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <input
                value={form.customerName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, customerName: event.target.value }))
                }
                placeholder="Full name"
                className="w-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
              />
              <textarea
                value={form.shippingAddress}
                onChange={(event) =>
                  setForm((current) => ({ ...current, shippingAddress: event.target.value }))
                }
                placeholder="Shipping address"
                className="min-h-28 w-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
              />
              <input
                value={form.city}
                onChange={(event) =>
                  setForm((current) => ({ ...current, city: event.target.value }))
                }
                placeholder="City"
                className="w-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
              />
              <input
                value={form.postalCode}
                onChange={(event) =>
                  setForm((current) => ({ ...current, postalCode: event.target.value }))
                }
                placeholder="Postal code"
                className="w-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
              />
              <input
                value={form.phoneNumber}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phoneNumber: event.target.value }))
                }
                placeholder="Phone number"
                className="w-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <button
              type="button"
              onClick={() => void handleCheckout()}
              disabled={items.length === 0 || isCheckingOut}
              className="mt-6 w-full bg-[linear-gradient(135deg,#0f766e_0%,#14b8a6_70%,#f59e0b_100%)] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingOut ? "Placing order..." : "Place order"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
