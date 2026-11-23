'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLogger } from '@/lib/logger-context';
import { formattedAddress, leadership, org, team } from '@/lib/org';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Person = (typeof leadership)[number] | (typeof team)[number];

// Two wide cards per row (four narrow ones in a row looked cramped). A lone
// last card is centred, so odd counts stay balanced.
function PeopleList({ people }: { people: readonly Person[] }) {
  return (
    <ul className="mt-8 flex list-none flex-wrap justify-center gap-4 text-left">
      {people.map((person) => (
        <li key={person.name} className="w-full sm:w-[calc(50%_-_0.5rem)]">
          <Card className="h-full justify-center">
            <CardContent className="flex items-center gap-4 sm:gap-5 sm:px-6">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg font-medium">
                  {person.initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 gap-0.5">
                <CardTitle className="text-lg">{person.name}</CardTitle>
                {/* Lines wrap between roles before breaking inside one. */}
                <p className="flex flex-wrap gap-x-1 text-sm font-medium">
                  {person.roles.map((role, i) => (
                    <span key={role}>
                      {role}
                      {i < person.roles.length - 1 && ' ·'}
                    </span>
                  ))}
                </p>
                <CardDescription>{person.title}</CardDescription>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

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

        <PeopleList people={leadership} />
      </section>

      <section aria-labelledby="team" className="mt-16 w-full max-w-4xl">
        <h2
          id="team"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Team
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          The people who help run the association.
        </p>

        <PeopleList people={team} />
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
              className="inline-block py-1 text-muted-foreground hover:text-foreground hover:underline"
            >
              {org.email}
            </a>
          </dd>
        </dl>
      </section>
    </main>
  );
}
