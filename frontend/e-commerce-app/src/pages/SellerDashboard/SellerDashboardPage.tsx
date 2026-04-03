import { useMemo, useState } from "react";
import { CreditCard, PackagePlus, ReceiptText, WalletCards } from "lucide-react";

const chartOptions = {
  daily: [35, 52, 48, 68, 74, 62, 79],
  weekly: [45, 58, 72, 66, 84, 78, 91],
  monthly: [30, 42, 55, 61, 70, 78, 86],
  yearly: [28, 34, 46, 58, 69, 83, 96],
};

const metrics = [
  { label: "Today earnings", value: "$820", icon: WalletCards },
  { label: "This week", value: "$4,620", icon: ReceiptText },
  { label: "This month", value: "$18,420", icon: CreditCard },
  { label: "This year", value: "$214,300", icon: PackagePlus },
];

const SellerDashboardPage = () => {
  const [range, setRange] = useState<keyof typeof chartOptions>("weekly");
  const chartData = useMemo(() => chartOptions[range], [range]);

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{metric.label}</p>
                <Icon className="text-emerald-300" size={18} />
              </div>
              <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold">Earnings trend</p>
              <p className="mt-1 text-sm text-slate-400">Switch between daily, weekly, monthly, and yearly views.</p>
            </div>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value as keyof typeof chartOptions)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="mt-6 flex h-72 items-end gap-3">
            {chartData.map((height, index) => (
              <div key={`${height}-${index}`} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-full w-full items-end rounded-2xl bg-slate-900/80 p-2">
                  <div
                    className={`w-full rounded-2xl ${
                      index >= chartData.length - 2
                        ? "bg-gradient-to-t from-emerald-500 to-lime-300"
                        : "bg-white/15"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
          <p className="text-lg font-semibold">Weekly orders</p>
          <div className="mt-5 space-y-3">
            {[
              "Monday: 18 orders",
              "Tuesday: 24 orders",
              "Wednesday: 21 orders",
              "Thursday: 27 orders",
              "Friday: 33 orders",
              "Saturday: 29 orders",
              "Sunday: 36 orders",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default SellerDashboardPage;
