import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const LOGIN_API_URL =
  import.meta.env.VITE_LOGIN_API_URL ?? "http://localhost:8080/login";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

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
        throw new Error(
          responseData?.message ?? "Login failed. Please try again.",
        );
      }

      setSuccessMessage(responseData?.message ?? "Login successful.");
      navigate("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/30 backdrop-blur xl:grid-cols-2">
          <div className="hidden flex-col justify-between gap-8 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.28),_transparent_55%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(8,15,30,0.92))] p-10 xl:flex">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-300/80">
                E-Commerce Admin
              </p>
              <h1 className="mt-6 max-w-md text-5xl font-semibold leading-tight text-white">
                Sign in to manage orders, products, and customers.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                A focused login experience with a clean layout, strong contrast,
                and subtle depth.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Fast access to your dashboard
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Secure POST submission flow
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Tailwind-powered responsive UI
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <form
              onSubmit={submitLogin}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-xl shadow-slate-950/40"
            >
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  Welcome back
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  Log in to your account
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Enter your credentials to continue.
                </p>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Username
                  </span>
                  <input
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    autoComplete="username"
                    placeholder="Enter your username"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  />
                </label>
              </div>

              {errorMessage ? (
                <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {successMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
