import { ShoppingBag } from "lucide-react";

type BrandMarkProps = {
  compact?: boolean;
  className?: string;
};

const BrandMark = ({ compact = false, className = "" }: BrandMarkProps) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(135deg,#0f766e_0%,#14b8a6_45%,#f59e0b_100%)] text-white shadow-lg shadow-teal-950/20">
        <ShoppingBag className="h-5 w-5" />
      </div>
      {compact ? null : (
        <div className="leading-none">
          <div className="text-2xl font-black tracking-tight text-slate-950">Localkart</div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-teal-700">
            Neighborhood commerce
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandMark;
