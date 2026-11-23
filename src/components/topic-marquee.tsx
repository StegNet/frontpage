'use client';

// Home page "Learn together" tile visual. Motion lives in globals.css and is
// off for reduced motion; everyone else can pause it (WCAG 2.2.2).
import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Two rows of pills drifting in opposite directions. */
export function TopicMarquee({ rows }: { rows: string[][] }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        {rows.map((row, r) => (
          <div
            key={r}
            aria-hidden
            className={cn(
              'flex w-max',
              r % 2 ? 'animate-marquee-reverse' : 'animate-marquee',
              paused && '[animation-play-state:paused]',
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

      {/* Nothing moves with reduced motion, so there is nothing to pause. */}
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Pause scrolling topics"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
        className="mt-3 self-end motion-reduce:hidden"
      >
        {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
      </Button>
    </div>
  );
}
