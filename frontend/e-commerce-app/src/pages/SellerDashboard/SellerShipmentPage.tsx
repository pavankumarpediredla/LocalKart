const shipmentItems = [
  "ORD-4201 • Packed and ready for courier pickup",
  "ORD-4202 • Address verification pending",
  "ORD-4203 • Shipped with tracking ID SHP-9021",
];

const SellerShipmentPage = () => {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
      <p className="text-lg font-semibold">Shipment tracking details</p>
      <p className="mt-1 text-sm text-slate-400">Track dispatch, courier handoff, and delivery status updates.</p>

      <div className="mt-5 grid gap-3">
        {shipmentItems.map((item) => (
          <div key={item} className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-200">
            {item}
          </div>
        ))}
      </div>
    </article>
  );
};

export default SellerShipmentPage;
