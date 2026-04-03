import { useEffect, useState } from "react";
import { ADMIN_API_URL, fetchUsers, type AdminUser } from "./adminApi";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30",
  Pending: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30",
};

const AdminUpdateUserPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [sellerPassword, setSellerPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void fetchUsers(searchTerm)
      .then((data) => {
        setUsers(data);
        setSelectedUserId((current) =>
          current && data.some((user) => user.id === current) ? current : (data[0]?.id ?? null),
        );
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load users."),
      );
  }, [searchTerm]);

  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;

  const updateSelectedUser = (field: keyof AdminUser, value: string) => {
    if (!selectedUser) {
      return;
    }

    setUsers((current) =>
      current.map((user) =>
        user.id === selectedUser.id ? { ...user, [field]: value } : user,
      ),
    );
  };

  const handleSave = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(`${ADMIN_API_URL}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: selectedUser.fullName,
          email: selectedUser.email,
          role: selectedUser.role,
          password: selectedUser.role === "SELLER" && sellerPassword.trim() ? sellerPassword : undefined,
          active: selectedUser.status === "Active",
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to update user.");
      }

      setMessage("User updated successfully.");
      setSellerPassword("");
      const refreshed = await fetchUsers(searchTerm);
      setUsers(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold">User search</p>
            <p className="mt-1 text-sm text-slate-400">Find a user and select them for update.</p>
          </div>
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search user" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400 sm:w-64" />
        </div>

        <div className="mt-5 hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr className="border-b border-white/10">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Select</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 last:border-b-0">
                  <td className="py-4">
                    <p className="font-medium text-slate-100">{user.fullName}</p>
                    <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                  </td>
                  <td className="py-4 text-slate-300">{user.role}</td>
                  <td className="py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[user.status] ?? statusStyles.Pending}`}>{user.status}</span>
                  </td>
                  <td className="py-4">
                    <button type="button" onClick={() => {
                      setSelectedUserId(user.id);
                      setSellerPassword("");
                    }} className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/5">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-3 md:hidden">
          {users.map((user) => (
            <div key={user.id} className="rounded-2xl bg-slate-900 p-4">
              <p className="font-medium text-slate-100">{user.fullName}</p>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.2em] text-cyan-300">{user.role}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[user.status] ?? statusStyles.Pending}`}>{user.status}</span>
              </div>
              <button type="button" onClick={() => {
                setSelectedUserId(user.id);
                setSellerPassword("");
              }} className="mt-4 w-full rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5">Edit user</button>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6">
        <p className="text-lg font-semibold">Update selected user</p>
        {message ? <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</div> : null}
        {error ? <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

        {selectedUser ? (
          <div className="mt-5 grid gap-4">
            <input value={selectedUser.fullName} onChange={(e) => updateSelectedUser("fullName", e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none focus:border-cyan-400" />
            <input value={selectedUser.email} onChange={(e) => updateSelectedUser("email", e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none focus:border-cyan-400" />
            <select value={selectedUser.role} onChange={(e) => updateSelectedUser("role", e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none focus:border-cyan-400">
              <option value="BUYER">BUYER</option>
              <option value="SELLER">SELLER</option>
              <option value="SUPPORT">SUPPORT</option>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {selectedUser.role === "SELLER" ? (
              <input
                type="password"
                value={sellerPassword}
                onChange={(e) => setSellerPassword(e.target.value)}
                placeholder="New password for seller only"
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400"
              />
            ) : null}
            <select value={selectedUser.status} onChange={(e) => updateSelectedUser("status", e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none focus:border-cyan-400">
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
            <div className="flex justify-end">
              <button type="button" onClick={() => void handleSave()} disabled={isSaving} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60">
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-400">Select a user from the list to update details.</p>
        )}
      </article>
    </div>
  );
};

export default AdminUpdateUserPage;
