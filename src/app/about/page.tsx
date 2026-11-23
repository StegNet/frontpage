import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  GraduationCap,
  Hammer,
  HeartHandshake,
  Lightbulb,
  Mail,
  MapPin,
  Share2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CopyButton } from '@/components/copy-button';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { emailTemplates, mailto } from '@/lib/mailto';
import { formattedAddress, leadership, org, team } from '@/lib/org';
import { enter } from '@/lib/motion';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About — StegNet',
  description:
    'About Udruga za digitalne tehnologije StegNet — a volunteer-run, non-profit digital technologies association from Labin, Istria, Croatia: our mission, who we are for, leadership and official details.',
  alternates: {
    canonical: '/about',
  },
};

const membershipLink = mailto(
  emailTemplates.membership.subject,
  emailTemplates.membership.body,
);

// Jump links target the <section>s, not their headings: sections carry
// scroll-mt-24 (room for the fixed nav) and aren't shifted by `reveal`.
const sections = [
  { id: 'mission', label: 'Mission' },
  { id: 'audience', label: "Who it's for" },
  { id: 'leadership', label: 'Leadership' },
  { id: 'team', label: 'Team' },
  { id: 'details', label: 'Official details' },
] as const;

const facts: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: HeartHandshake,
    title: 'Non-profit',
    text: 'We operate on a non-profit basis.',
  },
  {
    icon: Users,
    title: 'Volunteer-run',
    text: 'The association is run by volunteers.',
  },
  {
    icon: MapPin,
    title: 'Based in Istria',
    text: `Registered office in ${org.address.city}, ${org.address.country}.`,
  },
  {
    icon: BadgeCheck,
    title: 'Officially registered',
    text: 'Listed in the Croatian Register of Associations.',
  },
];

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: BookOpen,
    title: 'Learn',
    text: 'Explore IT, computing and digital technologies alongside people who share your curiosity.',
  },
  {
    icon: Hammer,
    title: 'Build',
    text: 'Turn ideas into working projects and grow an innovative, entrepreneurial mindset.',
  },
  {
    icon: Share2,
    title: 'Share',
    text: 'Pass what you know on, so the whole community grows with it.',
  },
];

const audiences: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: GraduationCap,
    title: 'Students',
    text: 'Go beyond the classroom and learn together with others.',
  },
  {
    icon: Lightbulb,
    title: 'Hobbyists',
    text: 'Tinker, experiment and meet people who enjoy it as much as you do.',
  },
  {
    icon: Briefcase,
    title: 'Professionals',
    text: 'Share your experience and help others take their next step.',
  },
];

const officialDetails = [
  { label: 'Legal name', value: org.legalName, mono: false },
  { label: 'English name', value: org.alternateName, mono: false },
  { label: 'OIB', value: org.oib, mono: true },
  { label: 'Registarski broj', value: org.registryNumber, mono: true },
  { label: 'Sjedište', value: formattedAddress, mono: false },
] as const;

function IconTile({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground ring-1 ring-foreground/10 transition-colors',
        className,
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="reveal text-center">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
      >
        {title}
      </h2>
      {children && (
        <p className="mx-auto mt-2 max-w-xl text-sm text-balance text-muted-foreground sm:text-base">
          {children}
        </p>
      )}
    </div>
  );
}

type Person = (typeof leadership)[number] | (typeof team)[number];

// Two wide cards per row (four narrow ones in a row looked cramped). A lone
// last card is centred, so odd counts stay balanced.
function PeopleList({ people }: { people: readonly Person[] }) {
  return (
    <ul className="mt-8 flex list-none flex-wrap justify-center gap-4">
      {people.map((person, i) => (
        <li
          key={person.name}
          className="reveal w-full sm:w-[calc(50%_-_0.5rem)]"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <Card className="h-full justify-center hover:shadow-md hover:ring-foreground/20 motion-safe:transition-all motion-safe:hover:-translate-y-1">
            <CardContent className="flex items-center gap-4 sm:gap-5 sm:px-6">
              {/* No size="lg": its data-[size=lg]:size-10 would beat size-14/16. */}
              <Avatar className="size-14 ring-2 ring-amber-500/30 ring-offset-2 ring-offset-card sm:size-16">
                <AvatarFallback className="bg-gradient-to-br from-amber-500/15 to-fuchsia-500/15 text-lg font-medium text-foreground">
                  {person.initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 gap-0.5">
                <CardTitle className="text-base sm:text-lg">
                  {person.name}
                </CardTitle>
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

export default function About() {
  return (
    // overflow-x-clip (not overflow-hidden): stops the glow causing sideways
    // scroll without making <main> a scroll container.
    <main className="relative flex flex-1 flex-col items-center overflow-x-clip px-4 py-24 sm:px-6">
      <RevealOnScroll />
      <div
        aria-hidden
        className="animate-glow pointer-events-none absolute top-72 left-1/2 -z-10 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-fuchsia-500/10 to-transparent blur-3xl sm:top-[22rem] sm:size-[40rem]"
      />

      {/* Hero: who we are in one glance. */}
      <header className="flex max-w-3xl flex-col items-center text-center">
        <Badge
          variant="outline"
          className={cn('mb-6 text-muted-foreground', enter)}
        >
          About us
        </Badge>
        <h1
          className={cn(
            'text-4xl font-semibold tracking-tight text-balance sm:text-5xl',
            enter,
            'motion-safe:delay-75',
          )}
        >
          About StegNet
        </h1>
        <p
          className={cn(
            'mt-4 max-w-2xl text-base text-balance text-muted-foreground sm:text-lg',
            enter,
            'motion-safe:delay-150',
          )}
        >
          A volunteer-run, non-profit association from {org.address.city},
          Istria. We promote IT, computing and digital technologies, and help
          grow a culture of innovation and entrepreneurship in our community.
        </p>
        <p
          className={cn(
            'mt-3 text-xs text-balance text-muted-foreground sm:text-sm',
            enter,
            'motion-safe:delay-150',
          )}
        >
          {org.legalName} &middot; {org.alternateName}
        </p>

        <div
          className={cn(
            'mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row',
            enter,
            'motion-safe:delay-200',
          )}
        >
          <a
            href={membershipLink}
            className={cn(buttonVariants({ size: 'lg' }), 'px-4')}
          >
            <Mail aria-hidden data-icon="inline-start" />
            Become a member
          </a>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'px-4',
            )}
          >
            Contact us
            <ArrowRight aria-hidden data-icon="inline-end" />
          </Link>
        </div>

        <nav
          aria-label="On this page"
          className={cn('mt-8', enter, 'motion-safe:delay-300')}
        >
          <ul className="flex list-none flex-wrap justify-center gap-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex h-8 items-center rounded-full border border-border bg-background/60 px-3 text-sm text-muted-foreground backdrop-blur transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* At a glance */}
      <section aria-label="At a glance" className="mt-14 w-full max-w-4xl">
        <ul className="grid list-none grid-cols-2 gap-3 lg:grid-cols-4">
          {facts.map((fact, i) => (
            <li
              key={fact.title}
              className={enter}
              style={{ animationDelay: `${350 + i * 75}ms` }}
            >
              <Card size="sm" className="h-full">
                <CardHeader className="gap-1">
                  <IconTile icon={fact.icon} className="mb-2 size-9" />
                  <CardTitle>{fact.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {fact.text}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* Mission */}
      <section
        id="mission"
        aria-labelledby="mission-title"
        className="mt-16 w-full max-w-4xl scroll-mt-24 sm:mt-24"
      >
        <SectionHeading
          id="mission-title"
          eyebrow="Why we exist"
          title="Our mission"
        />

        <blockquote className="reveal relative mx-auto mt-8 max-w-3xl rounded-2xl bg-card px-6 py-8 text-center ring-1 ring-foreground/10 sm:px-10 sm:py-10">
          <span
            aria-hidden
            className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"
          />
          <p className="text-xl leading-snug font-medium tracking-tight text-balance sm:text-2xl">
            To promote IT, computing and digital technologies, and to foster a
            culture of innovation and entrepreneurship in our community.
          </p>
        </blockquote>

        <h3 className="reveal mt-14 text-center text-lg font-semibold tracking-tight">
          How we work
        </h3>
        <ol className="mt-6 grid list-none gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="reveal"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Card className="group h-full hover:shadow-md hover:ring-foreground/20 motion-safe:transition-all motion-safe:hover:-translate-y-1 md:items-center md:text-center">
                <CardHeader className="grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 md:w-full md:grid-cols-1 md:justify-items-center md:gap-2">
                  <IconTile
                    icon={step.icon}
                    className="row-span-2 size-11 bg-background group-hover:bg-foreground group-hover:text-background md:row-span-1 md:mb-1"
                  />
                  <CardTitle className="text-base">
                    <span
                      aria-hidden
                      className="mr-1.5 font-mono text-xs text-muted-foreground"
                    >
                      0{i + 1}
                    </span>
                    {step.title}
                  </CardTitle>
                  <CardDescription className="col-start-2 md:col-start-1 md:max-w-64 md:text-balance">
                    {step.text}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      {/* Audience */}
      <section
        id="audience"
        aria-labelledby="audience-title"
        className="mt-16 w-full max-w-4xl scroll-mt-24 sm:mt-24"
      >
        <SectionHeading
          id="audience-title"
          eyebrow="Our community"
          title="Who it's for"
        >
          We bring together people who are curious about technology to learn,
          build and share knowledge.
        </SectionHeading>

        <ul className="mt-8 grid list-none gap-4 sm:grid-cols-3">
          {audiences.map((audience, i) => (
            <li
              key={audience.title}
              className="reveal"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Card className="group h-full hover:shadow-md hover:ring-foreground/20 motion-safe:transition-all motion-safe:hover:-translate-y-1">
                <CardHeader className="grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 sm:grid-cols-1 sm:items-start sm:gap-2">
                  <IconTile
                    icon={audience.icon}
                    className="row-span-2 group-hover:bg-foreground group-hover:text-background sm:row-span-1 sm:mb-2"
                  />
                  <CardTitle className="text-base">{audience.title}</CardTitle>
                  <CardDescription className="col-start-2 sm:col-start-1">
                    {audience.text}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* Leadership */}
      <section
        id="leadership"
        aria-labelledby="leadership-title"
        className="mt-16 w-full max-w-4xl scroll-mt-24 sm:mt-24"
      >
        <SectionHeading
          id="leadership-title"
          eyebrow="Our people"
          title="Leadership"
        >
          The people authorised to represent the association.
        </SectionHeading>

        <PeopleList people={leadership} />
      </section>

      {/* Team */}
      <section
        id="team"
        aria-labelledby="team-title"
        className="mt-16 w-full max-w-4xl scroll-mt-24 sm:mt-24"
      >
        <SectionHeading
          id="team-title"
          eyebrow="Behind the scenes"
          title="Team"
        >
          The people who help run the association.
        </SectionHeading>

        <PeopleList people={team} />
      </section>

      {/* Official details */}
      <section
        id="details"
        aria-labelledby="details-title"
        className="mt-16 w-full max-w-4xl scroll-mt-24 sm:mt-24"
      >
        <SectionHeading
          id="details-title"
          eyebrow="Registration"
          title="Official details"
        >
          For invoices, donations and official correspondence. Tap the copy icon
          to copy a value.
        </SectionHeading>

        {/* overflow-visible: CopyButton's error message drops below the last row. */}
        <Card className="reveal mx-auto mt-8 max-w-2xl overflow-visible py-0">
          <dl className="divide-y divide-border text-sm sm:text-base">
            {officialDetails.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <dt className="shrink-0 text-xs font-medium text-muted-foreground sm:text-sm sm:text-foreground">
                  {item.label}
                </dt>
                <dd className="flex min-w-0 items-center justify-between gap-1 sm:justify-end">
                  <span
                    className={cn(
                      'min-w-0 break-words sm:text-right sm:text-balance sm:text-muted-foreground',
                      item.mono && 'font-mono',
                    )}
                  >
                    {item.value}
                  </span>
                  <CopyButton value={item.value} label={item.label} />
                </dd>
              </div>
            ))}
            <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <dt className="shrink-0 text-xs font-medium text-muted-foreground sm:text-sm sm:text-foreground">
                Email
              </dt>
              <dd className="flex min-w-0 items-center justify-between gap-1 sm:justify-end">
                <a
                  href={`mailto:${org.email}`}
                  className="min-w-0 truncate py-0.5 font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                >
                  {org.email}
                </a>
                <CopyButton value={org.email} label="email address" />
              </dd>
            </div>
          </dl>
        </Card>
      </section>

      {/* Closing call to action */}
      <section
        aria-labelledby="join"
        className="reveal relative mt-16 w-full sm:mt-24 max-w-4xl overflow-hidden rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-foreground/10 sm:px-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-fuchsia-500/15 to-transparent blur-3xl"
        />
        <div className="relative">
          <h2
            id="join"
            className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
          >
            Curious about technology? Join us.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-balance text-muted-foreground sm:text-base">
            Whether you want to become a member, propose a collaboration or just
            ask a question, we read every message.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={membershipLink}
              className={cn(buttonVariants({ size: 'lg' }), 'px-4')}
            >
              <Mail aria-hidden data-icon="inline-start" />
              Become a member
            </a>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'px-4',
              )}
            >
              All contact options
              <ArrowRight aria-hidden data-icon="inline-end" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
