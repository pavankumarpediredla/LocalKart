const SellerSettingsPage = () => {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
      <p className="text-lg font-semibold">Settings</p>
      <p className="mt-1 text-sm text-slate-400">Manage notification preferences, payout settings, and store controls.</p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {[
          "Payout bank account",
          "Notification preferences",
          "Store vacation mode",
          "Return window settings",
        ].map((item) => (
          <div key={item} className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-200">
            {item}
          </div>
        ))}
      </div>
    </article>
  );
};

export default SellerSettingsPage;
