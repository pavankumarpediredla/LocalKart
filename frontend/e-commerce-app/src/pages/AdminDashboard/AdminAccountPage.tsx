import { useEffect, useState } from "react";
import { fetchDashboard, type AdminDashboardResponse } from "./adminApi";

const AdminAccountPage = () => {
  const username = sessionStorage.getItem("username") ?? "admin";
  const [data, setData] = useState<AdminDashboardResponse | null>(null);

  useEffect(() => {
    void fetchDashboard(username).then(setData).catch(() => undefined);
  }, [username]);

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-lg font-semibold">Account info</p>
      <div className="mt-5 grid gap-3">
        {(data?.accountInfo ?? []).map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-sm font-medium text-slate-100">{item.value}</p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default AdminAccountPage;
