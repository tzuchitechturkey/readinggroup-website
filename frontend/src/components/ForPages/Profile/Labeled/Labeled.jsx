const Labeled = ({ label, children }) => (
  <div className="space-y-1">
    <div className="text-sm font-normal text-[#5B6B79]">{label}</div>
    <div className="text-sm text-[#1D2630]">{children}</div>
  </div>
);

export default Labeled;
