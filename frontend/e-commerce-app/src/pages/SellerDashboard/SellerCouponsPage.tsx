const SellerCouponsPage = () => {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
      <p className="text-lg font-semibold">Add coupons</p>
      <p className="mt-1 text-sm text-slate-400">Create coupon codes for targeted campaigns and repeat buyers.</p>

      <div className="mt-5 grid gap-3">
        {["SAVE15", "WELCOME10", "BUNDLE20"].map((coupon) => (
          <div key={coupon} className="rounded-2xl bg-slate-900 p-4">
            <p className="font-medium text-slate-100">{coupon}</p>
            <p className="mt-1 text-sm text-slate-400">Coupon ready for activation</p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default SellerCouponsPage;
