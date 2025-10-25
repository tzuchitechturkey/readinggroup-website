import { ChevronLeft, ChevronRight } from "lucide-react";

function ArrowButton({ side, onClick, label }) {
  const isLeft = side === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        "absolute top-1/2 -translate-y-1/2 z-20 transition",
        isLeft ? "left-3 md:left-6" : "right-3 md:right-6",
        "h-11 w-11 md:h-12 md:w-12 grid place-items-center rounded-full",
        "bg-white/15 text-white backdrop-blur-sm shadow-lg",
        "ring-1 ring-white/20 hover:bg-white/25 hover:ring-white/30",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b63d6]",
      ].join(" ")}
    >
      {isLeft ? (
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
      ) : (
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
      )}
    </button>
  );
}

export default ArrowButton;
