import type { Metadata } from 'next';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { formattedAddress, org } from '@/lib/org';

export const metadata: Metadata = {
  title: 'About — StegNet',
  description:
    'About Udruga za digitalne tehnologije StegNet — a non-profit digital technologies association from Labin, Istria, Croatia.',
  alternates: {
    canonical: '/about',
  },
};

export default function About() {
  return (
    <main className="relative flex flex-1 flex-col items-center px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-fuchsia-500/10 to-transparent blur-3xl"
      />

      <article className="w-full max-w-2xl">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          About StegNet
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          {org.legalName} &middot; {org.alternateName}
        </p>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            StegNet is a non-profit association (udruga) registered in Croatia.
            Our mission is to promote IT, computing and digital technologies,
            and to foster a culture of innovation and entrepreneurship in our
            community.
          </p>
          <p>
            We bring together people who are curious about technology —
            students, hobbyists and professionals — to learn, build and share
            knowledge. The association is run by volunteers and operates on a
            non-profit basis.
          </p>
        </div>

        <Separator className="my-12" />

        <section aria-labelledby="details">
          <h2
            id="details"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Association details
          </h2>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-[max-content_1fr] sm:gap-x-8 sm:text-base">
            <dt className="font-medium">Legal name</dt>
            <dd className="text-muted-foreground">{org.legalName}</dd>

            <dt className="font-medium">OIB</dt>
            <dd className="font-mono text-muted-foreground">{org.oib}</dd>

            <dt className="font-medium">Registarski broj</dt>
            <dd className="font-mono text-muted-foreground">
              {org.registryNumber}
            </dd>

            <dt className="font-medium">Sjedište (registered office)</dt>
            <dd className="text-muted-foreground">{formattedAddress}</dd>

            <dt className="font-medium">Email</dt>
            <dd>
              <a
                href={`mailto:${org.email}`}
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                {org.email}
              </a>
            </dd>
          </dl>
        </section>

        <p className="mt-12 text-sm text-muted-foreground">
          Want to get in touch?{' '}
          <Link href="/contact" className="text-foreground hover:underline">
            Visit the contact page
          </Link>
          .
        </p>
      </article>
    </main>
  );
}
