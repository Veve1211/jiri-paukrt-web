/**
 * Quiet page background: drawing-blue paper, a faint engineering grid and
 * three junction plans drawn like a highway engineer's general arrangement —
 * a roundabout, a signalised crossroads and a motorway diamond interchange.
 */

function Roundabout({ x, y }: { x: number; y: number }) {
  const arm = (rot: number) => (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      {/* carriageway edges */}
      <path d={`M${x - 34} ${y - 88} V${y - 520} M${x + 34} ${y - 88} V${y - 520}`} />
      {/* centre line and splitter island */}
      <path d={`M${x} ${y - 140} V${y - 520}`} strokeDasharray="14 12" />
      <path d={`M${x - 10} ${y - 92} L${x} ${y - 140} L${x + 10} ${y - 92} Z`} />
      {/* give-way line */}
      <path d={`M${x - 34} ${y - 96} H${x - 4}`} strokeDasharray="4 4" />
    </g>
  );
  return (
    <g>
      <circle cx={x} cy={y} r="92" />
      <circle cx={x} cy={y} r="70" strokeDasharray="6 8" />
      <circle cx={x} cy={y} r="40" />
      <circle cx={x} cy={y} r="30" strokeDasharray="2 5" />
      {[0, 90, 180, 270].map((r) => (
        <g key={r}>{arm(r)}</g>
      ))}
    </g>
  );
}

function Crossroads({ x, y }: { x: number; y: number }) {
  const w = 44;
  const stripes = (cx: number, cy: number, vertical: boolean) =>
    Array.from({ length: 7 }, (_, i) => {
      const o = -w + 6 + i * 12.5;
      return vertical ? (
        <rect key={i} x={cx + o} y={cy} width="6" height="22" />
      ) : (
        <rect key={i} x={cx} y={cy + o} width="22" height="6" />
      );
    });
  return (
    <g>
      {/* road edges with kerb radii */}
      <path
        d={`M${x - 700} ${y - w} H${x - w - 20} Q${x - w} ${y - w} ${x - w} ${y - w - 20} V${y - 600}
            M${x + w} ${y - 600} V${y - w - 20} Q${x + w} ${y - w} ${x + w + 20} ${y - w} H${x + 700}
            M${x + 700} ${y + w} H${x + w + 20} Q${x + w} ${y + w} ${x + w} ${y + w + 20} V${y + 600}
            M${x - w} ${y + 600} V${y + w + 20} Q${x - w} ${y + w} ${x - w - 20} ${y + w} H${x - 700}`}
      />
      {/* centre lines */}
      <path d={`M${x - 700} ${y} H${x - w - 60} M${x + w + 60} ${y} H${x + 700}`} strokeDasharray="14 12" />
      <path d={`M${x} ${y - 600} V${y - w - 60} M${x} ${y + w + 60} V${y + 600}`} strokeDasharray="14 12" />
      {/* stop lines */}
      <path d={`M${x - w - 58} ${y} V${y + w} M${x + w + 58} ${y} V${y - w} M${x} ${y - w - 58} H${x - w} M${x} ${y + w + 58} H${x + w}`} />
      {/* pedestrian crossings */}
      <g className="fill-cyan/[0.05]" stroke="none">
        {stripes(x - w - 50, y, false)}
        {stripes(x + w + 28, y, false)}
        {stripes(x, y - w - 50, true)}
        {stripes(x, y + w + 28, true)}
      </g>
      {/* signal heads */}
      {[
        [x - w - 8, y + w + 8],
        [x + w + 8, y - w - 8],
        [x - w - 8, y - w - 8],
        [x + w + 8, y + w + 8],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />
      ))}
    </g>
  );
}

function DiamondInterchange({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* motorway: two carriageways and central reserve */}
      <path d={`M${x - 900} ${y - 46} H${x + 900} M${x - 900} ${y - 8} H${x + 900} M${x - 900} ${y + 8} H${x + 900} M${x - 900} ${y + 46} H${x + 900}`} />
      <path d={`M${x - 900} ${y - 27} H${x + 900} M${x - 900} ${y + 27} H${x + 900}`} strokeDasharray="14 12" />
      {/* overbridge */}
      <path d={`M${x - 26} ${y - 420} V${y + 420} M${x + 26} ${y - 420} V${y + 420}`} />
      <path d={`M${x} ${y - 420} V${y + 420}`} strokeDasharray="14 12" />
      <rect x={x - 34} y={y - 62} width="68" height="124" strokeDasharray="3 4" />
      {/* slip roads */}
      <path d={`M${x - 26} ${y - 150} C${x - 120} ${y - 120} ${x - 260} ${y - 60} ${x - 420} ${y - 50}`} />
      <path d={`M${x + 26} ${y - 150} C${x + 120} ${y - 120} ${x + 260} ${y - 60} ${x + 420} ${y - 50}`} />
      <path d={`M${x - 26} ${y + 150} C${x - 120} ${y + 120} ${x - 260} ${y + 60} ${x - 420} ${y + 50}`} />
      <path d={`M${x + 26} ${y + 150} C${x + 120} ${y + 120} ${x + 260} ${y + 60} ${x + 420} ${y + 50}`} />
    </g>
  );
}

export function BlueprintBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <div className="road-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)]" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        strokeWidth="1.2"
      >
        <g className="stroke-cyan/[0.17]">
          <Roundabout x={170} y={240} />
          <Crossroads x={1420} y={430} />
        </g>
        <g className="stroke-cyan/[0.12]">
          <DiamondInterchange x={760} y={930} />
        </g>
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--void)_95%)] opacity-50" />
      <div className="absolute -top-56 right-[-160px] h-[560px] w-[680px] rounded-full bg-cyan/[0.08] blur-[140px]" />
    </div>
  );
}
