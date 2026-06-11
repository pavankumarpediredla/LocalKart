import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, MapPinned, Package, Search, ShoppingCart, Star, Truck, User } from "lucide-react";
import { useDispatch } from "react-redux";
import BrandMark from "../../components/BrandMark";
import { getAuthSession, getRoleHomePath, saveAuthSession, type AuthRole } from "../../lib/authSession";
import { setAuth } from "../../store/substores/AuthStore";
import deliveryHero from "../../assets/hero.png";

const LOGIN_API_URL =
  import.meta.env.VITE_LOGIN_API_URL ?? "http://localhost:8080/login";

const promoCards = [
  {
    badge: "Same-day",
    title: "Fast delivery windows",
    copy: "Orders packed and dispatched before noon can reach the door the same day.",
    stat: "2-4 hrs",
  },
  {
    badge: "Hot pick",
    title: "Big weekend sale",
    copy: "Seasonal offers, local deals, and limited-time promotions live on the homepage.",
    stat: "Up to 60% off",
  },
  {
    badge: "Tracked",
    title: "Live order tracking",
    copy: "From warehouse to doorstep, every milestone updates in real time.",
    stat: "24/7 updates",
  },
  {
    badge: "Local",
    title: "Neighborhood sellers",
    copy: "Discover nearby merchants, verified quality, and quick pickup options.",
    stat: "Nearby stores",
  },
];

const normalizeRole = (responseData: unknown): AuthRole => {
  if (!responseData || typeof responseData !== "object") {
    return "customer";
  }

  const data = responseData as {
    role?: string;
    userRole?: string;
    user?: { role?: string };
    data?: { role?: string };
    authorities?: Array<string | { authority?: string }>;
  };

  const directRole = data.role ?? data.userRole ?? data.user?.role ?? data.data?.role;

  if (typeof directRole === "string" && directRole.trim().length > 0) {
    return directRole.trim().toLowerCase() as AuthRole;
  }

  const authority = data.authorities?.find((entry) =>
    typeof entry === "string"
      ? entry.trim().length > 0
      : typeof entry?.authority === "string" && entry.authority.trim().length > 0,
  );

  if (typeof authority === "string") {
    return authority.toLowerCase().replace("role_", "") as AuthRole;
  }

  if (authority && typeof authority.authority === "string") {
    return authority.authority.toLowerCase().replace("role_", "") as AuthRole;
  }

  return "customer";
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const session = getAuthSession();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (session.isAuthenticated) {
      navigate(getRoleHomePath(session.role), { replace: true });
    }
  }, [navigate, session.isAuthenticated, session.role]);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          password,
        }),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(responseData?.message ?? "Login failed. Please try again.");
      }

      setSuccessMessage(responseData?.message ?? "Login successful.");
      const resolvedRole = normalizeRole(responseData);
      saveAuthSession(username, resolvedRole);
      dispatch(setAuth({ username, role: resolvedRole }));

      const targetPath =
        typeof location.state === "object" &&
        location.state !== null &&
        "from" in location.state &&
        typeof location.state.from === "string"
          ? location.state.from
          : getRoleHomePath(resolvedRole);

      navigate(targetPath, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-[#0f172a]">
      <header className="border-b border-teal-950/10 bg-white/80 text-slate-900 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <BrandMark />
          <div className="relative hidden flex-1 md:block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-600" />
            <input
              disabled
              placeholder="Search for products, brands and more"
              className="h-10 w-full rounded-sm bg-white pl-12 pr-4 text-sm text-slate-500 shadow outline-none"
            />
          </div>
          <div className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
            <ShoppingCart className="h-5 w-5" />
            Cart
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl px-4 py-6 sm:py-8">
        <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-sm lg:min-h-[680px] lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]">
          <section className="bg-[linear-gradient(160deg,#0f766e_0%,#14b8a6_55%,#f59e0b_100%)] px-6 py-8 text-white sm:px-8 sm:py-10 lg:flex lg:flex-col lg:justify-between lg:px-8 lg:py-12">
            <div>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Login</h1>
              <p className="mt-4 max-w-md text-base leading-7 text-blue-50 sm:text-lg sm:leading-8">
                Get access to your orders, wishlist and personalized recommendations.
              </p>
            </div>
            <div className="mt-8 space-y-4 sm:mt-12">
              <div className="rounded-[1.75rem] border border-white/20 bg-white/10 p-5 shadow-lg shadow-teal-950/10 backdrop-blur-sm lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-50/80">
                      Delivery network
                    </p>
                    <p className="mt-1 text-base font-medium">Fast doorstep drops across your city</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 rounded-[1.5rem] bg-white/10 p-4 sm:grid-cols-[1.15fr_0.85fr]">
                  <div className="relative overflow-hidden rounded-[1.35rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06))] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-50/80">
                          Out for delivery
                        </p>
                        <p className="mt-2 text-lg font-semibold">Same-day dispatch</p>
                      </div>
                      <div className="rounded-full bg-white/15 p-3">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3 text-sm text-blue-50/90">
                      <MapPinned className="h-4 w-4" />
                      <span>Warehouse to your doorstep in a few hours</span>
                    </div>

                    <div className="mt-6 h-2 rounded-full bg-white/15">
                      <div className="h-2 w-[72%] rounded-full bg-[linear-gradient(90deg,#ffffff_0%,#d9f99d_55%,#fbbf24_100%)]" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-3">
                    <div className="rounded-[1.25rem] bg-white/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-50/75">Quote</p>
                      <p className="mt-2 text-sm leading-6 text-white">
                        "Packed well, arrived early, and the tracking was clear all the way."
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] bg-white/10 p-4">
                      <div className="flex items-center gap-1 text-amber-200">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white">
                        "Local delivery feels fast and personal, like a neighborhood store with digital convenience."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-4 shadow-lg shadow-teal-950/10 backdrop-blur-sm">
                  <div className="flex gap-4 animate-marquee-x w-max">
                    {[...promoCards, ...promoCards].map((promo, index) => (
                      <article
                        key={`${promo.title}-${index}`}
                        className="flex w-[320px] shrink-0 flex-col overflow-hidden rounded-[1.4rem] bg-white/95 text-slate-900 shadow-sm"
                      >
                        <div className="relative h-40 overflow-hidden bg-[linear-gradient(135deg,#0f766e_0%,#14b8a6_55%,#f59e0b_100%)] p-4">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                              {promo.badge}
                            </span>
                            <div className="rounded-2xl bg-white/20 p-3">
                              <Truck className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <img
                            src={deliveryHero}
                            alt={promo.title}
                            className="absolute bottom-0 right-3 h-28 w-28 object-contain drop-shadow-2xl"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between p-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                              Localkart Ads
                            </p>
                            <h3 className="mt-2 text-lg font-semibold">{promo.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{promo.copy}</p>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                              {promo.stat}
                            </span>
                            <span className="text-xs font-medium text-slate-400">Limited offer</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <form onSubmit={submitLogin} className="mx-auto flex max-w-md flex-col justify-center">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Sign in to continue</h2>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Use your existing account credentials.
                </p>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Username</span>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-600" />
                    <input
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      autoComplete="username"
                      placeholder="Enter username"
                      className="h-12 w-full border-0 border-b border-slate-300 pl-8 text-sm outline-none focus:border-teal-600"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                  <div className="relative">
                    <Lock className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-600" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="Enter password"
                      className="h-12 w-full border-0 border-b border-slate-300 pl-8 text-sm outline-none focus:border-teal-600"
                    />
                  </div>
                </label>
              </div>

              {errorMessage ? (
                <div className="mt-5 border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="mt-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-8 inline-flex h-12 w-full items-center justify-center bg-[linear-gradient(135deg,#0f766e_0%,#14b8a6_60%,#f59e0b_100%)] px-4 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Login"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Login;
