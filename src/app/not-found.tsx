import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-fuchsia-500/10 to-transparent blur-3xl"
      />

      <p className="mb-4 text-sm font-medium tracking-widest text-muted-foreground">
        404
      </p>

      <h1 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
        This page wandered off.
      </h1>

      <p className="mt-6 max-w-md text-balance text-base text-muted-foreground">
        The page you&apos;re after doesn&apos;t exist — or isn&apos;t ready yet.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Back home
      </Link>
    </main>
  );
}
