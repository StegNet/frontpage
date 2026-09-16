'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLogger } from '@/lib/logger-context';
import { formattedAddress, org } from '@/lib/org';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const leadership = [
  {
    name: 'Max Lucas Gobo',
    initials: 'MG',
    role: 'President',
    title: 'Predsjednik udruge',
  },
  {
    name: 'Noa Hrvat',
    initials: 'NH',
    role: 'Vice President',
    title: 'Podpredsjednik udruge',
  },
  {
    name: 'Adrian Franković',
    initials: 'AF',
    role: 'Secretary',
    title: 'Tajnik udruge',
  },
];

export default function Home() {
  const logger = useLogger();

  useEffect(() => {
    logger.info('Rendering home page...', { platform: navigator.userAgent });
  }, [logger]);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* Soft background accent — decorative only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-fuchsia-500/10 to-transparent blur-3xl"
      />

      <Badge variant="outline" className="mb-6 text-muted-foreground">
        Welcome to StegNet
      </Badge>

      <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
        Udruga za digitalne tehnologije StegNet
      </h1>

      <p className="mt-4 text-balance text-base font-medium text-muted-foreground sm:text-lg">
        StegNet Digital Technologies Association
      </p>

      <p className="mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
        A non-profit association from Croatia, promoting IT, computing and
        digital technologies as well as fostering a culture of innovation and
        entrepreneurship.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/about"
          className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
        >
          About the association
        </Link>
        <Link
          href="/contact"
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
        >
          Contact us
        </Link>
      </div>

      <Separator className="my-16 max-w-xs" />

      <section aria-labelledby="leadership" className="w-full max-w-4xl">
        <h2
          id="leadership"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Leadership
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          The people authorised to represent the association.
        </p>

        <ul className="mt-8 grid list-none gap-4 sm:grid-cols-3">
          {leadership.map((person) => (
            <li key={person.name}>
              <Card className="h-full items-center text-center">
                <CardHeader className="w-full justify-items-center">
                  <Avatar size="lg" className="mb-2 size-16">
                    <AvatarFallback className="text-lg font-medium">
                      {person.initials}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{person.name}</CardTitle>
                  <CardDescription>{person.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{person.role}</Badge>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <Separator className="my-16 max-w-xs" />

      <section aria-labelledby="details" className="w-full max-w-4xl">
        <h2
          id="details"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Association details
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Official registration and contact information.
        </p>

        <dl className="mx-auto mt-8 grid max-w-xl gap-x-8 gap-y-3 text-left text-sm sm:grid-cols-[max-content_1fr] sm:text-base">
          <dt className="font-medium">Legal name</dt>
          <dd className="text-muted-foreground">{org.legalName}</dd>

          <dt className="font-medium">OIB</dt>
          <dd className="font-mono text-muted-foreground">{org.oib}</dd>

          <dt className="font-medium">Registarski broj</dt>
          <dd className="font-mono text-muted-foreground">
            {org.registryNumber}
          </dd>

          <dt className="font-medium">Sjedište</dt>
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
    </main>
  );
}
