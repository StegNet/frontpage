import type { Metadata } from 'next';
import {
  ArrowUpRight,
  ExternalLink,
  FileText,
  Handshake,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CopyButton } from '@/components/copy-button';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { emailTemplates, mailto } from '@/lib/mailto';
import { formattedAddress, org } from '@/lib/org';
import { enter } from '@/lib/motion';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact — StegNet',
  description:
    'Contact Udruga za digitalne tehnologije StegNet — email, registered office address in Labin, Istria, Croatia, and official registration details.',
  alternates: {
    canonical: '/contact',
  },
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`;

const topics: {
  title: string;
  description: string;
  icon: LucideIcon;
  subject: string;
  body: string;
}[] = [
  {
    title: 'Membership',
    description: 'Joining the association or questions about being a member.',
    icon: Users,
    ...emailTemplates.membership,
  },
  {
    title: 'Collaboration',
    description: 'Partnerships, joint projects, events or sponsorship.',
    icon: Handshake,
    ...emailTemplates.collaboration,
  },
  {
    title: 'Security report',
    description: 'Responsibly disclose a vulnerability in one of our systems.',
    icon: ShieldCheck,
    ...emailTemplates.security,
  },
  {
    title: 'Official matters',
    description: 'Invoices, documents and administrative correspondence.',
    icon: FileText,
    ...emailTemplates.official,
  },
];

const officialDetails = [
  { label: 'Legal name', value: org.legalName, mono: false },
  { label: 'OIB', value: org.oib, mono: true },
  { label: 'Registarski broj', value: org.registryNumber, mono: true },
] as const;

function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      aria-hidden
      className="mb-3 flex size-10 items-center justify-center rounded-lg bg-muted text-foreground ring-1 ring-foreground/10"
    >
      <Icon className="size-5" />
    </span>
  );
}

export default function Contact() {
  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-24">
      <RevealOnScroll />
      <div
        aria-hidden
        className="animate-glow pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 via-fuchsia-500/10 to-transparent blur-3xl"
      />

      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <Badge
          variant="outline"
          className={cn('mb-6 text-muted-foreground', enter)}
        >
          Get in touch
        </Badge>
        <h1
          className={cn(
            'text-balance text-4xl font-semibold tracking-tight sm:text-5xl',
            enter,
            'motion-safe:delay-75',
          )}
        >
          Contact us
        </h1>
        <p
          className={cn(
            'mt-4 max-w-xl text-balance text-base text-muted-foreground sm:text-lg',
            enter,
            'motion-safe:delay-150',
          )}
        >
          Questions about the association, membership or collaboration? Email is
          the best way to reach us — we read every message.
        </p>
      </div>

      {/* Primary channels */}
      <section
        aria-label="Contact channels"
        className="mt-12 grid w-full max-w-4xl gap-4 md:grid-cols-5"
      >
        <Card
          className={cn('md:col-span-3', enter)}
          style={{ animationDelay: '250ms' }}
        >
          <CardHeader>
            <IconTile icon={Mail} />
            <CardTitle className="text-lg">Email</CardTitle>
            <CardDescription>
              The fastest way to reach the association.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto space-y-4">
            <div className="flex items-center gap-1">
              <a
                href={`mailto:${org.email}`}
                className="truncate text-xl font-semibold tracking-tight hover:underline sm:text-2xl"
              >
                {org.email}
              </a>
              <CopyButton value={org.email} label="email address" />
            </div>
            <a
              href={`mailto:${org.email}`}
              className={cn(buttonVariants({ size: 'lg' }), 'px-3')}
            >
              <Send aria-hidden data-icon="inline-start" />
              Write to us
            </a>
          </CardContent>
        </Card>

        <Card
          className={cn('md:col-span-2', enter)}
          style={{ animationDelay: '350ms' }}
        >
          <CardHeader>
            <IconTile icon={MapPin} />
            <CardTitle className="text-lg">Sjedište</CardTitle>
            <CardDescription>Registered office</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto space-y-4">
            <div className="flex items-start justify-between gap-2">
              <address className="text-base not-italic">
                {org.address.street}
                <br />
                {org.address.postalCode} {org.address.city},{' '}
                {org.address.region}
                <br />
                {org.address.country}
              </address>
              <CopyButton value={formattedAddress} label="address" />
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'px-3',
              )}
            >
              <ExternalLink aria-hidden data-icon="inline-start" />
              Open in Maps
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-16 max-w-xs" />

      {/* Topic shortcuts */}
      <section aria-labelledby="topics" className="w-full max-w-4xl">
        <div className="reveal text-center">
          <h2
            id="topics"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            What&apos;s it about?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
            Pick a topic and your email app opens with a ready-made subject and
            outline, so your message reaches the right hands faster.
          </p>
        </div>

        <ul className="mt-8 grid list-none gap-4 sm:grid-cols-2">
          {topics.map((topic, i) => (
            <li
              key={topic.title}
              className="reveal"
              style={{ animationDelay: `${(i % 2) * 100}ms` }}
            >
              <a
                href={mailto(topic.subject, topic.body)}
                className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Card className="h-full group-hover:shadow-md group-hover:ring-foreground/20 motion-safe:transition-all motion-safe:group-hover:-translate-y-0.5">
                  <CardHeader className="grid-cols-[auto_1fr_auto] items-start gap-x-4">
                    <span
                      aria-hidden
                      className="row-span-2 flex size-10 items-center justify-center rounded-lg bg-muted ring-1 ring-foreground/10 transition-colors group-hover:bg-foreground group-hover:text-background"
                    >
                      <topic.icon className="size-5" />
                    </span>
                    <CardTitle className="text-base">{topic.title}</CardTitle>
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 text-muted-foreground group-hover:text-foreground motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                    />
                    <CardDescription className="col-start-2 col-span-2">
                      {topic.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </a>
            </li>
          ))}
        </ul>

        <p className="reveal mt-6 text-center text-sm text-muted-foreground">
          No email app set up? Copy the address above and write to us from your
          webmail.
        </p>
      </section>

      <Separator className="my-16 max-w-xs" />

      {/* Official details */}
      <section aria-labelledby="details" className="w-full max-w-4xl">
        <div className="reveal text-center">
          <h2
            id="details"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Official details
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
            For invoices, donations and official correspondence.
          </p>
        </div>

        {/* overflow-visible: CopyButton's error message drops below the last row. */}
        <Card className="reveal mx-auto mt-8 max-w-xl overflow-visible py-0">
          <dl className="divide-y divide-border text-sm sm:text-base">
            {officialDetails.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <dt className="shrink-0 font-medium">{item.label}</dt>
                <dd className="flex min-w-0 items-center gap-1 text-muted-foreground">
                  <span
                    className={cn(
                      'text-right text-balance',
                      item.mono && 'font-mono',
                    )}
                  >
                    {item.value}
                  </span>
                  <CopyButton value={item.value} label={item.label} />
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>
    </main>
  );
}
