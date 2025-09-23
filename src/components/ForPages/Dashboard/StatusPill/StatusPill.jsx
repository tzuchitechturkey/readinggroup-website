export default function StatusPill({ status }) {
  const cfg = {
    Delivered: {
      bg: "bg-[#CDF3E1]",
      text: "text-[#14CA74]",
      dot: "bg-green-600",
    },
    Pending: {
      bg: "bg-[#FFEFD0]",
      text: "text-[#FDB52A]",
      dot: "bg-amber-500",
    },
    Canceled: {
      bg: "bg-[#FFDEE0]",
      text: "text-[#FF5A65]",
      dot: "bg-rose-500",
    },
  }[status] || { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" };

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`size-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}
