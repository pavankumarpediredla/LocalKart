import { useEffect, useState } from "react";
import { fetchDashboard, type AdminDashboardResponse } from "./adminApi";

const AdminOverviewPage = () => {
  const username = sessionStorage.getItem("username") ?? "admin";
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchDashboard(username)
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load overview."),
      );
  }, [username]);

  return (
    <div className="grid gap-5">
      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(data?.stats ?? []).map((stat) => (
          <article key={stat.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
            <p className="mt-2 text-sm text-cyan-300">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">Application analytics</p>
              <p className="mt-1 text-sm text-slate-400">Traffic and engagement snapshot</p>
            </div>
          </div>

          <div className="mt-6 flex h-60 items-end gap-3">
            {(data?.analytics ?? []).map((height, index) => (
              <div key={`${height}-${index}`} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-full w-full items-end rounded-2xl bg-slate-900/80 p-2">
                  <div
                    className={`w-full rounded-2xl ${
                      index >= 5 ? "bg-gradient-to-t from-cyan-500 to-sky-300" : "bg-white/15"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-lg font-semibold">Support queue</p>
          <div className="mt-5 space-y-3">
            {(data?.supportTickets ?? []).map((ticket) => (
              <div key={ticket.id} className="rounded-2xl bg-slate-900 p-4">
                <p className="text-sm font-semibold text-slate-100">{ticket.issue}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {ticket.id} • {ticket.user} • {ticket.priority}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminOverviewPage;
