import {
  FileText,
  UserCheck,
  Shield,
  ListPlus,
  Ban,
  CreditCard,
  MapPin,
  MessageSquareWarning,
  Scale,
  Gavel,
  AlertTriangle,
  RefreshCw,
  Mail,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Hillwalking Rental",
  description:
    "Terms of Service for the Hillwalking Gear Rental Platform. Read about user eligibility, listing rules, transactions, disputes, and platform policies.",
};

const sections = [
  {
    icon: FileText,
    title: "1. Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing or using the Hillwalking Rental Platform (&ldquo;the
          Platform&rdquo;), you agree to be bound by these Terms of Service
          (&ldquo;Terms&rdquo;). If you do not agree to these Terms, you must
          not use the Platform.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you
          (&ldquo;User,&rdquo; &ldquo;you&rdquo;) and the Platform
          administrators. Your use of the Platform is also governed by our
          Privacy Policy and Platform Rules, which are incorporated into these
          Terms by reference.
        </p>
      </>
    ),
  },
  {
    icon: UserCheck,
    title: "2. Eligibility",
    content: (
      <>
        <p>
          You must be at least 13 years of age to create an account and use the
          Platform. If you are under 18, you represent that you have obtained
          consent from a parent or legal guardian.
        </p>
        <p>
          You must provide accurate, current, and complete information during
          the registration process and keep your account information up to date.
          Accounts created with false or misleading information may be suspended
          or terminated.
        </p>
      </>
    ),
  },
  {
    icon: Shield,
    title: "3. User Accounts",
    content: (
      <>
        <p>
          Each user is permitted to maintain only one account. You are
          responsible for safeguarding your account credentials and for all
          activity that occurs under your account.
        </p>
        <p>
          You must notify the Platform administrators immediately if you suspect
          any unauthorized use of your account or any other breach of security.
          The Platform is not liable for any loss or damage arising from your
          failure to protect your login credentials.
        </p>
      </>
    ),
  },
  {
    icon: ListPlus,
    title: "4. Listing Items",
    content: (
      <>
        <p>
          Users may list outdoor and hillwalking gear for rent on the Platform.
          All listings must:
        </p>
        <ul>
          <li>
            Accurately describe the item&apos;s condition, size, brand, and any
            defects or wear.
          </li>
          <li>
            Include clear, recent photographs that honestly represent the item.
          </li>
          <li>
            State the rental price (per day, per trip, or free) and any deposit
            requirements clearly.
          </li>
          <li>
            Not be misleading, deceptive, or fraudulent in any way.
          </li>
        </ul>
        <p>
          Listings that violate these requirements may be removed without
          notice, and repeat offenders may have their accounts restricted.
        </p>
      </>
    ),
  },
  {
    icon: Ban,
    title: "5. Prohibited Items",
    content: (
      <>
        <p>
          The following categories of items are strictly prohibited from being
          listed, offered, or exchanged through the Platform:
        </p>
        <ul>
          <li>Weapons of any kind, including knives, firearms, and ammunition.</li>
          <li>Drugs, controlled substances, and drug paraphernalia.</li>
          <li>Alcohol, tobacco products, e-cigarettes, and vaping devices.</li>
          <li>Adult content, explicit materials, or items of a sexual nature.</li>
          <li>Exam papers, cheating materials, or academic dishonesty aids.</li>
          <li>Explosives, fireworks, and hazardous materials.</li>
          <li>Unsafe electronics, unlabelled batteries, or recalled products.</li>
          <li>Counterfeit goods, fake identification, or illegal services.</li>
          <li>Any item prohibited by applicable local, regional, or national law.</li>
        </ul>
        <p>
          The Platform reserves the right to remove any listing and suspend or
          ban any user found to be listing prohibited items.
        </p>
      </>
    ),
  },
  {
    icon: CreditCard,
    title: "6. Transactions and Payments",
    content: (
      <>
        <p>
          <strong>The Platform does NOT process payments.</strong> All rental
          fees, deposits, and any other financial transactions are arranged
          directly between users, offline, outside of the Platform.
        </p>
        <p>
          The Platform is not a payment processor, escrow service, or financial
          intermediary. The Platform does not hold deposits, guarantee payments,
          or refund any monies.
        </p>
        <p>
          Users are strongly advised to agree on clear payment and deposit terms
          before completing a handoff. The Platform bears no responsibility for
          financial disputes between users, including non-payment,
          non-return of deposits, or pricing disagreements.
        </p>
      </>
    ),
  },
  {
    icon: MapPin,
    title: "7. Pickup and Return",
    content: (
      <>
        <p>
          Users are responsible for arranging mutually agreeable pickup and
          return locations. The Platform recommends meeting in public,
          well-lit, and populated locations for all handoffs.
        </p>
        <p>
          Users are encouraged to document the condition of items at both pickup
          and return by taking timestamped photographs. This documentation helps
          resolve disputes about damage or condition.
        </p>
        <p>
          The Platform is not responsible for any incidents, injuries, or
          losses that occur during pickup or return, nor for items lost or
          damaged in transit between users.
        </p>
      </>
    ),
  },
  {
    icon: MessageSquareWarning,
    title: "8. User Conduct",
    content: (
      <>
        <p>When using the Platform, you agree not to:</p>
        <ul>
          <li>Harass, intimidate, or bully other users.</li>
          <li>Send unsolicited spam, promotional content, or chain messages.</li>
          <li>Create fake listings or engage in fraudulent activity.</li>
          <li>Use the Platform for any unlawful purpose.</li>
          <li>
            Impersonate another person or misrepresent your affiliation with any
            individual or organization.
          </li>
          <li>
            Attempt to gain unauthorized access to other user accounts or
            Platform systems.
          </li>
        </ul>
        <p>
          Violations of these conduct rules may result in immediate account
          suspension or permanent banning at the Platform&apos;s discretion.
        </p>
      </>
    ),
  },
  {
    icon: Scale,
    title: "9. Disputes Between Users",
    content: (
      <>
        <p>
          The Platform encourages users to communicate directly and in good
          faith to resolve any disputes that arise from rentals. Most issues can
          be resolved through honest discussion between reasonable parties.
        </p>
        <p>
          If direct resolution is unsuccessful, users may file a formal report
          through the Platform&apos;s reporting feature. Platform administrators
          will review the report and may facilitate communication or take action
          against accounts found to violate these Terms.
        </p>
        <p>
          The Platform&apos;s role in disputes is limited to moderation of
          Platform access — it does not and cannot adjudicate legal claims or
          award damages.
        </p>
      </>
    ),
  },
  {
    icon: Gavel,
    title: "10. Platform Rights",
    content: (
      <>
        <p>
          The Platform reserves the right, at its sole discretion, to:
        </p>
        <ul>
          <li>Remove any listing, message, or content without prior notice.</li>
          <li>Temporarily suspend or permanently ban user accounts.</li>
          <li>Restrict access to Platform features for any user.</li>
          <li>Modify or discontinue any aspect of the Platform.</li>
        </ul>
        <p>
          The Platform may exercise these rights for any reason, including but
          not limited to violations of these Terms, the Platform Rules, or
          applicable law, or to protect the safety and integrity of the
          community.
        </p>
      </>
    ),
  },
  {
    icon: AlertTriangle,
    title: "11. Limitation of Liability",
    content: (
      <>
        <p>
          The Hillwalking Rental Platform is a venue that connects users. It
          operates on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
          basis, without warranties of any kind, either express or implied.
        </p>
        <p>
          To the fullest extent permitted by applicable law, the Platform, its
          administrators, and its affiliates shall not be liable for:
        </p>
        <ul>
          <li>
            The quality, safety, legality, or accuracy of any item listing.
          </li>
          <li>
            The conduct of any user, including harmful, fraudulent, or
            negligent behavior.
          </li>
          <li>
            The outcome of any transaction, including non-delivery, damage,
            loss, or injury.
          </li>
          <li>
            Any indirect, incidental, special, consequential, or punitive
            damages arising from your use of the Platform.
          </li>
        </ul>
        <p>
          You use the Platform at your own risk and are solely responsible for
          exercising due diligence before entering into any rental arrangement
          with another user.
        </p>
      </>
    ),
  },
  {
    icon: RefreshCw,
    title: "12. Changes to These Terms",
    content: (
      <>
        <p>
          The Platform may update or modify these Terms from time to time. When
          material changes are made, users will be notified through the Platform
          or via the email address associated with their account.
        </p>
        <p>
          Your continued use of the Platform after any modifications to these
          Terms constitutes your acceptance of the revised Terms. If you do not
          agree to the changes, you must stop using the Platform and may request
          account deletion.
        </p>
        <p>
          It is your responsibility to review these Terms periodically for
          updates. The date of the last revision will be noted at the bottom of
          this page.
        </p>
      </>
    ),
  },
  {
    icon: Mail,
    title: "13. Contact Information",
    content: (
      <>
        <p>
          For questions about these Terms of Service, or to report a violation,
          please contact the Platform administrators:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:admin@scie.test"
            className="text-primary hover:text-primary-light underline transition-colors"
          >
            admin@scie.test
          </a>
        </p>
        <p>
          <strong>In-Platform:</strong>{" "}
          <a
            href="/contact"
            className="text-primary hover:text-primary-light underline transition-colors"
          >
            Contact Page
          </a>
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Terms of Service
        </h1>
        <p className="text-base text-muted-dark">
          Please read these Terms carefully before using the Hillwalking Rental
          Platform.
        </p>
        <p className="text-sm text-muted mt-1">
          Last updated: June 19, 2026
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {sections.map((section) => (
          <div
            key={section.title}
            className="flex gap-4 p-6 bg-white rounded-xl border border-surface-dark hover:border-primary-light transition-colors"
          >
            <section.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="min-w-0">
              <h2 className="font-semibold text-foreground mb-3 text-lg">
                {section.title}
              </h2>
              <div className="text-sm text-muted-dark leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:pl-0.5">
                {section.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-muted mt-10 text-center leading-relaxed">
        These Terms of Service were last revised on June 19, 2026. If you have
        questions about any part of these Terms, please{" "}
        <a
          href="/contact"
          className="text-primary hover:text-primary-light underline transition-colors"
        >
          contact us
        </a>
        .
      </p>
    </div>
  );
}
