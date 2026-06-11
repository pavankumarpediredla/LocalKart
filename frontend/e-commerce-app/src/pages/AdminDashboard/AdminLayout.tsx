import { useState } from "react";
import {
  BarChart3,
  ChevronRight,
  CircleUserRound,
  Headset,
  LayoutDashboard,
  Menu,
  Search,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import BrandMark from "../../components/BrandMark";
import { clearAuthSession } from "../../lib/authSession";

const navItems = [
  { label: "Overview", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Create User", to: "/admin/users/create", icon: UserPlus },
  { label: "Update User", to: "/admin/users/update", icon: UserCog },
  { label: "Customer Search", to: "/admin/customers/search", icon: Search },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Support", to: "/admin/support", icon: Headset },
  { label: "Account Info", to: "/admin/account", icon: CircleUserRound },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const username = sessionStorage.getItem("username") ?? "admin";
  const pageTitle =
    navItems.find((item) => location.pathname.startsWith(item.to))?.label ??
    "Admin";

  const handleLogout = () => {
    clearAuthSession();
    setIsLogoutDialogOpen(false);
    setIsAccountMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
          <BrandMark compact />
          {isExpanded ? (
            <div>
              <p className="text-lg font-semibold">Localkart Admin</p>
              <p className="text-sm text-slate-400">Operations workspace</p>
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
              onClick={closeMenus}
              className={({ isActive }) =>
                `flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                    ? "bg-teal-300 text-slate-950"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                } ${isExpanded ? "justify-between" : "justify-center lg:justify-center"}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {isExpanded ? <span>{item.label}</span> : <span className="lg:hidden">{item.label}</span>}
                  </div>
                  {isExpanded ? (
                    <ChevronRight
                      size={16}
                      className={isActive ? "text-slate-800" : "text-slate-500"}
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-8 rounded-[1.75rem] border border-teal-400/20 bg-gradient-to-br from-teal-500/15 to-amber-500/5 p-5">
        {isExpanded ? (
          <>
            <p className="text-sm font-medium text-teal-200">Admin summary</p>
            <p className="mt-3 text-3xl font-semibold">Live</p>
            <p className="mt-1 text-sm text-slate-300">
              Use the routed side menu to manage each admin area.
            </p>
          </>
        ) : (
            <div className="flex justify-center text-teal-200">
              <Users size={20} />
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
            aria-label="Close menu overlay"
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-40 border-r border-white/10 bg-[#07131b] px-4 py-6 transition-all duration-300 lg:hidden ${
            isExpanded ? "w-72" : "w-24"
          } ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
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
                <p className="text-sm uppercase tracking-[0.35em] text-teal-300">Admin Console</p>
                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{pageTitle}</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Manage users, customers, support, and analytics from separate admin pages.
                </p>
              </div>

              <div className="relative flex flex-wrap items-center gap-3">
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
                  Export
                </button>
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen((current) => !current)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-950"
                >
                  {username.charAt(0).toUpperCase()}
                </button>

                {isAccountMenuOpen ? (
                  <div className="absolute right-0 top-16 z-20 w-52 rounded-3xl border border-white/10 bg-slate-900 p-2 shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        navigate("/admin/account");
                      }}
                      className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-white/5"
                    >
                      Account Info
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setIsLogoutDialogOpen(true);
                      }}
                      className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <div className="mt-6">
            <Outlet />
          </div>
        </main>
      </div>

      {isLogoutDialogOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <p className="text-lg font-semibold text-slate-100">Are you sure you want to logout?</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              You will be signed out of the admin console and returned to the login page.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutDialogOpen(false)}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
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

export default AdminLayout;
