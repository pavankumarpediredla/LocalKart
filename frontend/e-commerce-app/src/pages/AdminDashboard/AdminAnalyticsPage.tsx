import { useEffect, useState } from "react";
import { fetchDashboard, type AdminDashboardResponse } from "./adminApi";

const AdminAnalyticsPage = () => {
  const username = sessionStorage.getItem("username") ?? "admin";
  const [data, setData] = useState<AdminDashboardResponse | null>(null);

  useEffect(() => {
    void fetchDashboard(username).then(setData).catch(() => undefined);
  }, [username]);

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-lg font-semibold">Analytics</p>
      <p className="mt-1 text-sm text-slate-400">Dedicated analytics view for application activity.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(data?.stats ?? []).map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-slate-900 p-4">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-sm text-cyan-300">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex h-72 items-end gap-3">
        {(data?.analytics ?? []).map((height, index) => (
          <div key={`${height}-${index}`} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-full w-full items-end rounded-2xl bg-slate-900/80 p-2">
              <div className="w-full rounded-2xl bg-gradient-to-t from-cyan-500 to-sky-300" style={{ height: `${height}%` }} />
            </div>
            <span className="text-xs text-slate-500">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
};

export default AdminAnalyticsPage;
