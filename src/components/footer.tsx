const version = process.env.NEXT_PUBLIC_APP_VERSION || 'dev';
const commit = process.env.NEXT_PUBLIC_COMMIT_SHA || 'local';
const shortCommit = commit.slice(0, 7);
const hasRealCommit = commit !== 'local';

export function Footer() {
  return (
    <footer className="mt-auto py-4 text-center text-xs text-muted-foreground">
      <span>
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
      </span>
    </footer>
  );
}
