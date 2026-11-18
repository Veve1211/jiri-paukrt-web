export function Starfield() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <div className="stars absolute inset-0 opacity-80" />
      <div className="stars stars-fine twinkle absolute inset-0 opacity-50" />
      <div className="absolute -top-40 right-[-120px] h-[620px] w-[760px] rounded-full bg-volt/20 blur-[120px]" />
      <div className="absolute bottom-[-200px] left-[20%] h-[420px] w-[620px] rounded-full bg-cyan/10 blur-[120px]" />
    </div>
  );
}
