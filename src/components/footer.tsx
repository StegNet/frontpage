import Link from 'next/link';
import { formattedAddress, navLinks, org } from '@/lib/org';

const version = process.env.NEXT_PUBLIC_APP_VERSION || 'dev';
const commit = process.env.NEXT_PUBLIC_COMMIT_SHA || 'local';
const shortCommit = commit.slice(0, 7);
const hasRealCommit = commit !== 'local';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
      <nav aria-label="Footer" className="mb-4 flex justify-center gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-foreground hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <address className="not-italic">
        <p className="font-medium text-foreground">{org.legalName}</p>
        <p>{org.alternateName}</p>
        <p className="mt-2">
          Sjedište: <span className="text-foreground">{formattedAddress}</span>
        </p>
        <p>
          Email:{' '}
          <a
            href={`mailto:${org.email}`}
            className="text-foreground hover:underline"
          >
            {org.email}
          </a>
        </p>
        <p className="mt-2">
          OIB: <span className="font-mono text-foreground">{org.oib}</span>
          {' · '}
          Registarski broj:{' '}
          <span className="font-mono text-foreground">
            {org.registryNumber}
          </span>
        </p>
      </address>

      <p className="mt-6">
        v{version} &middot;{' '}
        {hasRealCommit ? (
          <a
            href={`https://github.com/StegNet/frontpage/commit/${commit}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground hover:underline"
          >
            {shortCommit}
          </a>
        ) : (
          <span>{shortCommit}</span>
        )}
      </p>
    </footer>
  );
}
