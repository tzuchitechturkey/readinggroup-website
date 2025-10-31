function Band({ children, tone = "light" }) {
  const toneClass =
    tone === "blue"
      ? "bg-gradient-to-b from-[#eef6ff] to-white"
      : "bg-gradient-to-b from-slate-50 to-white";
  return (
    <section className={`${toneClass} py-12 md:py-16`}>
      <div className="container mx-auto max-w-7xl px-6">{children}</div>
    </section>
  );
}

export default Band;
