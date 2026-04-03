const orders = [
  { id: "#ORD-4201", buyer: "Asha R", total: "$84", payment: "Paid", delivery: "Packed" },
  { id: "#ORD-4202", buyer: "Rohan M", total: "$146", payment: "Pending", delivery: "Awaiting pickup" },
  { id: "#ORD-4203", buyer: "Nila S", total: "$62", payment: "Paid", delivery: "Shipped" },
];

const SellerOrdersPage = () => {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
      <p className="text-lg font-semibold">Orders data</p>
      <p className="mt-1 text-sm text-slate-400">Review customer orders, payment state, and delivery progress.</p>

      <div className="mt-5 grid gap-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl bg-slate-900 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-100">{order.id}</p>
                <p className="mt-1 text-sm text-slate-400">{order.buyer} • {order.total}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-emerald-300">{order.payment}</p>
                <p className="mt-1 text-xs text-slate-500">{order.delivery}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default SellerOrdersPage;
