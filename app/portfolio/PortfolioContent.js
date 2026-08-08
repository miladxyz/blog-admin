// app/portfolio/PortfolioContent.js
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
/* ---------------------------------------------------------
   Small building blocks
--------------------------------------------------------- */

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Chevron({ open }) {
  return (
    <svg
      className={`w-5 h-5 shrink-0 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function Collapsible({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        <Chevron open={open} />
      </button>
      {open && <div className="px-5 py-5 border-t border-gray-100">{children}</div>}
    </div>
  );
}

function StatPill({ value, label }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl px-4 py-4 text-center border border-blue-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-purple-200 cursor-default">
      <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-xs text-gray-600 mt-1 leading-snug">{label}</div>
    </div>
  );
}

function ImagePlaceholder({ label }) {
  return (
    <div className="mb-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-10 px-6 text-center">
      <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function Gallery({ images }) {
  const [lightbox, setLightbox] = useState(null);
  const singleWide = images.length === 1;
  const smCols = Math.min(images.length, 4);
  const gridColsClass =
    { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' }[smCols] || 'sm:grid-cols-4';

  return (
    <>
      <div className={singleWide ? 'mb-6' : `mb-6 grid grid-cols-2 ${gridColsClass} gap-3`}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox(img)}
            className={`group relative overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow bg-white ${
              singleWide ? 'w-full aspect-[16/9]' : 'aspect-square'
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={singleWide ? '(max-width: 768px) 100vw, 640px' : '(max-width: 640px) 50vw, 25vw'}
              className={`${singleWide || img.fit === 'contain' ? 'object-contain p-2' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-3xl aspect-video">
            <Image src={lightbox.src} alt={lightbox.alt} fill className="object-contain" />

          </div>
        </div>
      )}
    </>
  );
}

function Paragraphs({ items }) {
  if (!items) return null;
  const arr = Array.isArray(items) ? items : [items];
  return (
    <div className="space-y-3">
      {arr.map((p, i) => (
        <p key={i} className="text-gray-700 leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

function BulletList({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-2 mt-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-gray-700 leading-relaxed">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TagList({ items }) {
  if (!items) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map((item, i) => (
        <span
          key={i}
          className="text-sm font-medium text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function SectionBody({ section }) {
  return (
    <div className="space-y-4">
      <Paragraphs items={section.paragraphs} />
      {section.image && (
        <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
          <Image
            src={section.image.src}
            alt={section.image.alt}
            width={1600}
            height={520}
            className="w-full h-auto object-contain"
          />
          {section.image.caption && (
            <p className="text-xs text-gray-500 text-center py-2 px-3 bg-white border-t border-gray-100">
              {section.image.caption}
            </p>
          )}
        </div>
      )}
      <BulletList items={section.list} />
      <TagList items={section.tags} />
      {section.groups &&
        section.groups.map((g, i) => (
          <div key={i}>
            <h4 className="font-semibold text-gray-900 mb-1">{g.heading}</h4>
            <BulletList items={g.list} />
          </div>
        ))}
    </div>
  );
}

function RoadmapRow({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {items.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-full">{step}</span>
          {i < items.length - 1 && (
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   Case study / campaign card
--------------------------------------------------------- */

function LinkPills({ links }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
        >
          {link.icon === 'instagram' ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          ) : link.icon === 'play' ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
          {link.label}
        </a>
      ))}
    </div>
  );
}

function SocialLinks({ links }) {
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ${link.bgClass}`}
        >
          {link.icon}
          {link.label}
        </a>
      ))}
    </div>
  );
}

function CaseStudyCard({ id, kind, title, subtitle, roadmap, stats, links, imageNote, images, sections, downloadHref, downloadLabel }) {
  return (
    <div id={id} className="scroll-mt-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="p-6 sm:p-10">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-4">
          {kind}
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">{subtitle}</p>

        <LinkPills links={links} />

        {roadmap && <RoadmapRow items={roadmap} />}

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {stats.map((s, i) => (
              <StatPill key={i} value={s.value} label={s.label} />
            ))}
          </div>
        )}

        {images && images.length > 0 ? <Gallery images={images} /> : imageNote && <ImagePlaceholder label={imageNote} />}

        {downloadHref && (
          <a
            href={downloadHref}
            download
            className="inline-flex items-center gap-2 mt-4 mb-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full hover:shadow-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download {downloadLabel || 'Full Report'} (PDF)
          </a>
        )}

        <div className="space-y-3 mt-2">
          {sections.map((sec, i) => (
            <Collapsible key={sec.title} title={sec.title} defaultOpen={i === 0}>
              <SectionBody section={sec} />
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Data — sourced from Mehrnaz's portfolio document
--------------------------------------------------------- */

const caseStudies = [
  {
    id: 'komodaa',
    kind: 'Case Study',
    title: 'Growing with Komodaa',
    subtitle:
      "Joining as the first marketing hire, I helped an early-stage startup grow from a 5-person team to a 50-person scale-up serving over 2 million users.",
    roadmap: ['Junior Growth Marketing Specialist', 'Growth Lead', 'Marketing Automation Manager'],
    stats: [
      { value: '2M+', label: 'Women users' },
      { value: '500K', label: 'Monthly active users' },
      { value: '300K', label: 'Instagram followers' },
      { value: '5 → 50', label: 'Team members' },
    ],
    links: [
      { href: 'https://www.komodaa.com/', label: 'komodaa.com' },
      { href: 'http://instagram.com/komodaa', label: '@komodaa', icon: 'instagram' },
    ],
    images: [
      { src: '/images/komodaa/komodaa-1.jpg', alt: 'The Komodaa founding team at the office' },
      { src: '/images/komodaa/komodaa-2.jpg', alt: 'The Komodaa team group photo' },
      { src: '/images/komodaa/komodaa-3.jpg', alt: 'The Komodaa team on a video call' },
      { src: '/images/komodaa/komodaa-4.jpg', alt: 'The Komodaa team at an in-person gathering' },
      { src: '/images/komodaa/komodaa-5.jpg', alt: 'The Komodaa team sitting together, masked, during the pandemic' },
      { src: '/images/komodaa/komodaa-6.jpg', alt: 'The Komodaa team on a large group video call' },
      { src: '/images/komodaa/komodaa-7.jpg', alt: 'The Komodaa team posing together for a group photo' },
      { src: '/images/komodaa/komodaa-8.jpg', alt: 'The modern glass-walled meeting room at the Komodaa office' },
    ],
    sections: [
      {
        title: 'Overview',
        paragraphs: [
          'Komodaa is a women-only h2h (human to human) social commerce platform that combines community, fashion, and circular economy principles. The platform enables women to buy, sell, and discover fashion items while connecting with like-minded people through a mobile app and website.',
          "When I joined in 2018, Komodaa was an early-stage startup with just five team members. Over the next five years, I grew alongside the company as it scaled into one of Iran's largest social commerce platforms.",
        ],
      },
      {
        title: 'My Role',
        paragraphs: ["I joined Komodaa as the company's first marketing hire and progressed through multiple roles during my five-year journey:"],
        list: ['Growth Marketing Specialist', 'Content Marketing Lead', 'Marketing Automation Manager'],
      },
      {
        title: 'Team Collaboration',
        paragraphs: [
          'Throughout this journey, I worked closely with the CEO, Product, Design, Engineering, and Customer Support teams, while also collaborating with agencies, influencers, and business partners to drive sustainable growth.',
        ],
      },
      {
        title: 'Challenges',
        paragraphs: ['As an early-stage startup, we had to build the marketing function from the ground up while supporting rapid business growth. Our key challenges included:'],
        list: [
          'Growing user acquisition efficiently',
          'Building an engaged community',
          'Increasing mobile app adoption',
          'Creating scalable CRM and lifecycle marketing',
          'Supporting marketplace activity and retention',
          'Launching campaigns that delivered measurable business results',
        ],
      },
      {
        title: 'What I Did',
        paragraphs: ['During my time at Komodaa, I contributed across multiple areas of Growth Marketing:'],
        list: [
          'Customer Acquisition',
          'Mobile App Marketing',
          'CRM & Lifecycle Marketing',
          'Marketing Automation',
          'Content Strategy',
          'Social Media Growth',
          'Influencer Marketing',
          'Community Building',
          'Campaign Planning & Execution',
          'Deep Linking',
          'Analytics & Performance Reporting',
          'Cross-functional Collaboration',
        ],
      },
      {
        title: 'Tools & Platforms',
        paragraphs: ['The tech stack I worked with day-to-day to run acquisition, automation, and analytics:'],
        tags: [
          'Intrack & Mautic (Marketing Automation)',
          'Metrix (Attribution & Marketing Automation)',
          'Firebase',
          'Google Ads',
          'GA4',
          'Google Tag Manager',
          'SMS Marketing Platform',
          'Yektanet & Tapsel (Paid Advertising)',
          'Canva',
          'CapCut',
          'WordPress',
        ],
      },
      {
        title: 'Results',
        paragraphs: ['Together with an incredible team, we achieved significant business growth:'],
        list: [
          '🚀 Grew the platform to 2M+ registered users',
          '📱 Reached 500K monthly active users (MAU)',
          '📸 Grew Instagram from 0 to 300K followers',
          '💼 Helped establish the marketing function from the ground up',
          "💰 Contributed to the company's growth that supported a strategic investment from Digikala Group",
        ],
      },
      {
        title: 'Social Media Highlights',
        paragraphs: [
          'Some of the most engaging social media content I ran at Komodaa were interactive Instagram games and challenges, which regularly outperformed standard posts, driving thousands of comments and likes per post while growing the community organically.',
        ],
        image: {
          src: '/images/komodaa/komodaa-social-highlights.jpg',
          alt: "Komodaa's Instagram account growth across its rebrand, from 5,650 to 295K followers",
          caption: "Instagram follower growth across Komodaa's brand evolution — from 5,650 to 295K followers",
        },
      },
      {
        title: 'Key Takeaways',
        paragraphs: [
          'My experience at Komodaa taught me how to build scalable growth systems in a fast-moving startup environment. Working across acquisition, engagement, retention, and automation strengthened my ability to combine creativity, data, and cross-functional collaboration to drive sustainable business growth.',
        ],
      },
    ],
  },
  {
    id: 'komodaa-crm-automation',
    kind: 'Campaign Spotlight',
    title: 'CRM Automation & Lifecycle Design',
    subtitle:
      'As the CRM & Marketing Automation Specialist at Komodaa, I designed the full lifecycle automation system from scratch, covering all key user moments from first sign-up to repeat purchase and re-engagement across a platform with 2.2M+ users.',
    stats: [
      { value: '5', label: 'Automation flows designed' },
      { value: '2.2M+', label: 'Users covered' },
    ],
    links: [
      { href: 'https://www.komodaa.com/', label: 'komodaa.com' },
    ],
    sections: [
      {
        title: 'Overview',
        paragraphs: [
          '5 automation flows designed and implemented, including onboarding, buyer-seller messaging, abandoned cart, post-purchase, liked items, search-based recommendations, and RFM behavioral segmentation. Each journey below was designed end-to-end, from trigger logic and channel sequencing to fallback rules and escalation paths.',
        ],
      },
      {
        title: '30-Day Onboarding Journey',
        paragraphs: [
          '30-step automated sequence from sign-up to first purchase, each message designed for a specific lifecycle goal: welcome, trust building, social proof, community, and seller activation.',
        ],
        list: [
          <>
            <strong>For Trust & Safety:</strong> Explains secure payment and money-back guarantee (Day 3)
          </>,
          <>
            <strong>For Social Proof:</strong> Real seller who earned 60M Toman inspires new sellers. Highlighting 2.2M women users already on the platform. (Day 2 & 5)
          </>,
          <>
            <strong>For Community:</strong> Invites users to join interest-based communities: fashion, books, beauty.
          </>,
        ],
        tags: ['Push Notifications', 'In-app message', 'SMS'],
      },
      {
        title: 'Buyer-Seller Messaging Flow',
        paragraphs: [
          "Automated multi-step follow-up triggered when sellers don't respond to buyer messages within 24 hours. If still unresolved after 3 attempts, contact automatically escalated to the call center.",
        ],
        image: {
          src: '/images/komodaa/journey-buyer-seller-messaging.png',
          alt: 'Buyer-Seller Messaging Flow automation diagram',
        },
        tags: ['Push Notifications', 'In-app message', 'SMS'],
      },
      {
        title: 'Post-Purchase Confirmation & Return Journey',
        paragraphs: [
          'Automated flow triggered 7 days after purchase. If the buyer confirmed receipt, the system released payment to the seller. If the buyer requested a return, return conditions were communicated automatically. Push notification first, SMS as fallback. Unresolved cases escalated to call center.',
        ],
        image: {
          src: '/images/komodaa/journey-post-purchase-return.png',
          alt: 'Post-Purchase Confirmation & Return Journey automation diagram',
        },
        tags: ['Push Notifications', 'In-app message', 'SMS', 'Call center escalation'],
      },
      {
        title: 'Abandoned Cart Journey',
        paragraphs: [
          'Automated re-engagement triggered 6 hours after a user adds an item to basket without completing purchase. Message included the item name dynamically. Push notification first, web push and in-app message as secondary, SMS as final fallback based on reachability. Journey exits automatically if the item is removed from the basket.',
        ],
        tags: ['Push Notifications', 'Web push', 'In-app message', 'SMS'],
      },
      {
        title: 'Liked Items Journey',
        paragraphs: [
          'Automated price-drop alert triggered when a seller adds a discount to an item a buyer has previously liked. Message included the item name dynamically and a direct link to the item. Designed to re-trigger purchase intent at the right moment without generic promotions.',
        ],
        tags: ['Push Notifications', 'Web push', 'In-app messages', 'SMS'],
      },
      {
        title: 'RFM Behavioral Segmentation',
        paragraphs: [
          'Designed re-engagement campaigns based on the RFM model — Recency, Frequency, and Monetary value. Buyers who purchased from a specific category multiple times but had been inactive for several months received targeted messages with express discount codes. High basket value buyers received premium item suggestions with free express shipping. Conversion tracking built into each journey.',
        ],
        image: {
          src: '/images/komodaa/journey-rfm-segmentation.png',
          alt: 'RFM Behavioral Segmentation automation diagram',
        },
      },
    ],
  },
  {
    id: 'komodaa-black-friday',
    kind: 'Campaign Spotlight',
    title: 'Black Friday Campaign',
    subtitle:
      "Komodaa's Black Friday campaign was designed to boost marketplace activity by increasing app engagement, product listings, and sales through a coordinated multi-channel marketing campaign.",
    stats: [
      { value: '+223%', label: 'App installations' },
      { value: '+95%', label: 'New registrations' },
      { value: '+36%', label: 'App sessions' },
      { value: '+57%', label: 'Sold items' },
      { value: '+177%', label: 'New customers' },
      { value: '+15%', label: 'Uploaded listings' },
    ],
    links: [
      { href: 'https://www.komodaa.com/', label: 'komodaa.com' },
      { href: 'http://instagram.com/komodaa', label: '@komodaa', icon: 'instagram' },
    ],
    images: [
      {
        src: '/images/komodaa/black-friday-creatives.jpg',
        alt: "Komodaa Black Friday social media creatives: Go Green This Black Friday campaign artwork",
        fit: 'contain',
      },
      {
        src: '/images/komodaa/black-friday-sold-items-chart.jpg',
        alt: 'Sold items chart showing a peak during the Black Friday campaign, year over year',
        fit: 'contain',
      },
    ],
    sections: [
      {
        title: 'My Role',
        list: [
          'Planned and executed the campaign with cross-functional teams',
          'Coordinated in-app banner placements',
          'Managed SMS campaign communications',
          'Monitored campaign performance and reported key metrics',
          'Optimized campaign execution based on daily performance data',
        ],
      },
      {
        title: 'Results',
        paragraphs: ['Compared with the pre-campaign period, the Black Friday campaign achieved:'],
        list: [
          '📈 223% increase in app installations (8,902 → 28,743)',
          '👤 95% increase in new user registrations (3,949 → 7,714)',
          '🚀 36% increase in app sessions (87K → 118K)',
          '🛍️ 57% increase in sold items (2,458 → 3,868)',
          '🎯 177% increase in new customers (266 → 737)',
          '👗 15% increase in uploaded listings (24,189 → 27,929)',
        ],
      },
      {
        title: 'Impact',
        paragraphs: [
          'The campaign generated a sharp increase in marketplace activity, with noticeable peaks in daily Gross Merchandise Value (GMV), daily sold items, and daily uploaded listings. Performance tracking throughout the campaign enabled the team to monitor results in real time and optimize communications across multiple marketing channels.',
        ],
      },
    ],
  },
  {
    id: 'eseminar',
    kind: 'Case Study',
    title: 'Senior Lead Generation at Eseminar',
    subtitle:
      'Driving B2B lead generation through multi-channel campaigns, marketing automation, and performance analytics for a platform with over 1 million users.',
    stats: [
      { value: '40,000+', label: 'Leads generated' },
      { value: '80+', label: 'VIP webinars delivered' },
      { value: '27%+', label: 'Top email open rate' },
      { value: '5%+', label: 'Top SMS CTR' },
    ],
    links: [{ href: 'http://eseminar.tv/', label: 'eseminar.tv' }],
    images: [
      { src: '/images/eseminar/eseminar-1.jpg', alt: 'The Eseminar team on a video call' },
      { src: '/images/eseminar/eseminar-2.jpg', alt: 'The Eseminar team on a video call, gallery view' },
    ],
    sections: [
      {
        title: 'Overview',
        paragraphs: [
          'Eseminar is a digital platform for online webinars and virtual events, connecting businesses with professionals through educational and sponsored online events. As the Senior Lead Generation Specialist, I owned the end-to-end planning, execution, optimization, and reporting of lead generation campaigns for sponsored webinars.',
        ],
      },
      {
        title: 'My Role',
        paragraphs: [
          'I was responsible for managing lead generation campaigns from strategy to execution, working closely with sales, design, product, and external partners. My responsibilities included:',
        ],
        list: [
          'Lead Generation Strategy',
          'Marketing Automation',
          'Email Marketing',
          'SMS Marketing',
          'Google Ads',
          'Website Banner Campaigns',
          'Landing Page Optimisation',
          'UTM Tracking',
          'Campaign Analytics',
          'Dashboard Reporting',
          'Budget Management',
          'Cross-functional Collaboration',
        ],
      },
      {
        title: 'Challenges',
        list: [
          'Generating high-quality B2B leads',
          'Maximising webinar registrations',
          'Improving campaign performance across channels',
          'Tracking the complete customer journey',
          'Reporting campaign ROI to stakeholders',
        ],
      },
      {
        title: 'What I Did',
        list: [
          'Planned and executed multi-channel lead generation campaigns for sponsored webinars.',
          'Built and managed email and SMS campaigns using Brevo.',
          'Segmented audiences using RFM analysis to deliver more relevant communications.',
          'Conducted A/B tests on email campaigns to optimise open rates, click-through rates, and conversions.',
          'Managed Google Ads, website banners, and landing page campaigns.',
          'Implemented UTM tracking and analysed campaign performance using GA4, GTM, Looker Studio, and Microsoft Clarity.',
          'Monitored campaign KPIs and continuously optimised performance based on data insights.',
          'Collaborated with sales, design, and product teams to improve lead quality and campaign effectiveness.',
          'Planned and executed retargeting and remarketing campaigns to re-engage webinar landing page visitors and past leads across digital channels.',
        ],
      },
      {
        title: 'Tools',
        tags: ['Brevo CRM', 'GA4', 'Google Tag Manager', 'Looker Studio', 'Microsoft Clarity', 'Google Ads', 'Email Marketing Platforms', 'UTM Tracking', 'Excel', 'AI Tools (ChatGPT, Claude)'],
      },
      {
        title: 'Results',
        groups: [
          {
            heading: 'Business Impact',
            list: [
              '🎯 Generated 40,000+ leads',
              '🎤 Delivered 80+ VIP webinars',
              '📚 Managed campaigns across Finance (Crypto & Forex), Immigration, Business, Self-Growth, and Language Learning',
            ],
          },
          {
            heading: 'Campaign Performance',
            list: [
              '📬 Email open rate: over 27%',
              '🖱️ SMS click-through rate (CTR): over 5%',
              'Email click-through rate (CTR): over 1.5%',
              '📈 Improved registration conversion through continuous campaign optimisation and A/B testing',
              '🎯 Increased campaign relevance through RFM-based audience segmentation in Brevo',
              '📊 Measured and optimised performance using GA4, GTM, Looker Studio, Microsoft Clarity, and UTM tracking',
            ],
          },
        ],
      },
      {
        title: 'Key Takeaways',
        paragraphs: [
          'Working at Eseminar strengthened my expertise in performance-driven marketing, marketing automation, attribution, analytics, and B2B lead generation. It also improved my ability to connect marketing activities with measurable business outcomes.',
        ],
      },
    ],
  },
  {
    id: 'eseminar-crm-lead-gen',
    kind: 'Campaign Spotlight',
    title: 'CRM-Driven Email Marketing & Lead Generation',
    subtitle:
      'As Senior Lead Generation Specialist, I owned end-to-end email and SMS campaigns to drive webinar registrations.',
    links: [{ href: 'http://eseminar.tv/', label: 'eseminar.tv' }],
    sections: [
      {
        title: 'Problem',
        paragraphs: [
          'Generic email campaigns sent to all users with no targeting logic, resulting in low relevance and poor conversion for webinar registrations.',
        ],
      },
      {
        title: 'What I Did',
        paragraphs: [
          'Applied existing RFM segmentation in Brevo to select the right audience for each webinar campaign. Matched webinar topic to user interest history — for example, targeting users who had attended 3+ finance webinars for a new finance event, users active in the last 30 days for time-sensitive campaigns, or combining multiple conditions for more precise targeting.',
        ],
      },
      {
        title: 'Impact',
        paragraphs: [
          'Higher relevance per campaign. Guaranteed registration targets delivered for sponsored VIP webinars through data-driven audience selection.',
        ],
      },
      {
        title: 'Segmentation Logic',
        list: [
          <>
            <strong>Recency segment:</strong> Users active in the last 30 days — highest engagement probability.
          </>,
          <>
            <strong>Frequency segment:</strong> Users who attended 3+ webinars on a specific topic (e.g. finance, business, marketing).
          </>,
          <>
            <strong>Topic-match segment:</strong> Users who previously registered for webinars in the same category as the upcoming event.
          </>,
          <>
            <strong>Multi-channel fallback:</strong> Email first. SMS for users who didn't open within 24 hours.
          </>,
          <>
            <strong>Performance tracking:</strong> UTM parameters on all links. GA4 + Looker Studio for session, registration, CTR, open rate, and CPL tracking.
          </>,
        ],
      },
    ],
  },
  {
    id: 'paper-trails',
    kind: 'Case Study',
    title: 'Dutch Market Entry Strategy for Paper Trails',
    subtitle:
      'Developed a research-driven market entry and content strategy to help Paper Trails enter the Dutch market through customer research, strategic planning, and communication prototypes.',
    links: [
      { href: 'https://rohausandco.com/', label: 'rohausandco.com' },
      {
        href: 'https://drive.google.com/file/d/14i8xNdaASoiGwwOLA3YMb_R1BlSq1RA8/view?usp=sharing',
        label: 'Watch Prototype Video',
        icon: 'play',
      },
    ],
    images: [
      { src: '/images/paper-trails/paper-trails-interview.jpg', alt: 'Conducting a qualitative research interview for the Paper Trails project' },
    ],
    downloadHref: '/downloads/paper-trails-dutch-market-entry-strategy.pdf',
    downloadLabel: 'Dutch Market Entry Strategy',
    sections: [
      {
        title: 'Overview',
        paragraphs: [
          'Paper Trails is a conversation card game developed by Rohaus & Co to encourage meaningful conversations and intentional travel experiences. As part of this project, I developed a research-driven market entry strategy for the Dutch market. The project combined qualitative market research, customer insights, content strategy, media planning, and prototype development to support the product launch.',
        ],
      },
      {
        title: 'Challenges',
        list: [
          'Identify the most relevant target audience in the Dutch market',
          'Understand customer motivations, behaviours, and purchasing decisions',
          'Position a new product in a competitive market',
          'Develop a content and media strategy based on customer insights',
          'Validate communication concepts before launch',
        ],
      },
      {
        title: 'What I Did',
        list: [
          'Conducted market research to understand the Dutch market and identify market opportunities.',
          'Designed and conducted qualitative user research using semi-structured interviews.',
          'Analysed research findings through open, axial, and selective coding.',
          'Developed customer personas based on behavioural insights.',
          'Performed competitor analysis to identify positioning opportunities.',
          'Developed a Dutch market entry strategy.',
          'Created a research-driven content strategy.',
          'Designed a media strategy including content pillars and channel recommendations.',
          'Created communication prototypes to validate strategic concepts.',
          'Presented strategic recommendations to the client.',
        ],
      },
      {
        title: 'Deliverables',
        tags: [
          '📊 Market Research Report',
          '👥 Customer Personas',
          '🇳🇱 Dutch Market Entry Strategy',
          '📝 Content Strategy',
          '📣 Media Strategy',
          '🎯 Content Pillars',
          '🔍 Competitor Analysis',
          '💡 Strategic Recommendations',
        ],
      },
      {
        title: 'Communication Prototypes',
        paragraphs: ['To validate the proposed strategy, I developed several content prototypes for different stages of the customer journey, including:'],
        list: [
          '📧 Newsletter concepts',
          '📱 Instagram carousel posts',
          '🎥 Short-form videos for Instagram Reels and TikTok',
          '✨ Messaging concepts aligned with the brand positioning',
        ],
      },
      {
        title: 'Research Highlights',
        list: [
          '🎙️ Conducted 8 in-depth interviews',
          '📝 Analysed 691 coded quotes',
          '👤 Developed customer personas',
          '🔍 Identified 7 key behavioural themes',
          '🇳🇱 Created a market entry strategy tailored to the Dutch market',
        ],
      },
      {
        title: 'Key Insights',
        paragraphs: ['The research revealed that the target audience values:'],
        list: [
          'Authentic social connections',
          'Intentional living',
          'Digital detox',
          'Meaningful gifting',
          'Mindful travel experiences',
          'Experiences over material possessions',
          'Conscious consumer behaviour',
        ],
      },
      {
        title: 'Key Learnings',
        paragraphs: [
          'This project strengthened my ability to transform customer and market research into actionable marketing strategies. It reinforced the value of evidence-based decision-making by connecting research insights with market positioning, content planning, and prototype development for a new market.',
        ],
      },
    ],
  },
];

const studentProjects = [
  {
    name: 'Carrots.nl',
    website: 'https://www.carrots.nl/',
    description: 'A Dutch vegan marketplace connecting buyers and sellers of vegan products across multiple categories.',
    contributions: [
      'Developed a creative brief, including audience insights and content direction.',
      'Conducted quantitative research using SPSS and qualitative user interviews.',
      'Developed customer personas and defined target audience segments.',
      'Mapped customer journeys to identify content opportunities.',
      'Contributed to the development of the content strategy and implementation plan.',
      'Participated in prototype design to validate content concepts.',
      'Translated research findings into actionable marketing recommendations.',
    ],
    deliverable: 'Creative Brief',
    downloadHref: '/downloads/carrots-creative-brief.pdf',
  },
  {
    name: 'Merk Fryslân',
    website: 'https://www.merkfryslan.nl/nl',
    description: 'A place-branding project promoting Friesland as an attractive destination for international students.',
    contributions: [
      'Conducted audience research and communication analysis.',
      'Developed customer personas and audience insights.',
      'Contributed to content strategy development.',
      'Participated in experimental prototype design and content testing.',
      'Helped develop the final pitchbook and strategic recommendations.',
    ],
    deliverable: 'Pitchbook',
    downloadHref: '/downloads/merk-fryslan-pitchbook.pdf',
    videoHref: 'https://drive.google.com/file/d/1oYBlIbKerEGFUTH4zoNvmRW13WYKA55f/view?usp=sharing',
    videoLabel: 'Watch Prototype Video',
  },
  {
    name: 'Qualitative Content Analysis of Volvo Video Advertisement',
    description:
      "For this academic project, I conducted an in-depth qualitative content analysis of a Volvo video advertisement, applying Freitag's Narrative Theory and Semiotic frameworks to decode how the brand communicates safety, trust, and emotion to its audience. The analysis examined visual language, storytelling structure, and symbolic meaning — exploring how Volvo builds an emotional connection with viewers beyond product features. This project strengthened my understanding of how consumer psychology and brand communication work together to drive perception and behavior.",
    contributions: [],
    externalHref: 'https://vlv-mehrnazbdm.my.canva.site/mehrnazbahramzadehv2',
    externalLabel: 'View Project',
  },
  {
    name: 'Professional & Personal Development Portfolio',
    description:
      "As part of my Master's programme at NHL Stenden, I developed a Professional & Personal Development Portfolio focused on skills directly relevant to the Dutch marketing job market.",
    contributions: [],
    externalHref: 'https://vlv-mehrnazbdm.my.canva.site/ppd-portfolio',
    externalLabel: 'View Portfolio',
  },
];

const testimonials = [
  {
    name: 'Amirreza Sharifi',
    role: 'Software Engineer at Booking.com',
    context: 'Amirreza worked with Mehrnaz but on different teams',
    linkedin: 'https://www.linkedin.com/in/amir-ashy/',
    quote:
      "I collaborated with Mehrnaz at Komodaa on marketing automation initiatives, where I focused on the engineering aspects and she brought strong leadership from the marketing perspective. Her ability to design smart user pathways, incorporating segmentation techniques to boost retention and interaction, really streamlined our technical setups and drove better outcomes. Mehrnaz's deep understanding of how people engage with content consistently improved our joint efforts, blending data-driven tactics. She's collaborative, forward-thinking, and excellent.",
    rotate: '-rotate-2',
  },
  {
    name: 'Negar Jafari',
    role: 'Senior Product Manager at SnapTrip',
    context: 'Negar worked with Mehrnaz on the same team',
    linkedin: 'https://www.linkedin.com/in/negarjafari/',
    quote:
      "I had the pleasure of working with Mehrnaz directly on several projects for 4 years. I was particularly impressed by her discipline and passion. She has a great attitude to build trust in her team, she has a brilliant mindset for growth plans and always finds a creative way to solve a problem.",
    rotate: 'rotate-2',
  },
  {
    name: 'Hans Van Gestel',
    role: 'MICA - Digitale Werkplaats Fryslân, NHL Stenden Hogeschool',
    context: 'Hans worked with Mehrnaz on the Paper Trails project',
    linkedin: 'https://www.linkedin.com/in/hvgestel/',
    quote: 'We @ MICA - Digitale Werkplaats loved working with you Mehrnaz!',
    rotate: '-rotate-1',
    screenshot: '/images/recommendations/hans-van-gestel-recommendation.png',
  },
];

function Initials({ name }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);
  return (
    <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
      {initials}
    </div>
  );
}

function TestimonialCloud({ items }) {
  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
      {items.map((t, i) => (
        <Reveal key={t.name} delay={i * 120} className="w-full sm:w-[calc(50%-1rem)] max-w-md">
          <div
            className={`relative bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:rotate-0 ${t.rotate}`}
          >
            <svg
              className="absolute -top-4 -left-2 w-10 h-10 text-purple-200"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
            </svg>
            <p className="text-gray-700 leading-relaxed text-[15px] mb-5 relative z-10">{t.quote}</p>
            <div className="flex items-center gap-3">
              <Initials name={t.name} />
              <div>
                {t.linkedin ? (
                  <a
                    href={t.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-gray-900 leading-tight hover:text-purple-600 transition-colors inline-flex items-center gap-1"
                  >
                    {t.name}
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                ) : (
                  <p className="font-bold text-gray-900 leading-tight">{t.name}</p>
                )}
                <p className="text-sm text-gray-500 leading-tight">{t.role}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.context}</p>
              </div>
            </div>
            {t.screenshot && (
              <div className="relative w-full mt-5 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <Image
                  src={t.screenshot}
                  alt={`LinkedIn recommendation screenshot from ${t.name}`}
                  width={800}
                  height={500}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   Page
--------------------------------------------------------- */

export default function PortfolioContent() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-6 text-center sm:text-left">
            <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-white/80 shadow-2xl shrink-0">
              <Image
                src="/images/mehrnaz.jpg"
                alt="Mehrnaz Bahramzadeh"
                width={300}
                height={300}
                className="w-full h-full object-cover scale-150"
                priority
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">Mehrnaz Bahramzadeh</h1>
              <p className="text-sm sm:text-base text-white/90 leading-snug mt-0.5">
                Growth Marketing & Marketing Automation Specialist
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1.5 text-white/80 text-xs sm:text-sm mt-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Based in the Netherlands
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2.5">
                {[
                  { label: 'CRM', href: '#komodaa-crm-automation' },
                  { label: 'Lifecycle Marketing', href: '#komodaa-crm-automation' },
                  { label: 'Lead Generation', href: '#eseminar' },
                  { label: 'Email Marketing', href: '#eseminar-crm-lead-gen' },
                  { label: 'Behavioral Segmentation', href: '#eseminar-crm-lead-gen' },
                ].map((tag) => (
                  <a
                    key={tag.label}
                    href={tag.href}
                    className="text-[11px] sm:text-xs font-medium text-white/90 bg-white/15 border border-white/25 px-2.5 py-1 rounded-full hover:bg-white/30 hover:-translate-y-0.5 transition-all"
                  >
                    {tag.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 bg-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Me
              </Link>
            </div>
          </div>

          {/* Quick jump pills */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-6">
            {caseStudies
              .filter((cs) => cs.kind === 'Case Study')
              .map((cs) => (
                <a
                  key={cs.id}
                  href={`#${cs.id}`}
                  className="text-xs sm:text-sm font-medium text-white/90 bg-white/10 hover:bg-white/25 border border-white/20 px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
                >
                  {cs.title}
                </a>
              ))}
            <a
              href="#recommendations"
              className="text-xs sm:text-sm font-medium text-white/90 bg-white/10 hover:bg-white/25 border border-white/20 px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
            >
              Recommendations
            </a>
            <a
              href="#certifications"
              className="text-xs sm:text-sm font-medium text-white/90 bg-white/10 hover:bg-white/25 border border-white/20 px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
            >
              Certifications
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Intro */}
        <Reveal>
          <section className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            <p className="text-xl text-gray-700 leading-relaxed">
              I'm a Growth Marketing professional with 6+ years of experience helping digital platforms grow,
              including a platform with 2.2M+ users where I owned customer acquisition, CRM, and lifecycle marketing
              end-to-end. I care about building marketing systems that actually work: data-driven, human-centered,
              and built to last. Currently, I'm exploring how AI workflows are reshaping marketing automation and
              actively integrating them into how I work.
            </p>
          </section>
        </Reveal>

        {/* Case studies */}
        <section id="case-studies" aria-labelledby="case-studies-heading">
          <Reveal>
            <h2 id="case-studies-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Case Studies
            </h2>
          </Reveal>
          <div className="grid gap-8">
            {caseStudies.map((cs, i) => (
              <Reveal key={cs.id} delay={i * 80}>
                <CaseStudyCard {...cs} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section id="recommendations" aria-labelledby="recommendations-heading" className="scroll-mt-24">
          <Reveal>
            <div className="text-center mb-10">
              <h2 id="recommendations-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                What Colleagues Say About Me!
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                What colleagues and collaborators from Komodaa and beyond have said about working with me.
              </p>
            </div>
          </Reveal>
          <TestimonialCloud items={testimonials} />
        </section>

        {/* Student team projects */}
        <section id="student-projects" aria-labelledby="student-projects-heading">
          <Reveal>
            <h2 id="student-projects-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Student Team Projects
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Collaborated with multidisciplinary teams on real-world marketing and content strategy projects for Dutch
              clients, transforming research into actionable marketing strategies.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {studentProjects.map((p, i) => (
              <Reveal key={p.name} delay={i * 100}>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{p.description}</p>
                <LinkPills
                  links={[
                    ...(p.website ? [{ href: p.website, label: p.website.replace(/^https?:\/\//, '') }] : []),
                    ...(p.videoHref ? [{ href: p.videoHref, label: p.videoLabel || 'Watch Video', icon: 'play' }] : []),
                  ]}
                />
                <BulletList items={p.contributions} />
                <div className="flex flex-wrap gap-3 mt-6">
                  {p.downloadHref && (
                    <a
                      href={p.downloadHref}
                      download
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full hover:shadow-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      Download {p.deliverable} (PDF)
                    </a>
                  )}
                  {p.externalHref && (
                    <a
                      href={p.externalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full hover:shadow-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {p.externalLabel || 'View Project'}
                    </a>
                  )}
                </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Gallery images={[{ src: '/images/student-projects/team-photo.jpg', alt: 'Student project team photo' }]} />
          <Gallery
            images={[
              { src: '/images/student-projects/nhl-stenden-team-collage.jpg', alt: 'NHL Stenden student team collage: studio shoot, workspace, and team gatherings' },
            ]}
          />
        </section>

        {/* Certifications */}
        <section id="certifications" aria-labelledby="certifications-heading">
          <Reveal>
            <h2 id="certifications-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Certifications
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Continuously building on my marketing and analytics skill set through ongoing certifications.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { src: '/images/certifications/hubspot-marketing-hub.png', alt: 'HubSpot Marketing Hub Software Certified' },
              { src: '/images/certifications/hubspot-email-marketing.png', alt: 'HubSpot Email Marketing Certified' },
              { src: '/images/certifications/hubspot-reporting.png', alt: 'HubSpot Reporting Certified' },
              { src: '/images/certifications/google-analytics-certification.png', alt: 'Google Analytics Certification' },
              { src: '/images/certifications/ga4-linkedin-learning.png', alt: 'Google Analytics 4 (GA4) Essential Training — LinkedIn Learning' },
            ].map((cert, i) => (
              <Reveal key={cert.src} delay={i * 80}>
                <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <Image
                    src={cert.src}
                    alt={cert.alt}
                    width={600}
                    height={450}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Community & content */}
        <section
          id="community-content"
          aria-labelledby="community-content-heading"
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100"
        >
          <h2 id="community-content-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Community & Content Creation
          </h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            I enjoy sharing knowledge, building communities, and making marketing concepts accessible through
            educational content and mentoring.
          </p>
          <SocialLinks
            links={[
              {
                label: 'Instagram',
                href: 'https://www.instagram.com/mehrnazb_dm',
                bgClass: 'bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600',
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                ),
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/@mehrnazb_dm',
                bgClass: 'bg-red-600',
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                ),
              },
              {
                label: 'TikTok',
                href: 'https://www.tiktok.com/@merybzz',
                bgClass: 'bg-black',
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                ),
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/mehrnazbahramzadeh/',
                bgClass: 'bg-[#0A66C2]',
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ),
              },
            ]}
          />
          <div className="grid sm:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Marketing Education & Consulting</h3>
              <BulletList
                items={[
                  '📈 Provided growth and digital marketing consultations to 115+ small Instagram businesses, helping them improve their online presence and marketing strategies.',
                  '🎯 Shared practical insights on content marketing, audience growth, and social media strategy.',
                ]}
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Content Creation</h3>
              <BulletList
                items={[
                  '🎥 Create educational content in Persian on YouTube, sharing insights about marketing, technology, and life in the Netherlands.',
                  '📱 Actively create and share content on Instagram to educate and engage my audience.',
                  '✍️ Enjoy transforming complex topics into simple, practical, and engaging content.',
                ]}
              />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Why I Create</h3>
            <p className="text-gray-700 leading-relaxed">
              I believe that sharing knowledge is one of the best ways to learn. Creating educational content allows
              me to continuously improve my communication skills, stay curious, and contribute to the professional
              growth of others.
            </p>
          </div>
        </section>
        
        {/* HubSpot Form (test embed) */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">HubSpot Contact Form</h2>
            <div
              className="hs-form-frame"
              data-region="eu1"
              data-form-id="ff939470-add3-4865-853b-3cc97d0ccba8"
              data-portal-id="146914493"
            ></div>
            <Script src="https://js-eu1.hsforms.net/forms/embed/146914493.js" strategy="lazyOnload" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-4 py-12 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} Mehrnaz's Blog. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
