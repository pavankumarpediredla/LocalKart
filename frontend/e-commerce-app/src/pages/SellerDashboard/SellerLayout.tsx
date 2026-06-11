import { useState } from "react";
import {
  BadgeDollarSign,
  LayoutDashboard,
  Menu,
  PackagePlus,
  Percent,
  ReceiptText,
  Settings,
  Tag,
  Truck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import BrandMark from "../../components/BrandMark";
import { clearAuthSession } from "../../lib/authSession";

const navItems = [
  { label: "Dashboard", to: "/seller/dashboard", icon: LayoutDashboard },
  { label: "Add Product", to: "/seller/products/add", icon: PackagePlus },
  { label: "Update Product", to: "/seller/products/update", icon: PackagePlus },
  { label: "Search Product", to: "/seller/products/search", icon: PackagePlus },
  { label: "Pricing", to: "/seller/pricing", icon: BadgeDollarSign },
  { label: "Coupons", to: "/seller/coupons", icon: Percent },
  { label: "Promotions", to: "/seller/promotions", icon: Tag },
  { label: "Orders", to: "/seller/orders", icon: ReceiptText },
  { label: "Shipment Tracking", to: "/seller/shipment", icon: Truck },
  { label: "User Details", to: "/seller/account", icon: UserRound },
  { label: "Settings", to: "/seller/settings", icon: Settings },
];

const SellerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const username = sessionStorage.getItem("username") ?? "seller";
  const pageTitle =
    navItems.find((item) => location.pathname.startsWith(item.to))?.label ??
    "Seller Portal";

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
          <BrandMark compact />
          {isExpanded ? (
            <div>
              <p className="text-lg font-semibold">Localkart Seller</p>
              <p className="text-sm text-slate-400">Store operations</p>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-slate-200 transition hover:bg-white/10 lg:flex"
        >
          {isExpanded ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                    ? "bg-teal-300 text-slate-950"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                } ${isExpanded ? "justify-between" : "justify-center"}`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                {isExpanded ? <span>{item.label}</span> : <span className="lg:hidden">{item.label}</span>}
              </div>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-8 rounded-[1.75rem] border border-teal-400/20 bg-gradient-to-br from-teal-500/15 to-amber-500/5 p-5">
        {isExpanded ? (
          <>
            <p className="text-sm font-medium text-teal-200">Seller summary</p>
            <p className="mt-3 text-3xl font-semibold">Growth</p>
            <p className="mt-1 text-sm text-slate-300">
              Manage catalog, pricing, offers, orders, and payouts from one workspace.
            </p>
          </>
        ) : (
            <div className="flex justify-center text-teal-200">
              <WalletCards size={20} />
            </div>
          )}
        </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#07131b] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {isMobileMenuOpen ? (
          <button
            type="button"
            aria-label="Close seller menu"
            onClick={closeMobileMenu}
            className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-40 border-r border-white/10 bg-[#07131b] px-4 py-6 transition-all duration-300 lg:hidden ${
            isExpanded ? "w-72" : "w-24"
          } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {sidebarContent}
        </aside>

        <aside
          className={`hidden border-r border-white/10 bg-[#07131b] px-4 py-6 lg:block ${
            isExpanded ? "w-72" : "w-24"
          }`}
        >
          {sidebarContent}
        </aside>

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <header className="rounded-[2rem] border border-white/10 bg-white/5 px-4 py-4 shadow-2xl shadow-slate-950/20 backdrop-blur sm:px-6 sm:py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Seller Portal</p>
                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{pageTitle}</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Manage products, pricing, offers, payments, orders, and shipments.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 lg:hidden"
                >
                  <Menu size={18} />
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  {username}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="mt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
