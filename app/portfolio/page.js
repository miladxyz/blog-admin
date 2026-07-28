// app/portfolio/page.js

import PortfolioContent from './PortfolioContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mehrdm.me';
const PAGE_URL = `${SITE_URL}/portfolio`;
const PHOTO_URL = `${SITE_URL}/images/mehrnaz.jpg`;

const TITLE = 'Portfolio | Mehrnaz Bahramzadeh — Growth Marketing & Marketing Automation Specialist';
const DESCRIPTION =
  "Portfolio of Mehrnaz Bahramzadeh, a Growth Marketing & Marketing Automation Specialist with 6+ years of experience. Case studies from Komodaa, Eseminar, and Paper Trails covering customer acquisition, CRM, lifecycle marketing, and B2B lead generation.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'Mehrnaz Bahramzadeh',
    'Growth Marketing',
    'Marketing Automation Specialist',
    'CRM & Lifecycle Marketing',
    'Mobile App Marketing',
    'B2B Lead Generation',
    'Customer Acquisition',
    'Marketing Portfolio',
    'Komodaa',
    'Eseminar',
  ],
  authors: [{ name: 'Mehrnaz Bahramzadeh' }],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Mehrnaz's Blog",
    type: 'profile',
    locale: 'en_US',
    images: [
      {
        url: PHOTO_URL,
        width: 1200,
        height: 1200,
        alt: 'Mehrnaz Bahramzadeh — Growth Marketing & Marketing Automation Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [PHOTO_URL],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: 'Mehrnaz Bahramzadeh',
    jobTitle: 'Growth Marketing & Marketing Automation Specialist',
    description: DESCRIPTION,
    image: PHOTO_URL,
    url: PAGE_URL,
    email: 'mailto:Mehrnazbahramzadeh@gmail.com',
    sameAs: ['https://www.linkedin.com/in/mehrnazbahramzadeh', 'https://www.instagram.com/mehrnazb_dm'],
    knowsAbout: [
      'Growth Marketing',
      'Marketing Automation',
      'CRM & Lifecycle Marketing',
      'Mobile App Marketing',
      'B2B Lead Generation',
      'Customer Acquisition',
      'Content Strategy',
    ],
  },
};

export default function Portfolio() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioContent />
    </>
  );
}
