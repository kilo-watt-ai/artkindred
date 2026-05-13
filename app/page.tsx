import Script from "next/script";
import { SectionShell } from "@/components/section-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FaqAccordion } from "@/components/faq-accordion";
import { siteCopy } from "@/lib/site-copy";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: siteCopy.faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Repete Performance",
  description: siteCopy.authority.tagline,
  founder: {
    "@type": "Person",
    name: siteCopy.authority.name,
    jobTitle: "Leadership Performance Coach",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "PhD",
      about: "Industrial-Organizational Psychology"
    }
  }
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 font-[family:var(--font-heading)] text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
      {children}
    </h2>
  );
}

function PrimaryButton({
  href,
  children,
  variant = "solid"
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
}) {
  const classes =
    variant === "solid"
      ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
      : "border-2 border-white/30 text-white hover:border-white/60";

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-7 py-3.5 text-sm font-semibold transition-colors ${classes}`}
    >
      {children}
    </a>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">
      {n}
    </span>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted,
  badge
}: {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: readonly string[];
  highlighted: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-xl border-2 p-6 transition-shadow ${
        highlighted
          ? "border-[var(--color-accent)] bg-white shadow-lg"
          : "border-gray-200 bg-white"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-white">
          {badge}
        </span>
      )}
      <h4 className="text-lg font-bold text-gray-900">{name}</h4>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-900">{price}</span>
        {period && <span className="text-sm text-gray-500">{period}</span>}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{description}</p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href="#contact"
        className={`mt-6 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${
          highlighted
            ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
            : "border border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50"
        }`}
      >
        Get Started
      </a>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <SiteHeader />

      <main id="main-content">
        {/* Hero */}
        <SectionShell id="top" border={false} tone="dark">
          <div className="py-8 md:py-16">
            <h1 className="font-[family:var(--font-heading)] text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              <span className="block">{siteCopy.hero.headline[0]}</span>
              <span className="block text-[var(--color-accent)]">
                {siteCopy.hero.headline[1]}
              </span>
            </h1>
            <div className="mt-6 max-w-2xl space-y-3 text-lg leading-relaxed text-gray-300 md:text-xl">
              {siteCopy.hero.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-10">
              <PrimaryButton href={siteCopy.hero.cta.href}>
                {siteCopy.hero.cta.label}
              </PrimaryButton>
            </div>
          </div>
        </SectionShell>

        {/* Authority / Social Proof */}
        <div className="border-b border-gray-200 bg-[var(--color-accent-light)]">
          <div className="mx-auto flex w-full max-w-[1024px] flex-col items-center gap-1 px-6 py-5 text-center md:px-12">
            <p className="text-sm font-bold tracking-wide text-[var(--color-accent)] uppercase">
              {siteCopy.authority.name} &middot; {siteCopy.authority.credential}
            </p>
            <p className="text-sm text-gray-600">
              {siteCopy.authority.tagline}
            </p>
          </div>
        </div>

        {/* Coaching */}
        <SectionShell id="coaching">
          <div className="space-y-4">
            <SectionHeading>
              {siteCopy.coaching.heading.split("\n").map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </SectionHeading>
            <p className="max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {siteCopy.coaching.body}
            </p>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {/* Problem */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-900">The Problem</h3>
              <ul className="space-y-3">
                {siteCopy.coaching.problem.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-relaxed text-gray-700">
                    <svg className="mt-1 h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-900">The Solution</h3>
              <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                {siteCopy.coaching.solution}
              </p>
              <div className="mt-6 rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent-light)] p-5">
                <p className="text-sm font-semibold text-gray-900">
                  {siteCopy.authority.name} ({siteCopy.authority.credential})
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Behavioral coaching grounded in organizational psychology — not generic leadership advice.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* How It Works */}
        <SectionShell id="how-it-works" tone="muted">
          <SectionHeading>{siteCopy.howItWorks.heading}</SectionHeading>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {siteCopy.howItWorks.steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <StepNumber n={index + 1} />
                <h3 className="mt-4 text-base font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* Pricing */}
        <SectionShell id="pricing">
          <SectionHeading>{siteCopy.pricing.heading}</SectionHeading>
          <div className="grid gap-6 sm:grid-cols-3">
            {siteCopy.pricing.tiers.map((tier) => (
              <PricingCard key={tier.name} {...tier} />
            ))}
          </div>
        </SectionShell>

        {/* FAQ */}
        <SectionShell id="faq" tone="muted">
          <SectionHeading>{siteCopy.faq.heading}</SectionHeading>
          <FaqAccordion items={siteCopy.faq.items} />
        </SectionShell>

        {/* Contact / Final CTA */}
        <SectionShell id="contact" tone="dark" border={false}>
          <div className="py-8 text-center md:py-12">
            <h2 className="font-[family:var(--font-heading)] text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              {siteCopy.contact.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
              {siteCopy.contact.subtext}
            </p>
            <div className="mt-8">
              <a
                href={`mailto:${siteCopy.contact.email}`}
                className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                Get in Touch
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              or email directly: {siteCopy.contact.email}
            </p>
          </div>
        </SectionShell>
      </main>

      <SiteFooter />
    </>
  );
}
