/** Quiet page background: drawing-blue paper with a faint engineering grid. */
export function BlueprintBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <div className="road-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)]" />
      <div className="absolute -top-56 right-[-160px] h-[560px] w-[680px] rounded-full bg-cyan/[0.08] blur-[140px]" />
    </div>
  );
}
