'use client';

import { useEffect } from 'react';
import { useLogger } from '@/lib/logger-context';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const logger = useLogger();

  useEffect(() => {
    logger.info('Rendering home page...', { platform: navigator.userAgent });
  }, [logger]);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Soft background accent — decorative only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-fuchsia-500/10 to-transparent blur-3xl"
      />

      <Badge variant="outline" className="mb-6 gap-2 text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
        </span>
        StegNet
      </Badge>

      <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
        We&apos;re cooking up something awesome.
      </h1>

      <p className="mt-6 max-w-md text-balance text-base text-muted-foreground sm:text-lg">
        Pardon the lack of detail — we&apos;ll reach out when we have more for
        you. Check back soon-ish.
      </p>
    </main>
  );
}
