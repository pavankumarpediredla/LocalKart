import { useEffect, useState } from "react";
import { fetchDashboard, type AdminDashboardResponse } from "./adminApi";

const AdminSupportPage = () => {
  const username = sessionStorage.getItem("username") ?? "admin";
  const [data, setData] = useState<AdminDashboardResponse | null>(null);

  useEffect(() => {
    void fetchDashboard(username).then(setData).catch(() => undefined);
  }, [username]);

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-lg font-semibold">Support</p>
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
  );
};

export default AdminSupportPage;
