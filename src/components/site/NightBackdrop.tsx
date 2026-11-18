/** Quiet page background: night asphalt, faint lane grid and one distant street-lamp glow. */
export function NightBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <div className="road-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="absolute -top-56 right-[-160px] h-[560px] w-[680px] rounded-full bg-cyan/[0.07] blur-[140px]" />
    </div>
  );
}
