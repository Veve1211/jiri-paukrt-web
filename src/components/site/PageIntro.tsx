import type { ReactNode } from "react";

export function PageIntro({
  chart,
  title,
  children,
}: {
  chart: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <p className="mb-5 font-mono text-[11px] tracking-[0.25em] text-cyan/80">{chart}</p>
      <h1 className="text-[44px] leading-[1] font-light tracking-tight text-balance md:text-[72px]">
        {title}
      </h1>
      {children && (
        <div className="mt-6 max-w-[560px] text-[15px] leading-relaxed text-dim">{children}</div>
      )}
    </div>
  );
}
