const sections = [
  {
    title: 'Acceptance of terms',
    content: [
      'By accessing or using this website, placing an order, creating an account, or requesting a custom service, you agree to these Terms of Service.',
    ],
  },
  {
    title: 'Products and availability',
    content: [
      'All products are subject to availability. Because naevii offers handcrafted and small-batch jewellery, some items may be limited, updated, or discontinued without notice.',
      'We may correct product descriptions, pricing, imagery, or availability details if errors are identified.',
    ],
  },
  {
    title: 'Orders and payments',
    content: [
      'Orders are subject to acceptance and confirmation. We reserve the right to refuse, cancel, or limit any order where necessary, including in cases of suspected fraud, pricing errors, or stock issues.',
      'Payments must be successfully authorised before an order is treated as confirmed, unless stated otherwise.',
    ],
  },
  {
    title: 'Custom orders',
    content: [
      'Custom or personalised orders may require additional discussion, approval, advance payment, longer processing times, or limited cancellation and return options.',
      'Because personalised items are created specifically for you, they may not be eligible for return except where required by law or where a defect is confirmed.',
    ],
  },
  {
    title: 'Pricing',
    content: [
      'All prices displayed on the website are subject to change without prior notice. Applicable shipping fees, taxes, or additional charges may be shown at checkout where relevant.',
    ],
  },
  {
    title: 'Shipping and delivery',
    content: [
      'Estimated shipping or delivery timelines are provided for convenience and may vary based on destination, customisation, courier performance, or operational factors beyond our control.',
      'Delays caused by third-party logistics providers, public events, weather, or incorrect address details are not always fully within our control.',
    ],
  },
  {
    title: 'Returns and exchanges',
    content: [
      'Return, exchange, or replacement decisions may depend on the type of product, whether the order was customised, and the condition of the item upon review.',
      'Separate shipping, returns, or care pages may provide additional guidance and should be read together with these Terms where applicable.',
    ],
  },
  {
    title: 'Intellectual property',
    content: [
      'All website content, including branding, copy, design elements, logos, graphics, imagery, and original product presentation, belongs to naevii or is used with appropriate rights.',
      'You may not copy, reproduce, distribute, or commercially use website content without prior permission.',
    ],
  },
  {
    title: 'Acceptable use',
    content: [
      'You agree not to misuse the website, attempt unauthorised access, interfere with security or functionality, submit false information, or use the site for unlawful activity.',
    ],
  },
  {
    title: 'Limitation of liability',
    content: [
      'To the fullest extent permitted by law, naevii will not be liable for indirect, incidental, special, or consequential losses arising from use of the website, delays, service interruptions, or third-party provider issues.',
    ],
  },
  {
    title: 'Changes to these terms',
    content: [
      'We may revise these Terms of Service from time to time. Updated versions will be posted on this page with a revised effective date.',
    ],
  },
  {
    title: 'Contact',
    content: [
      'For questions regarding these Terms, please contact naevii through the contact or support details provided on the website.',
      'You may later replace this section with your formal business contact information.',
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="bg-pearl">
      <section className="section-shell py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-plum">
            Legal
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[0.96] text-dusk sm:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-dusk/68 sm:text-lg">
            These Terms of Service govern your access to and use of the naevii website,
            products, services, and ordering experience.
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
            This page is a starter set of terms and should be reviewed and customised to
            reflect your actual business operations, custom-order policy, returns process,
            shipping commitments, and jurisdiction-specific legal requirements.
          </div>
        </div>
      </section>
    </main>
  );
}