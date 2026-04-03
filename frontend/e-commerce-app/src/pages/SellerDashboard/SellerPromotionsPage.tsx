const SellerPromotionsPage = () => {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
      <p className="text-lg font-semibold">Discounts and promotions</p>
      <p className="mt-1 text-sm text-slate-400">Plan promotions, banners, and seasonal discount campaigns.</p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {[
          "Weekend accessories promotion",
          "Buy 2 get 1 bundle campaign",
          "Festive banner placement",
          "Limited-time shipping discount",
        ].map((promo) => (
          <div key={promo} className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-200">
            {promo}
          </div>
        ))}
      </div>
    </article>
  );
};

export default SellerPromotionsPage;
