import Link from 'next/link';
import { navLinks } from '@/lib/org';

export function SiteNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed top-4 left-4 z-50 flex items-center gap-1 rounded-lg border border-border bg-background/80 p-1 text-sm backdrop-blur"
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-md px-2.5 py-1 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
