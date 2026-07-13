import { cn } from "@/lib/utils";

/** Small "accepted cards" marks on white pills — a familiar trust cue at checkout. */
export function PaymentMarks({ className }: { className?: string }) {
  const pill =
    "flex h-6 w-9 items-center justify-center rounded-[5px] bg-white shadow-sm ring-1 ring-black/5";
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-hidden>
      <span className={pill}>
        <span className="text-[10px] font-black italic tracking-tighter text-[#1A1F71]">
          VISA
        </span>
      </span>
      <span className={pill}>
        <svg viewBox="0 0 40 24" className="h-4 w-6">
          <circle cx="16" cy="12" r="7" fill="#EB001B" />
          <circle cx="24" cy="12" r="7" fill="#F79E1B" fillOpacity="0.85" />
        </svg>
      </span>
      <span className={pill}>
        <span className="text-[7.5px] font-bold uppercase tracking-tight text-[#2E77BC]">
          Amex
        </span>
      </span>
      <span className={pill}>
        <span className="text-[9px] font-extrabold tracking-tight text-[#5A31F4]">
          UPI
        </span>
      </span>
    </div>
  );
}
