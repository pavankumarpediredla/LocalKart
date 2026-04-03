const SellerPricingPage = () => {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
      <p className="text-lg font-semibold">Update pricing</p>
      <p className="mt-1 text-sm text-slate-400">Manage product pricing, margin targets, and promotional price points.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          "Base pricing by category",
          "Bulk discount rules",
          "Flash sale pricing",
          "Margin monitor",
          "Tax included price preview",
          "Price change history",
        ].map((item) => (
          <div key={item} className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-200">
            {item}
          </div>
        ))}
      </div>
    </article>
  );
};

export default SellerPricingPage;
