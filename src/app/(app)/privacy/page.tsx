import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your data.`,
};

// NOTE: starting template, not legal advice — have it reviewed before launch.
const LEGAL_ENTITY = "Zorro"; // TODO: your registered company / sole-trader name
const CONTACT_EMAIL = "support@zorro.gg"; // TODO: your real support / privacy address
const EFFECTIVE_DATE = "June 8, 2026";

export default function PrivacyPage() {
  return (
    <div className="relative z-[1] mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {EFFECTIVE_DATE}
      </p>

      <div className="mt-10 space-y-10 leading-relaxed text-muted-foreground [&_a]:text-brand [&_a:hover]:underline [&_strong]:text-foreground">
        <Section title="1. Introduction">
          <p>
            This Privacy Policy explains how {LEGAL_ENTITY} (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;) collects, uses, and protects your personal data
            when you use {siteConfig.name} (the &ldquo;Service&rdquo;). We act as
            the data controller for that data. If you have questions, contact us
            at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </Section>

        <Section title="2. Data we collect">
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Account data</strong> — your email address and
              authentication details when you sign up or log in. If you sign in
              with a third-party provider, we receive basic profile information
              from that provider.
            </li>
            <li>
              <strong>Subscription &amp; billing data</strong> — your plan,
              subscription status, and renewal dates. Payments are processed by
              Stripe; we receive confirmation and limited details (such as the
              last digits / card brand), but{" "}
              <strong>we never see or store your full card number</strong>.
            </li>
            <li>
              <strong>Usage data</strong> — records related to your account,
              such as download events, needed to deliver and secure the Service.
            </li>
            <li>
              <strong>Technical data</strong> — information sent automatically
              by your device or browser, such as IP address and basic logs, used
              for security and to operate the Service.
            </li>
          </ul>
        </Section>

        <Section title="3. How we use your data">
          <ul className="ml-5 list-disc space-y-1.5">
            <li>to create and manage your account;</li>
            <li>
              to provide the Service, including gating downloads behind an active
              subscription and delivering updates;
            </li>
            <li>to process payments and manage subscriptions and renewals;</li>
            <li>
              to secure the Service, prevent abuse, and troubleshoot problems;
            </li>
            <li>to comply with our legal obligations.</li>
          </ul>
        </Section>

        <Section title="4. Legal bases for processing">
          <p>
            Where the GDPR applies, we rely on: <strong>contract</strong> (to
            provide the Service you sign up for), <strong>legitimate interests</strong>{" "}
            (to secure and improve the Service), <strong>consent</strong> (where
            we ask for it), and <strong>legal obligation</strong> (e.g. to keep
            records required by law).
          </p>
        </Section>

        <Section title="5. Service providers we share data with">
          <p>
            We do not sell your personal data. We share it only with the
            processors that help us run the Service, under appropriate
            agreements:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Supabase</strong> — authentication, database, and file
              storage.
            </li>
            <li>
              <strong>Stripe</strong> — payment processing and subscription
              management.
            </li>
            <li>
              <strong>Our hosting provider</strong> — to serve the website and
              application.
            </li>
          </ul>
          <p>
            We may also disclose data where required by law or to protect our
            rights.
          </p>
        </Section>

        <Section title="6. Cookies">
          <p>
            We use cookies that are strictly necessary to keep you signed in and
            to operate the Service securely. We do not use them to track you
            across other websites.
          </p>
        </Section>

        <Section title="7. Data retention">
          <p>
            We keep your data for as long as your account is active and as
            needed to provide the Service. After you delete your account, we
            remove or anonymise your data within a reasonable period, except
            where we must retain certain records (for example, billing records)
            to meet legal obligations.
          </p>
        </Section>

        <Section title="8. Your rights">
          <p>
            Depending on where you live, you may have the right to access,
            correct, delete, or export your data, to object to or restrict
            certain processing, and to withdraw consent. To exercise these
            rights, contact{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You also
            have the right to lodge a complaint with your local data protection
            authority.
          </p>
        </Section>

        <Section title="9. Security">
          <p>
            We take reasonable technical and organisational measures to protect
            your data. No method of transmission or storage is completely
            secure, so we cannot guarantee absolute security, but we work to
            keep your data safe.
          </p>
        </Section>

        <Section title="10. International transfers">
          <p>
            Our providers may process data in countries outside your own. Where
            data is transferred internationally, we rely on appropriate
            safeguards (such as the European Commission&apos;s standard
            contractual clauses) where required.
          </p>
        </Section>

        <Section title="11. Children">
          <p>
            The Service is not directed to children under the age described in
            our <Link href="/terms">Terms of Service</Link>, and we do not
            knowingly collect their data. If you believe a child has provided us
            data, contact us and we will remove it.
          </p>
        </Section>

        <Section title="12. Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time. When we make
            material changes, we will update the date above and, where
            appropriate, notify you.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            For any privacy questions or requests, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
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
