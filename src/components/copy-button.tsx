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
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('error');
    }
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState('idle'), 2000);
  }

  return (
    <>
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
    </>
  );
}
