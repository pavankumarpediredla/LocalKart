import { useState } from "react";
import { PRODUCT_API_URL } from "./sellerApi";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  stockQuantity: "",
};

const SellerAddProductPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleAddProduct = async () => {
    try {
      setIsSaving(true);
      setMessage("");
      setError("");
      setFieldErrors({});

      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("description", form.description);
      payload.append("category", form.category);
      payload.append("price", form.price);
      payload.append("stockQuantity", form.stockQuantity);

      if (imageFile) {
        payload.append("image", imageFile);
      }

      const response = await fetch(PRODUCT_API_URL, {
        method: "POST",
        body: payload,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (data?.errors && typeof data.errors === "object") {
          setFieldErrors(data.errors as Record<string, string>);
        }
        throw new Error(data?.message ?? "Failed to add product.");
      }

      setForm(emptyForm);
      setImageFile(null);
      setFieldErrors({});
      setMessage("Product added successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
      <p className="text-lg font-semibold">Add product</p>
      <p className="mt-1 text-sm text-slate-400">Upload product details, stock, price, and image from your device.</p>

      {message ? <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</div> : null}
      {error ? <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} placeholder="Product name" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-400" />
          {fieldErrors.name ? <p className="mt-2 text-xs text-rose-300">{fieldErrors.name}</p> : null}
        </div>
        <div>
          <input value={form.category} onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))} placeholder="Category" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-400" />
          {fieldErrors.category ? <p className="mt-2 text-xs text-rose-300">{fieldErrors.category}</p> : null}
        </div>
        <div>
          <input value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} placeholder="Price" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-400" />
          {fieldErrors.price ? <p className="mt-2 text-xs text-rose-300">{fieldErrors.price}</p> : null}
        </div>
        <div>
          <input value={form.stockQuantity} onChange={(e) => setForm((c) => ({ ...c, stockQuantity: e.target.value }))} placeholder="Stock quantity" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-400" />
          {fieldErrors.stockQuantity ? <p className="mt-2 text-xs text-rose-300">{fieldErrors.stockQuantity}</p> : null}
        </div>
        <div className="md:col-span-2">
          <textarea value={form.description} onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))} placeholder="Description" className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-400" />
          {fieldErrors.description ? <p className="mt-2 text-xs text-rose-300">{fieldErrors.description}</p> : null}
        </div>
        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 md:col-span-2">
          <span>{imageFile ? imageFile.name : "Upload product image from photos/files"}</span>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="hidden" />
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">Browse</span>
        </label>
      </div>

      <div className="mt-5 flex justify-end">
        <button type="button" onClick={() => void handleAddProduct()} disabled={isSaving} className="w-full rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
          {isSaving ? "Uploading..." : "Add product"}
        </button>
      </div>
    </article>
  );
};

export default SellerAddProductPage;
