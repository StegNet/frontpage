'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CopyState = 'idle' | 'copied' | 'error';

/**
 * Copies `value` to the clipboard and briefly confirms it, both visually and
 * via a polite live region for screen readers.
 */
export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  /** What is being copied, e.g. "email address" — used for the accessible name. */
  label: string;
  className?: string;
}) {
  const [state, setState] = useState<CopyState>('idle');
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  async function copy() {
    let next: CopyState;
    try {
      await navigator.clipboard.writeText(value);
      next = 'copied';
    } catch {
      next = 'error';
    }
    setState(next);
    clearTimeout(timeout.current);
    // Leave the manual-copy guidance up long enough to read.
    timeout.current = setTimeout(
      () => setState('idle'),
      next === 'error' ? 6000 : 2000,
    );
  }

  return (
    <span className="relative inline-flex shrink-0">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={copy}
        aria-label={`Copy ${label}`}
        title={`Copy ${label}`}
        className={cn('text-muted-foreground', className)}
      >
        {state === 'copied' ? (
          <Check
            aria-hidden
            className="text-emerald-600 dark:text-emerald-400"
          />
        ) : (
          <Copy aria-hidden />
        )}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'copied'
          ? `Copied ${label}`
          : state === 'error'
            ? `Could not copy ${label}`
            : ''}
      </span>
      {state === 'error' && (
        <span className="absolute top-full right-0 z-10 mt-1 w-max max-w-56 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10">
          Couldn&apos;t copy. Select the {label} and copy it manually.
        </span>
      )}
    </span>
  );
}
