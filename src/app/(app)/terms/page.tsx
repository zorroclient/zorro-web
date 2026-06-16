import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${siteConfig.name}.`,
};

// NOTE: starting template, not legal advice — have it reviewed before launch.
// Replace the placeholders below with your registered details.
const LEGAL_ENTITY = "Zorro"; // TODO: your registered company / sole-trader name
const CONTACT_EMAIL = "support@zorro.gg"; // TODO: your real support address
const JURISDICTION = "the Netherlands"; // TODO: your governing jurisdiction
const EFFECTIVE_DATE = "June 8, 2026";

export default function TermsPage() {
  return (
    <div className="relative z-[1] mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="text-4xl font-bold sm:text-5xl">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {EFFECTIVE_DATE}
      </p>

      <div className="mt-10 space-y-10 leading-relaxed text-muted-foreground [&_a]:text-brand [&_a:hover]:underline [&_strong]:text-foreground">
        <Section title="1. Agreement to these terms">
          <p>
            These Terms of Service (the &ldquo;Terms&rdquo;) govern your access
            to and use of {siteConfig.name} — the software, website, and related
            services (together, the &ldquo;Service&rdquo;) provided by{" "}
            {LEGAL_ENTITY} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
            &ldquo;our&rdquo;). By creating an account, subscribing, or using the
            Service, you agree to these Terms. If you do not agree, do not use
            the Service.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            You must be at least 18 years old, or the age of majority in your
            jurisdiction, to purchase a subscription. If you are younger, you
            may only use the Service with the involvement and consent of a
            parent or legal guardian who agrees to be bound by these Terms. You
            are responsible for ensuring your use of the Service is lawful where
            you live.
          </p>
        </Section>

        <Section title="3. What the Service is">
          <p>
            {siteConfig.name} is a standalone software client for Minecraft,
            offered on a subscription basis. The Service includes the
            application, automatically delivered updates, and the supporting
            website and account system. We may add, change, or remove features
            at any time.
          </p>
          <p>
            {siteConfig.name} is an independent product. It is{" "}
            <strong>
              not affiliated with, endorsed by, or sponsored by Mojang Studios,
              Microsoft, or any third-party client, launcher, or server
            </strong>
            . All third-party names and trademarks belong to their respective
            owners.
          </p>
        </Section>

        <Section title="4. Your account">
          <p>
            You need an account to use most of the Service. You are responsible
            for keeping your login credentials secure and for all activity that
            occurs under your account. Tell us promptly if you believe your
            account has been compromised. You must provide accurate information
            and keep it up to date.
          </p>
        </Section>

        <Section title="5. Subscriptions, billing &amp; renewals">
          <p>
            Paid plans are billed in advance through our payment processor,
            Stripe. By subscribing, you authorise us (via Stripe) to charge your
            payment method for the plan you select.
          </p>
          <p>
            <strong>Subscriptions renew automatically</strong> at the end of
            each billing period at the then-current price, until you cancel. You
            can cancel at any time from your{" "}
            <Link href="/account">account</Link> — your access continues until
            the end of the period you have already paid for, and you are not
            charged again after cancellation. We will give reasonable notice of
            material price changes before they take effect.
          </p>
        </Section>

        <Section title="6. Refunds">
          <p>
            The Service provides immediate access to digital content. Except
            where a refund is required by applicable law, payments are
            non-refundable and cancelling only stops future renewals. If you
            believe you were charged in error, contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will
            review it in good faith.
          </p>
        </Section>

        <Section title="7. Licence &amp; acceptable use">
          <p>
            Subject to these Terms and an active subscription, we grant you a
            personal, non-exclusive, non-transferable, revocable licence to
            download and use {siteConfig.name} for your own personal use. You
            may not:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              share, resell, sublicense, rent, or distribute the Service or your
              account access;
            </li>
            <li>
              reverse engineer, decompile, or attempt to extract the source code
              except to the extent this restriction is prohibited by law;
            </li>
            <li>
              circumvent the subscription, licensing, or download-gating
              mechanisms;
            </li>
            <li>
              use the Service to harm others, or in any unlawful way, or to
              infringe anyone&apos;s rights.
            </li>
          </ul>
        </Section>

        <Section title="8. Third-party services &amp; assumption of risk">
          <p>
            You are solely responsible for how you use {siteConfig.name},
            including on any third-party game, client, or server. Using the
            Service may violate the rules or terms of those third parties and{" "}
            <strong>
              can result in penalties such as bans, suspensions, or loss of
              access
            </strong>{" "}
            imposed by them. We do not control and are not responsible for those
            outcomes, and we make no guarantee that the Service will avoid
            detection. You assume all risk associated with your use.
          </p>
        </Section>

        <Section title="9. Intellectual property">
          <p>
            The Service, including the {siteConfig.name} software, branding, and
            website, is owned by {LEGAL_ENTITY} and protected by intellectual
            property laws. These Terms do not transfer any ownership to you;
            you receive only the limited licence described above.
          </p>
        </Section>

        <Section title="10. Disclaimers">
          <p>
            The Service is provided <strong>&ldquo;as is&rdquo;</strong> and
            &ldquo;as available&rdquo;, without warranties of any kind, whether
            express or implied, including fitness for a particular purpose and
            non-infringement. We do not warrant that the Service will be
            uninterrupted, error-free, secure, or compatible with any particular
            setup.
          </p>
        </Section>

        <Section title="11. Limitation of liability">
          <p>
            To the maximum extent permitted by law, {LEGAL_ENTITY} will not be
            liable for any indirect, incidental, special, or consequential
            damages, or for any loss of data, profits, or access, arising from
            your use of (or inability to use) the Service. To the extent we are
            found liable, our total liability is limited to the amount you paid
            us in the twelve months before the event giving rise to the claim.
            Nothing in these Terms limits liability that cannot be limited by
            law.
          </p>
        </Section>

        <Section title="12. Termination">
          <p>
            You may stop using the Service and cancel your subscription at any
            time. We may suspend or terminate your access if you breach these
            Terms or use the Service in a way that creates risk or legal
            exposure. On termination, the licence granted to you ends and you
            must stop using {siteConfig.name}.
          </p>
        </Section>

        <Section title="13. Changes to these terms">
          <p>
            We may update these Terms from time to time. When we make material
            changes, we will update the date above and, where appropriate,
            notify you. Your continued use of the Service after changes take
            effect means you accept the updated Terms.
          </p>
        </Section>

        <Section title="14. Governing law">
          <p>
            These Terms are governed by the laws of {JURISDICTION}, without
            regard to its conflict-of-laws rules. The courts of {JURISDICTION}{" "}
            will have jurisdiction over any dispute, subject to any mandatory
            consumer protections that apply where you live.
          </p>
        </Section>

        <Section title="15. Contact">
          <p>
            Questions about these Terms? Reach us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-heading text-xl font-semibold text-foreground">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
