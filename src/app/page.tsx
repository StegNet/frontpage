import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  Lightbulb,
  BookOpen,
  Hammer,
  Handshake,
  Mail,
  MapPin,
  Share2,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  AudienceBubbles,
  LocationPin,
  ShareNetwork,
} from '@/components/home-visuals';
import { TopicMarquee } from '@/components/topic-marquee';
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
    <section aria-labelledby={id} className="mt-5">
      <h3
        id={id}
        className="text-xs font-medium tracking-widest text-muted-foreground uppercase"
      >
        {title}
      </h3>
      <ul className="mt-3 flex list-none flex-col gap-3">
        {people.map((person) => (
          <li key={person.name} className="flex items-center gap-3">
            <Avatar className="size-10 ring-2 ring-amber-500/30 ring-offset-2 ring-offset-card">
              <AvatarFallback className="bg-gradient-to-br from-amber-500/15 to-fuchsia-500/15 text-sm font-medium text-foreground">
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
                    {i < person.roles.length - 1 && ' ·'}
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

// Topics straight from the association's mission.
const topics = [
  'IT',
  'Computing',
  'Digital technologies',
  'Innovation',
  'Entrepreneurship',
];

// Second marquee row: how we work and who it's for, as on the about page.
const practices = [
  'Learn',
  'Build',
  'Share',
  'Students',
  'Hobbyists',
  'Professionals',
];

const audiences = [
  { label: 'Students', icon: GraduationCap },
  { label: 'Hobbyists', icon: Lightbulb },
  { label: 'Professionals', icon: Briefcase },
];

const ways: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
}[] = [
  {
    icon: Users,
    title: 'Become a member',
    text: 'Join the association and learn, build and share alongside others.',
    href: membershipLink,
  },
  {
    icon: Handshake,
    title: 'Propose a collaboration',
    text: 'Have an idea for a project, event or partnership? Tell us about it.',
    href: mailto(
      emailTemplates.collaboration.subject,
      emailTemplates.collaboration.body,
    ),
  },
  {
    icon: ShieldCheck,
    title: 'Report a security issue',
    text: 'Found something wrong on our systems? Let us know privately.',
    href: mailto(emailTemplates.security.subject, emailTemplates.security.body),
  },
];

function Tile({
  icon: Icon,
  title,
  children,
  visual,
  className,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  visual?: ReactNode;
  className?: string;
  delay: number;
}) {
  return (
    <li
      className={cn(
        'reveal group relative flex flex-col overflow-hidden rounded-2xl bg-card p-6 ring-1 ring-foreground/10 transition-shadow hover:shadow-md hover:ring-foreground/20',
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {visual && (
        <div className="mb-6 flex flex-1 flex-col justify-center">{visual}</div>
      )}
      <div className="mt-auto">
        <div className="flex items-center gap-2">
          <Icon aria-hidden className="size-4 text-muted-foreground" />
          <h3 className="font-semibold tracking-tight">{title}</h3>
        </div>
        <p className="mt-1.5 text-sm text-balance text-muted-foreground">
          {children}
        </p>
      </div>
    </li>
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

export default function Home() {
  return (
    // overflow-x-clip: the glow can't cause sideways scroll.
    <main className="relative flex flex-1 flex-col items-center overflow-x-clip px-4 pb-24 sm:px-6">
      <LogPageView message="Rendering home page..." />
      <RevealOnScroll />

      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="relative flex min-h-[calc(100svh-4rem)] w-full flex-col items-center justify-center py-24 text-center"
      >
        {/* Decorative grid, faded out towards the edges. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        />
        <div
          aria-hidden
          className="animate-glow pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-fuchsia-500/10 to-transparent blur-3xl sm:size-[44rem]"
        />

        <Badge
          variant="outline"
          className={cn(
            'mb-6 gap-2 bg-background/60 text-muted-foreground backdrop-blur',
            enter,
          )}
        >
          <span aria-hidden className="size-1.5 rounded-full bg-amber-500" />
          Non-profit &middot; {org.address.city}, Istria
        </Badge>

        <h1
          id="hero-title"
          className={cn(
            'max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl',
            enter,
            'motion-safe:delay-75',
          )}
        >
          {org.legalName}
        </h1>

        <p
          className={cn(
            'mt-4 text-base font-medium text-balance text-muted-foreground sm:text-lg',
            enter,
            'motion-safe:delay-100',
          )}
        >
          {org.alternateName}
        </p>

        <p
          className={cn(
            'mt-6 max-w-2xl text-base text-balance text-muted-foreground sm:text-lg',
            enter,
            'motion-safe:delay-150',
          )}
        >
          A non-profit association from Croatia, promoting IT, computing and
          digital technologies as well as fostering a culture of innovation and
          entrepreneurship.
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
            href="/about"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'bg-background/60 px-4 backdrop-blur',
            )}
          >
            About the association
            <ArrowRight aria-hidden data-icon="inline-end" />
          </Link>
        </div>
      </section>

      {/* What we do */}
      <section aria-labelledby="what-title" className="w-full max-w-5xl">
        <SectionHeading
          id="what-title"
          eyebrow="What we do"
          title="A place to grow with technology"
        >
          We bring together people who are curious about technology.
        </SectionHeading>

        <ul className="mt-10 grid list-none gap-4 md:grid-cols-6">
          <Tile
            icon={BookOpen}
            title="Learn together"
            className="md:col-span-4"
            delay={0}
            visual={<TopicMarquee rows={[topics, practices]} />}
          >
            Explore IT, computing and digital technologies with people who share
            your curiosity.
          </Tile>

          <Tile
            icon={Hammer}
            title="Build real projects"
            className="md:col-span-2"
            delay={100}
            visual={
              <div
                aria-hidden
                className="rounded-lg bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-zinc-300 ring-1 ring-white/10"
              >
                <p>
                  <span className="text-amber-400">$</span> git init idea
                </p>
                <p>
                  <span className="text-amber-400">$</span> build &amp;&amp;
                  share
                </p>
                <p className="text-emerald-400">✓ done, together</p>
              </div>
            }
          >
            Turn ideas into working projects and grow an entrepreneurial
            mindset.
          </Tile>

          <Tile
            icon={Share2}
            title="Share what you know"
            className="md:col-span-2"
            delay={0}
            visual={<ShareNetwork />}
          >
            Pass your knowledge on, so the whole community grows with it.
          </Tile>

          <Tile
            icon={Users}
            title="Open to everyone"
            className="md:col-span-2"
            delay={100}
            visual={<AudienceBubbles items={audiences} />}
          >
            Whether you are just starting out or have years of experience.
          </Tile>

          <Tile
            icon={MapPin}
            title="Rooted in Istria"
            className="md:col-span-2"
            delay={200}
            visual={
              <LocationPin
                label={`${org.address.city} · ${org.address.region} · ${org.address.countryCode}`}
              />
            }
          >
            Registered in {org.address.city}, {org.address.country}, and run by
            volunteers from the community.
          </Tile>
        </ul>
      </section>

      {/* Get involved */}
      <section
        aria-labelledby="involved-title"
        className="mt-20 w-full max-w-5xl sm:mt-28"
      >
        <SectionHeading
          id="involved-title"
          eyebrow="Get involved"
          title="Three ways to start"
        >
          Each one opens a ready-made email, so you only fill in the details.
        </SectionHeading>

        <ul className="mt-10 grid list-none gap-4 md:grid-cols-3">
          {ways.map((way, i) => (
            <li
              key={way.title}
              className="reveal"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <a
                href={way.href}
                className="group flex h-full flex-col rounded-2xl bg-card p-6 ring-1 ring-foreground/10 outline-none hover:shadow-md hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:transition-all motion-safe:hover:-translate-y-1"
              >
                <span
                  aria-hidden
                  className="flex size-10 items-center justify-center rounded-lg bg-muted ring-1 ring-foreground/10 transition-colors group-hover:bg-foreground group-hover:text-background"
                >
                  <way.icon className="size-5" />
                </span>
                <span className="mt-4 font-semibold tracking-tight">
                  {way.title}
                </span>
                <span className="mt-1.5 text-sm text-muted-foreground">
                  {way.text}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 pt-1 text-sm font-medium">
                  Write to us
                  <ArrowRight
                    aria-hidden
                    className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* People and registration */}
      <section
        aria-label="Who runs StegNet"
        className="mt-20 grid w-full max-w-5xl gap-4 sm:mt-28 md:grid-cols-2"
      >
        <div className="reveal flex flex-col rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
          <h2 className="font-semibold tracking-tight">Run by volunteers</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            The association is led by people who give their own time to it.
          </p>
          <PeopleGroup id="leadership" title="Leadership" people={leadership} />
          <PeopleGroup id="team" title="Team" people={team} />
          <Link
            href="/about#leadership"
            className="mt-6 inline-flex items-center gap-1 self-start py-1 text-sm font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
          >
            Meet the people
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        <div
          className="reveal flex flex-col rounded-2xl bg-card p-6 ring-1 ring-foreground/10"
          style={{ animationDelay: '100ms' }}
        >
          <h2 className="flex items-center gap-2 font-semibold tracking-tight">
            <BadgeCheck aria-hidden className="size-4 text-amber-500" />
            Officially registered
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Listed in the Croatian Register of Associations.
          </p>
          <dl className="mt-5 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-muted-foreground">OIB</dt>
            <dd className="font-mono">{org.oib}</dd>
            <dt className="text-muted-foreground">Registarski broj</dt>
            <dd className="font-mono">{org.registryNumber}</dd>
            <dt className="text-muted-foreground">Sjedište</dt>
            <dd>
              {org.address.city}, {org.address.region}
            </dd>
          </dl>
          <Link
            href="/about#details"
            className="mt-auto inline-flex items-center gap-1 self-start pt-6 pb-1 text-sm font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
          >
            All official details
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </section>

      {/* Closing call to action */}
      <section
        aria-labelledby="cta-title"
        className="reveal relative mt-20 w-full max-w-5xl overflow-hidden rounded-2xl bg-zinc-950 px-6 py-14 text-center text-white ring-1 ring-white/10 sm:mt-28 sm:px-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-500/30 via-fuchsia-500/20 to-transparent blur-3xl"
        />
        <div className="relative">
          <h2
            id="cta-title"
            className="text-2xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Curious about technology? Come build with us.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-balance text-zinc-400 sm:text-base">
            Membership questions, ideas or just a hello. We read every message.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={membershipLink}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-white px-4 text-zinc-950 hover:bg-zinc-200',
              )}
            >
              <Mail aria-hidden data-icon="inline-start" />
              Become a member
            </a>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-white/20 bg-transparent px-4 text-white hover:bg-white/10 hover:text-white',
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
