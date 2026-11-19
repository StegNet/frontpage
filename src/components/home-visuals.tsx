// Decorative tile visuals for the home page "What we do" grid.
// Motion lives in globals.css and is off for reduced motion.
import { MapPin, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Two rows of pills drifting in opposite directions. */
export function TopicMarquee({ rows }: { rows: string[][] }) {
  return (
    <div className="flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      {rows.map((row, r) => (
        <div
          key={r}
          aria-hidden
          className={cn(
            'flex w-max',
            r % 2 ? 'animate-marquee-reverse' : 'animate-marquee',
          )}
        >
          {/* An even number of copies keeps the -50% loop seamless (mr-* not
              gap-* for the same reason); four so short rows still fill wide tiles. */}
          {[...row, ...row, ...row, ...row].map((item, i) => (
            <span
              key={i}
              className="mr-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm whitespace-nowrap transition-colors group-hover:border-foreground/20"
            >
              {item}
            </span>
          ))}
        </div>
      ))}
      <ul className="sr-only">
        {rows.flat().map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const center = { x: 120, y: 60 };
const nodes = [
  { x: 28, y: 22 },
  { x: 18, y: 78 },
  { x: 70, y: 108 },
  { x: 170, y: 108 },
  { x: 222, y: 78 },
  { x: 212, y: 22 },
];

/** Knowledge flowing from one node out to the rest of the community. */
export function ShareNetwork() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 120"
      className="mx-auto h-auto w-full max-w-64 overflow-visible"
    >
      <defs>
        <linearGradient id="share-node" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-amber-500)" />
          <stop offset="100%" stopColor="var(--color-fuchsia-500)" />
        </linearGradient>
      </defs>
      {nodes.map((n, i) => (
        <g key={i}>
          <line
            x1={center.x}
            y1={center.y}
            x2={n.x}
            y2={n.y}
            className="stroke-foreground/15"
            strokeWidth={1}
          />
          <line
            x1={center.x}
            y1={center.y}
            x2={n.x}
            y2={n.y}
            className="animate-flow stroke-amber-500"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="3 17"
            style={{ animationDelay: `${i * -0.3}s` }}
          />
        </g>
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={6}
          className="animate-node fill-card stroke-foreground/40"
          strokeWidth={1.5}
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
      <circle
        cx={center.x}
        cy={center.y}
        r={20}
        fill="url(#share-node)"
        className="animate-node-ring"
        opacity={0.25}
      />
      <circle cx={center.x} cy={center.y} r={12} fill="url(#share-node)" />
    </svg>
  );
}

/** Audience bubbles bobbing gently, one after another. */
export function AudienceBubbles({
  items,
}: {
  items: { label: string; icon: LucideIcon }[];
}) {
  return (
    <ul
      aria-label="Who it's for"
      className="flex list-none items-start justify-center gap-5"
    >
      {items.map(({ label, icon: Icon }, i) => (
        <li key={label} className="flex flex-col items-center gap-2">
          {/* Only the bubble moves; moving text makes it shimmer. */}
          <span
            aria-hidden
            className="animate-float flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/15 to-fuchsia-500/15 ring-1 ring-foreground/10 transition-colors group-hover:ring-foreground/25"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            <Icon className="size-5" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Map pin over a faint dot grid. Static on purpose. */
export function LocationPin({ label }: { label: string }) {
  return (
    <div
      aria-hidden
      className="flex flex-col items-center gap-3 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:14px_14px] py-2 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-amber-500/20">
        <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-fuchsia-500 text-white shadow-md">
          <MapPin className="size-4" />
        </span>
      </span>
      <span className="font-mono text-xs tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
