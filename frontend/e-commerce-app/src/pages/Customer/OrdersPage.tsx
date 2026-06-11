import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchOrders, type Order } from "./customerApi";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError("");
        setOrders(await fetchOrders());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load orders.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const highlightedOrderId = location.state?.orderId as number | undefined;

  return (
    <div className="min-h-screen bg-[#f4f7f8] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Localkart Orders</p>
            <h1 className="mt-2 text-2xl font-semibold">Order History</h1>
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

        <section className="mt-5 space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-[2rem] border border-slate-200 bg-white p-6">
                <div className="h-28 animate-pulse rounded-3xl bg-slate-200" />
              </div>
            ))
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <article
                key={order.id}
                className={`border bg-white p-6 shadow-sm ${
                  highlightedOrderId === order.id
                    ? "border-emerald-300 ring-2 ring-emerald-200"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Order #{order.id}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                      {order.customerName}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {order.shippingAddress}, {order.city}, {order.postalCode}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{order.phoneNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="rounded-sm bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">
                      {order.status}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">
                      {formatPrice(order.grandTotal)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.productId}`}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Qty {item.quantity} x {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {formatPrice(item.lineTotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[2rem] border border-slate-200 bg-white px-5 py-12 text-center text-slate-500">
              No orders placed yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default OrdersPage;
