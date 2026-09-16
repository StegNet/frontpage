import type { Metadata } from 'next';
import { Mail, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { org } from '@/lib/org';

export const metadata: Metadata = {
  title: 'Contact — StegNet',
  description:
    'Contact Udruga za digitalne tehnologije StegNet — email and registered office address in Labin, Istria, Croatia.',
  alternates: {
    canonical: '/contact',
  },
};

export default function Contact() {
  return (
    <main className="relative flex flex-1 flex-col items-center px-6 py-24 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-fuchsia-500/10 to-transparent blur-3xl"
      />

      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Contact
      </h1>
      <p className="mt-4 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
        Questions about the association, membership or collaboration? Reach us
        by email or at our registered office.
      </p>

      <div className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-2">
        <Card className="h-full items-center text-center">
          <CardHeader className="w-full justify-items-center">
            <Mail aria-hidden className="mb-2 size-6 text-muted-foreground" />
            <CardTitle className="text-lg">Email</CardTitle>
            <CardDescription>Administrative contact</CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href={`mailto:${org.email}`}
              className="font-medium hover:underline"
            >
              {org.email}
            </a>
          </CardContent>
        </Card>

        <Card className="h-full items-center text-center">
          <CardHeader className="w-full justify-items-center">
            <MapPin aria-hidden className="mb-2 size-6 text-muted-foreground" />
            <CardTitle className="text-lg">Sjedište</CardTitle>
            <CardDescription>Registered office</CardDescription>
          </CardHeader>
          <CardContent>
            <address className="not-italic">
              {org.address.street}
              <br />
              {org.address.postalCode} {org.address.city}, {org.address.region}
              <br />
              {org.address.country}
            </address>
          </CardContent>
        </Card>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        {org.legalName} &middot; OIB{' '}
        <span className="font-mono">{org.oib}</span> &middot; Registarski broj{' '}
        <span className="font-mono">{org.registryNumber}</span>
      </p>
    </main>
  );
}
