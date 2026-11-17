'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/lib/org';
import { cn } from '@/lib/utils';

export function SiteNav() {
  // Strip a trailing slash so `/about/` still marks "About" as current.
  const pathname = usePathname().replace(/(.)\/$/, '$1');

  return (
    <nav
      aria-label="Main"
      className="fixed top-4 left-4 z-50 flex items-center gap-1 rounded-lg border border-border bg-background/80 p-1 text-sm backdrop-blur"
    >
      {navLinks.map((link) => {
        const current = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? 'page' : undefined}
            className={cn(
              'rounded-md px-2.5 py-1 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              current && 'bg-muted text-foreground',
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
