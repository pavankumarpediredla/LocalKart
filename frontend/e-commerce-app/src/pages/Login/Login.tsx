import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Search, ShoppingCart, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/substores/AuthStore";
import { getAuthSession, getRoleHomePath, saveAuthSession, type AuthRole } from "../../lib/authSession";
import BrandMark from "../../components/BrandMark";

const LOGIN_API_URL =
  import.meta.env.VITE_LOGIN_API_URL ?? "http://localhost:8080/login";

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
  const dispatch = useDispatch();
  const session = getAuthSession();
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

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

      navigate(getRoleHomePath(resolvedRole), { replace: true });
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

      <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-0 px-4 py-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="h-full bg-[linear-gradient(160deg,#0f766e_0%,#14b8a6_55%,#f59e0b_100%)] px-8 py-10 text-white shadow-sm">
          <h1 className="text-3xl font-semibold leading-tight">Login</h1>
          <p className="mt-4 text-lg leading-8 text-blue-50">
            Get access to your orders, wishlist and personalized recommendations.
          </p>
          <div className="mt-12 grid gap-4 text-sm text-blue-50">
            <div className="border border-white/20 bg-white/10 p-4">Neighborhood storefront experience</div>
            <div className="border border-white/20 bg-white/10 p-4">Cart, wishlist and order tracking</div>
            <div className="border border-white/20 bg-white/10 p-4">Seller and admin role redirects</div>
          </div>
        </section>

        <section className="bg-white px-6 py-10 shadow-sm sm:px-10">
          <form onSubmit={submitLogin} className="mx-auto max-w-md">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900">Sign in to continue</h2>
              <p className="mt-2 text-sm text-slate-500">Use your existing account credentials.</p>
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
      </main>
    </div>
  );
};

export default Login;
