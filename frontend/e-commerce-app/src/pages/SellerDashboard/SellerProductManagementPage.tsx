import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "./sellerApi";

const SellerProductManagementPage = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void fetchProducts().then(setProducts).catch(() => undefined);
  }, []);

  const filteredProducts = products.filter((product) =>
    [product.name, product.category, product.description]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold">Update product</p>
            <p className="mt-1 text-sm text-slate-400">Review product data and prepare edits.</p>
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-emerald-400 sm:w-60" />
        </div>

        <div className="mt-5 grid gap-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="rounded-2xl bg-slate-900 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-100">{product.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{product.category}</p>
                </div>
                <span className="text-sm text-slate-300">${product.price}</span>
              </div>
              <button type="button" className="mt-4 rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5">
                Edit product
              </button>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
        <p className="text-lg font-semibold">Search product</p>
        <p className="mt-1 text-sm text-slate-400">Quick product search results for seller catalog review.</p>

        <div className="mt-5 grid gap-3">
          {filteredProducts.map((product) => (
            <div key={`${product.id}-search`} className="rounded-2xl bg-slate-900 p-4">
              <p className="font-medium text-slate-100">{product.name}</p>
              <p className="mt-1 text-sm text-slate-400">{product.description}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-emerald-300">
                {product.stockQuantity} in stock
              </p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
};

export default SellerProductManagementPage;
