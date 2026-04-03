import { useState } from "react";
import { ADMIN_API_URL } from "./adminApi";

const emptyForm = {
  username: "",
  fullName: "",
  email: "",
  password: "",
  role: "BUYER",
};

const AdminCreateUserPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(`${ADMIN_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to create user.");
      }

      setForm(emptyForm);
      setMessage("User created successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6">
      <div>
        <p className="text-lg font-semibold">Create user</p>
        <p className="mt-1 text-sm text-slate-400">Create seller, buyer, support, or admin accounts from the admin module.</p>
      </div>

      {message ? <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</div> : null}
      {error ? <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <input value={form.username} onChange={(e) => setForm((c) => ({ ...c, username: e.target.value }))} placeholder="Username" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400" />
        <input value={form.fullName} onChange={(e) => setForm((c) => ({ ...c, fullName: e.target.value }))} placeholder="Full name" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400" />
        <input value={form.email} onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))} placeholder="Email" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400" />
        <input value={form.password} onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))} placeholder="Temporary password" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400" />
        <select value={form.role} onChange={(e) => setForm((c) => ({ ...c, role: e.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none focus:border-cyan-400">
          <option value="BUYER">Buyer</option>
          <option value="SELLER">Seller</option>
          <option value="SUPPORT">Support</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="mt-5 flex justify-stretch sm:justify-end">
        <button type="button" onClick={() => void handleSubmit()} disabled={isSaving} className="w-full rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
          {isSaving ? "Creating..." : "Create user"}
        </button>
      </div>
    </article>
  );
};

export default AdminCreateUserPage;
