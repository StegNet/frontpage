import { org } from '@/lib/org';

/** Builds a mailto: link with a pre-filled subject and body. */
export function mailto(subject: string, body?: string) {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${org.email}?${params.join('&')}`;
}

// Ready-made emails, shared by the contact and about pages.
export const emailTemplates = {
  membership: {
    subject: 'Membership enquiry',
    body: 'Hi StegNet,\n\nI would like to know more about membership.\n\nName:\nAbout me:\n\n',
  },
  collaboration: {
    subject: 'Collaboration proposal',
    body: 'Hi StegNet,\n\nI would like to propose a collaboration.\n\nOrganisation:\nIdea in brief:\n\n',
  },
  security: {
    subject: 'Security report',
    body: 'Hi StegNet,\n\nI would like to report a potential security issue.\n\nAffected URL / system:\nDescription:\nSteps to reproduce:\nImpact:\n\n',
  },
  official: {
    subject: 'Administrative enquiry',
    body: 'Hi StegNet,\n\n',
  },
} as const;
