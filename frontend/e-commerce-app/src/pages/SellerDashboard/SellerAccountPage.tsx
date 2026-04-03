const SellerAccountPage = () => {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
      <p className="text-lg font-semibold">User details</p>
      <p className="mt-1 text-sm text-slate-400">Seller account details, contact info, and storefront profile.</p>

      <div className="mt-5 grid gap-3">
        {[
          ["Seller name", "Urban Tech Store"],
          ["Email", "seller@easycart.com"],
          ["Store type", "Electronics"],
          ["Verification", "Verified seller"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-medium text-slate-100">{value}</p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default SellerAccountPage;
