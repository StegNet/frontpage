// Single source of truth for the association's legal / contact details.
// Rendered on the homepage, in the footer and in the Organization JSON-LD.
export const org = {
  name: 'StegNet',
  legalName: 'Udruga za digitalne tehnologije StegNet',
  alternateName: 'StegNet Digital Technologies Association',
  url: 'https://stegnet.com',
  // Croatian personal identification number (equivalent of an EIN / tax ID).
  oib: '58269598155',
  // Registry number in the Croatian Register of Associations (Registar udruga).
  registryNumber: '18003779',
  email: 'max@stegnet.com',
  address: {
    street: 'Vinež 332F',
    postalCode: '52220',
    city: 'Labin',
    region: 'Istra',
    country: 'Croatia',
    countryCode: 'HR',
  },
} as const;

// People authorised to represent the association.
export const leadership = [
  {
    name: 'Max Lucas Gobo',
    initials: 'MG',
    roles: ['President', 'Information Security Lead'],
    title: 'Predsjednik udruge',
  },
  {
    name: 'Noa Hrvat',
    initials: 'NH',
    roles: ['Vice President'],
    title: 'Podpredsjednik udruge',
  },
  {
    name: 'Adrian Franković',
    initials: 'AF',
    roles: ['Secretary'],
    title: 'Tajnik udruge',
  },
] as const;

export const formattedAddress = `${org.address.street}, ${org.address.postalCode} ${org.address.city}, ${org.address.region}, ${org.address.country}`;

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
