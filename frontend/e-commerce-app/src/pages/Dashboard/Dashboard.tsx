import { useState } from "react";
import { useNavigate } from "react-router-dom";

const sideMenuItems = [
  "Home",
  "Order History",
  "Account",
  "Settings",
  "Saved Items",
  "Help Center",
];

const categories = [
  "Mobiles",
  "Fashion",
  "Electronics",
  "Home",
  "Beauty",
  "Appliances",
];

const featuredProducts = [
  {
    name: "NoiseFit Smartwatch",
    category: "Wearables",
    price: "$79",
    originalPrice: "$109",
    rating: "4.7",
    accent: "from-sky-500 to-cyan-300",
  },
  {
    name: "Urban Street Sneakers",
    category: "Fashion",
    price: "$64",
    originalPrice: "$89",
    rating: "4.5",
    accent: "from-amber-400 to-orange-300",
  },
  {
    name: "Bluetooth Speaker Pro",
    category: "Electronics",
    price: "$58",
    originalPrice: "$82",
    rating: "4.8",
    accent: "from-fuchsia-500 to-pink-300",
  },
  {
    name: "Minimal Desk Lamp",
    category: "Home Decor",
    price: "$34",
    originalPrice: "$49",
    rating: "4.4",
    accent: "from-emerald-500 to-lime-300",
  },
];

const recentOrders = [
  { id: "#ORD-2193", item: "Wireless Earbuds", date: "02 Apr 2026", status: "Delivered" },
  { id: "#ORD-2178", item: "Men's Hoodie", date: "31 Mar 2026", status: "Shipped" },
  { id: "#ORD-2144", item: "Coffee Maker", date: "27 Mar 2026", status: "Processing" },
];

const deals = [
  "Up to 60% off on electronics",
  "Buy 2 get 1 free on fashion picks",
  "Extra 15% bank offer on orders above $120",
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30",
  Shipped: "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30",
  Processing: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("username");
    setIsLogoutDialogOpen(false);
    setIsAccountMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-lg font-bold text-white">
                EC
              </div>
              <div>
                <p className="text-xl font-semibold">EasyCart</p>
                <p className="text-sm text-slate-500">Customer shopping dashboard</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 lg:mx-8 lg:max-w-3xl lg:flex-row">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
              />
              <button
                type="button"
                className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Search
              </button>
            </div>

            <div className="relative flex items-center gap-3">
              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
              >
                Wishlist
              </button>
              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
              >
                Cart
              </button>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((current) => !current)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                P
              </button>

              {isAccountMenuOpen ? (
                <div className="absolute right-0 top-16 z-20 w-52 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
                  <button
                    type="button"
                    className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      setIsLogoutDialogOpen(true);
                    }}
                    className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="rounded-3xl bg-gradient-to-br from-sky-600 via-cyan-500 to-sky-400 p-5 text-white">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-100">Hello, Pavan</p>
                <h1 className="mt-2 text-2xl font-semibold">Your shopping space</h1>
                <p className="mt-2 text-sm text-sky-50/90">
                  Track orders, manage your account, and discover new deals.
                </p>
              </div>

              <nav className="mt-5 space-y-2">
                {sideMenuItems.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      index === 0
                        ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item}</span>
                    <span className="text-slate-400">{index === 0 ? "Active" : ">"}</span>
                  </button>
                ))}
              </nav>
            </section>

            <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Recent orders</p>
                <button type="button" className="text-sm font-medium text-sky-600">
                  View all
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{order.item}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {order.id} • {order.date}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <main className="space-y-5">
            <section className="grid gap-5 xl:grid-cols-[1.35fr_0.95fr]">
              <article className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-sky-900 to-cyan-700 p-7 text-white shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Mega Savings Week</p>
                <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight">
                  Shop top brands with smart deals curated for you.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-slate-200">
                  Explore daily offers across mobiles, fashion, electronics, and home essentials with fast delivery.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    Start Shopping
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    Browse Categories
                  </button>
                </div>
              </article>

              <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Today&apos;s offers</p>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                    Limited
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {deals.map((deal) => (
                    <div key={deal} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                      {deal}
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">Shop by category</p>
                  <p className="text-sm text-slate-500">Quick access to popular sections</p>
                </div>
                <button type="button" className="text-sm font-medium text-sky-600">
                  See more
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                {categories.map((category, index) => (
                  <div
                    key={category}
                    className={`rounded-3xl px-4 py-5 text-center text-sm font-semibold ${
                      index % 3 === 0
                        ? "bg-sky-50 text-sky-700"
                        : index % 3 === 1
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">Popular products</p>
                  <p className="text-sm text-slate-500">Recommended picks based on trending searches</p>
                </div>
                <button type="button" className="text-sm font-medium text-sky-600">
                  View all products
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {featuredProducts.map((product) => (
                  <article
                    key={product.name}
                    className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white"
                  >
                    <div className={`h-40 bg-gradient-to-br ${product.accent}`} />
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {product.category}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">{product.name}</h3>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xl font-semibold text-slate-900">{product.price}</span>
                        <span className="text-sm text-slate-400 line-through">{product.originalPrice}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {product.rating} rating
                        </span>
                        <button
                          type="button"
                          className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      {isLogoutDialogOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <p className="text-lg font-semibold text-slate-900">Are you sure you want to logout?</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              You will be signed out of your account and returned to the login page.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutDialogOpen(false)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Yes, logout
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
