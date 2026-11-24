import Link from 'next/link';
import type { ReactNode } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { LogPageView } from '@/components/log-page-view';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { emailTemplates, mailto } from '@/lib/mailto';
import { leadership, org, team } from '@/lib/org';
import { enter } from '@/lib/motion';
import { cn } from '@/lib/utils';

const membershipLink = mailto(
  emailTemplates.membership.subject,
  emailTemplates.membership.body,
);

const textLink =
  'font-medium underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground';

type Person = (typeof leadership)[number] | (typeof team)[number];

// Representatives and the wider team are listed apart, like on the about page.
function PeopleGroup({
  id,
  title,
  people,
}: {
  id: string;
  title: string;
  people: readonly Person[];
}) {
  return (
    <section aria-labelledby={id} className="mt-6">
      <h3 id={id} className="text-sm font-medium text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-3 flex list-none flex-col gap-3">
        {people.map((person) => (
          <li key={person.name} className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="text-sm font-medium">
                {person.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium">{person.name}</p>
              {/* Lines wrap between roles before breaking inside one. */}
              <p className="flex flex-wrap gap-x-1 text-xs">
                {person.roles.map((role, i) => (
                  <span key={role}>
                    {role}
                    {i < person.roles.length - 1 && ','}
                  </span>
                ))}
              </p>
              <p className="text-xs text-muted-foreground">{person.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const whatWeDo = [
  {
    title: 'Learn together',
    text: 'Explore IT, computing and digital technologies with people who share your curiosity.',
  },
  {
    title: 'Build real projects',
    text: 'Turn ideas into working projects and grow an entrepreneurial mindset.',
  },
  {
    title: 'Share what you know',
    text: 'Pass your knowledge on, so the whole community grows with it.',
  },
  {
    title: 'Open to everyone',
    text: 'Students, hobbyists and professionals, whether you are just starting out or have years of experience.',
  },
];

const ways = [
  {
    title: 'Become a member',
    text: 'Join the association and learn, build and share alongside others.',
    href: membershipLink,
  },
  {
    title: 'Propose a collaboration',
    text: 'Have an idea for a project, event or partnership? Tell us about it.',
    href: mailto(
      emailTemplates.collaboration.subject,
      emailTemplates.collaboration.body,
    ),
  },
  {
    title: 'Report a security issue',
    text: 'Found something wrong on our systems? Let us know privately.',
    href: mailto(emailTemplates.security.subject, emailTemplates.security.body),
  },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="reveal border-t border-border py-12 sm:py-16"
    >
      <h2 id={id} className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    // overflow-x-clip (not overflow-hidden): stops the glow causing sideways
    // scroll without making <main> a scroll container.
    <main className="relative w-full flex-1 overflow-x-clip px-4 pb-16 sm:px-6">
      {/* Width cap lives here, not on <main>, so the glow is clipped by the viewport, not the column. */}
      <div className="relative mx-auto max-w-5xl">
        <LogPageView message="Rendering home page..." />
        <RevealOnScroll />
        <div
          aria-hidden
          className="animate-glow pointer-events-none absolute top-64 left-1/3 -z-10 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-fuchsia-500/10 to-transparent blur-3xl sm:top-72 sm:size-[40rem]"
        />

        <section aria-labelledby="hero-title" className="pt-32 pb-16 sm:pt-40">
          <h1
            id="hero-title"
            className={cn(
              'max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl',
              enter,
              'motion-safe:delay-75',
            )}
          >
            {org.legalName}
          </h1>
          <p
            className={cn(
              'mt-4 text-lg font-medium text-muted-foreground',
              enter,
              'motion-safe:delay-100',
            )}
          >
            {org.alternateName}
          </p>
          <p
            className={cn(
              'mt-6 max-w-2xl text-base text-pretty sm:text-lg',
              enter,
              'motion-safe:delay-150',
            )}
          >
            A non-profit association from {org.address.city},{' '}
            {org.address.country}, promoting IT, computing and digital
            technologies as well as fostering a culture of innovation and
            entrepreneurship. Run by volunteers from the community.
          </p>
          <div
            className={cn(
              'mt-8 flex flex-wrap items-center gap-x-6 gap-y-3',
              enter,
              'motion-safe:delay-200',
            )}
          >
            <a
              href={membershipLink}
              className={cn(buttonVariants({ size: 'lg' }), 'px-4')}
            >
              Become a member
            </a>
            <Link href="/about" className={textLink}>
              About the association
            </Link>
          </div>
        </section>

        <Section id="what-title" title="What we do">
          <ul className="mt-6 grid list-none gap-x-12 gap-y-6 sm:grid-cols-2">
            {whatWeDo.map((item) => (
              <li key={item.title}>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 max-w-prose text-muted-foreground">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="involved-title" title="Get involved">
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Each link opens a ready-made email, so you only fill in the details.
          </p>
          <ul className="mt-6 grid list-none gap-x-12 gap-y-6 md:grid-cols-3">
            {ways.map((way) => (
              <li key={way.title}>
                <a href={way.href} className={textLink}>
                  {way.title}
                </a>
                <p className="mt-1 text-muted-foreground">{way.text}</p>
              </li>
            ))}
          </ul>
        </Section>

        <div className="grid gap-x-12 border-t border-border md:grid-cols-2">
          <section
            aria-labelledby="people-title"
            className="reveal py-12 sm:py-16"
          >
            <h2
              id="people-title"
              className="text-2xl font-semibold tracking-tight"
            >
              Run by volunteers
            </h2>
            <p className="mt-2 text-muted-foreground">
              The association is led by people who give their own time to it.
            </p>
            <PeopleGroup
              id="leadership"
              title="Leadership"
              people={leadership}
            />
            <PeopleGroup id="team" title="Team" people={team} />
            <Link
              href="/about#leadership"
              className={cn(textLink, 'mt-6 inline-block text-sm')}
            >
              Meet the people
            </Link>
          </section>

          <section
            aria-labelledby="registry-title"
            className="reveal border-t border-border py-12 sm:py-16 md:border-t-0"
            style={{ animationDelay: '100ms' }}
          >
            <h2
              id="registry-title"
              className="text-2xl font-semibold tracking-tight"
            >
              Officially registered
            </h2>
            <p className="mt-2 text-muted-foreground">
              Listed in the Croatian Register of Associations.
            </p>
            <dl className="mt-6 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="text-muted-foreground">OIB</dt>
              <dd className="tabular-nums">{org.oib}</dd>
              <dt className="text-muted-foreground">Registarski broj</dt>
              <dd className="tabular-nums">{org.registryNumber}</dd>
              <dt className="text-muted-foreground">Sjedište</dt>
              <dd>
                {org.address.city}, {org.address.region}
              </dd>
            </dl>
            <Link
              href="/about#details"
              className={cn(textLink, 'mt-6 inline-block text-sm')}
            >
              All official details
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
