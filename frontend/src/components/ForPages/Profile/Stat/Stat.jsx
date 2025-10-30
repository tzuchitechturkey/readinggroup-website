// Simple stat item
const Stat = ({ label, value }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-lg font-semibold leading-none">{value}</span>
  </div>
);
export default Stat;
