const sections = [
  {
    title: 'Information we collect',
    content: [
      'When you place an order, create an account, contact us, or request a custom piece, we may collect personal information such as your name, email address, phone number, shipping address, billing details, and order information.',
      'We may also collect limited technical information such as device, browser, approximate location, and site usage data through analytics or similar tools.',
    ],
  },
  {
    title: 'How we use your information',
    content: [
      'We use your information to process orders, deliver products, respond to enquiries, provide customer support, manage custom requests, and improve the website experience.',
      'We may also use your contact details to send order updates, account-related communication, and marketing messages if you have chosen to receive them.',
    ],
  },
  {
    title: 'Payments',
    content: [
      'Payments may be processed through third-party payment partners. We do not store full card or UPI payment credentials on our own servers unless explicitly stated otherwise in a future update.',
      'Payment-related data may be handled by secure payment providers according to their own privacy and security practices.',
    ],
  },
  {
    title: 'Sharing of information',
    content: [
      'We may share relevant information with logistics partners, payment processors, website service providers, analytics providers, and other vendors only to the extent necessary to operate the business and fulfil orders.',
      'We do not sell your personal information as part of our ordinary business operations.',
    ],
  },
  {
    title: 'Cookies and analytics',
    content: [
      'Our website may use cookies or similar technologies to remember preferences, support site functionality, understand usage patterns, and improve performance.',
      'Some third-party tools may also collect limited browsing or technical information according to their own policies.',
    ],
  },
  {
    title: 'Data retention',
    content: [
      'We retain information for as long as reasonably necessary to fulfil orders, maintain records, resolve disputes, comply with legal obligations, and operate the business.',
    ],
  },
  {
    title: 'Your choices',
    content: [
      'You may contact us to request access to, correction of, or deletion of your personal information, subject to legal, operational, and security requirements.',
      'You may also opt out of promotional emails by using the unsubscribe option where available.',
    ],
  },
  {
    title: 'Children’s privacy',
    content: [
      'This website is not intended for children under the age required by applicable law to provide consent, and we do not knowingly collect personal information from children without appropriate permission.',
    ],
  },
  {
    title: 'Policy updates',
    content: [
      'We may update this Privacy Policy from time to time. Updated versions will be posted on this page with a revised effective date.',
    ],
  },
  {
    title: 'Contact',
    content: [
      'For privacy-related questions or requests, please contact naevii through the support or contact details provided on the website.',
      'You may later replace this section with your business email address, registered business details, and mailing address.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-pearl">
      <section className="section-shell py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-plum">
            Legal
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.96] text-dusk sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-dusk/68 sm:text-lg">
            This Privacy Policy explains how naevii may collect, use, store, and share
            information when you visit the website, place an order, create an account, or contact us.
          </p>
          <p className="mt-3 text-sm text-dusk/48">Effective date: 31 May 2026</p>
        </div>
      </section>

      <section className="section-shell pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl rounded-[2.4rem] border border-dusk/8 bg-white p-6 shadow-lifted sm:p-8 lg:p-10">
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-3xl text-dusk">{section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-dusk/68 sm:text-base">
                  {section.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-[1.75rem] bg-pearl px-5 py-5 text-sm leading-7 text-dusk/62">
            This page is a starter policy for a growing e-commerce brand and should be
            reviewed and customised based on your actual payment providers, analytics tools,
            shipping workflows, business registration details, and legal obligations in the
            regions where you operate.
          </div>
        </div>
      </section>
    </main>
  );
}