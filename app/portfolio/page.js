// app/portfolio/page.js
'use client';

import { useState } from 'react';
import Image from 'next/image';

/* ---------------------------------------------------------
   Small building blocks
--------------------------------------------------------- */

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
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl px-4 py-4 text-center border border-blue-100">
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
  if (!items) return null;
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

function CaseStudyCard({ kind, title, subtitle, roadmap, stats, imageNote, sections }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6 sm:p-10">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-4">
          {kind}
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">{subtitle}</p>

        {roadmap && <RoadmapRow items={roadmap} />}

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {stats.map((s, i) => (
              <StatPill key={i} value={s.value} label={s.label} />
            ))}
          </div>
        )}

        {imageNote && <ImagePlaceholder label={imageNote} />}

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
    imageNote: 'Space reserved for Komodaa product & team photos',
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
        title: 'Results',
        paragraphs: ['Together with an incredible team, we achieved significant business growth:'],
        list: [
          '🚀 Grew the platform to 2M+ registered users',
          '📱 Reached 500K monthly active users (MAU)',
          '📸 Grew Instagram from 0 to 400K followers',
          '💼 Helped establish the marketing function from the ground up',
          "💰 Contributed to the company's growth that supported a strategic investment from Digikala Group",
        ],
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
    imageNote: 'Space reserved for Eseminar campaign photos',
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
        ],
      },
      {
        title: 'Tools',
        tags: ['GA4', 'Google Tag Manager', 'Looker Studio', 'Microsoft Clarity', 'Google Ads', 'Email Marketing Platforms', 'UTM Tracking', 'Excel', 'AI Tools (ChatGPT, Claude)'],
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
    id: 'paper-trails',
    kind: 'Case Study',
    title: 'Dutch Market Entry Strategy for Paper Trails',
    subtitle:
      'Developed a research-driven market entry and content strategy to help Paper Trails enter the Dutch market through customer research, strategic planning, and communication prototypes.',
    stats: [
      { value: '8', label: 'In-depth interviews' },
      { value: '691', label: 'Coded quotes analysed' },
      { value: '7', label: 'Behavioural themes identified' },
    ],
    imageNote: 'Space reserved for Paper Trails research & prototype visuals',
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
  },
  {
    name: 'Merk Fryslân',
    description: 'A place-branding project promoting Friesland as an attractive destination for international students.',
    contributions: [
      'Conducted audience research and communication analysis.',
      'Developed customer personas and audience insights.',
      'Contributed to content strategy development.',
      'Participated in experimental prototype design and content testing.',
      'Helped develop the final pitchbook and strategic recommendations.',
    ],
    deliverable: 'Pitchbook',
  },
];

const devProjects = [
  {
    name: 'Personal Blog — Public Site',
    role: 'Frontend',
    stack: ['Next.js 16', 'React 19', 'Tailwind CSS v4', 'MongoDB'],
    description:
      'The public-facing side of this blog: a home feed of posts, dynamic blog post pages, About and Contact pages, and a responsive navigation bar with scroll-to-top / scroll-to-bottom controls. Includes Google Tag Manager integration and a working contact form powered by Web3Forms.',
  },
  {
    name: 'Personal Blog — Admin Dashboard',
    role: 'Backend',
    stack: ['Next.js API Routes', 'MongoDB / Mongoose', 'Password-protected auth'],
    description:
      'The content-management side of the same project: a password-protected dashboard for creating, editing, publishing, and deleting posts, backed by REST API endpoints for the posts collection with automatic slug generation.',
  },
];

/* ---------------------------------------------------------
   Page
--------------------------------------------------------- */

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-20 sm:py-28">
          <div className="flex flex-col items-center text-center">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white/80 shadow-2xl mb-8">
              <Image
                src="/images/mehrnaz.jpg"
                alt="Mehrnaz Bahramzadeh"
                width={352}
                height={352}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">Portfolio</h1>
            <p className="text-2xl sm:text-3xl text-white font-semibold mb-4">Mehrnaz Bahramzadeh</p>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Growth Marketing & Marketing Automation Specialist
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Intro */}
        <section className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100">
          <p className="text-xl text-gray-700 leading-relaxed">
            I'm a Growth Marketing professional with 6+ years of experience driving growth for digital platforms
            through customer acquisition, CRM, lifecycle marketing, mobile app marketing, and marketing automation. I
            enjoy building scalable marketing systems and creating customer experiences that combine creativity,
            data, and technology.
          </p>
        </section>

        {/* Case studies */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Case Studies</h2>
          <div className="grid gap-8">
            {caseStudies.map((cs) => (
              <CaseStudyCard key={cs.id} {...cs} />
            ))}
          </div>
        </section>

        {/* Student team projects */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Student Team Projects</h2>
          <p className="text-gray-600 text-lg mb-8">
            Collaborated with multidisciplinary teams on real-world marketing and content strategy projects for Dutch
            clients, transforming research into actionable marketing strategies.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {studentProjects.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{p.description}</p>
                <BulletList items={p.contributions} />
                <span className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                  📄 {p.deliverable} available on request
                </span>
              </div>
            ))}
          </div>
          <ImagePlaceholder label="Space reserved for a team collaboration photo" />
        </section>

        {/* Community & content */}
        <section className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Community & Content Creation</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            I enjoy sharing knowledge, building communities, and making marketing concepts accessible through
            educational content and mentoring.
          </p>
          <div className="grid sm:grid-cols-2 gap-8">
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

        {/* Web development projects */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Web Development Projects</h2>
          <p className="text-gray-600 text-lg mb-8">
            Alongside marketing, I like building the tools I use — including this blog, a small full-stack project
            covering both the public site and its content-management backend.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {devProjects.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
                  {p.role}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{p.name}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{p.description}</p>
                <TagList items={p.stack} />
              </div>
            ))}
          </div>
        </section>
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
