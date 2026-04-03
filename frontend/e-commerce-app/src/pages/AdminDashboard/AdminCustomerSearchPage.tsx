import { useEffect, useState } from "react";
import { fetchUsers, type AdminUser } from "./adminApi";

const AdminCustomerSearchPage = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    void fetchUsers(query).then((data) =>
      setUsers(data.filter((user) => user.role === "CUSTOMER")),
    );
  }, [query]);

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold">Customer search</p>
          <p className="mt-1 text-sm text-slate-400">Search customer accounts from the admin panel.</p>
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400" />
      </div>

      <div className="mt-5 grid gap-3">
        {users.map((user) => (
          <div key={user.id} className="rounded-2xl bg-slate-900 p-4">
            <p className="font-medium">{user.fullName}</p>
            <p className="mt-1 text-sm text-slate-400">{user.email}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-300">{user.status}</p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default AdminCustomerSearchPage;
