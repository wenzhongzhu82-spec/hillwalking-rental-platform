import {
  Info,
  Wrench,
  Share2,
  Cookie,
  Shield,
  Database,
  Clock,
  UserCheck,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Hillwalking Rental",
  description:
    "Privacy Policy for the Hillwalking Gear Rental Platform. Learn what data we collect, how we use it, and your rights regarding your personal information.",
};

const sections = [
  {
    icon: Info,
    title: "1. Information We Collect",
    content: (
      <>
        <p>
          When you create an account and use the Hillwalking Rental Platform,
          we collect the following categories of information:
        </p>
        <ul>
          <li>
            <strong>Account Information:</strong> Your name, email address, and
            profile details provided during registration.
          </li>
          <li>
            <strong>Profile Information:</strong> Any information you choose to
            add to your public profile, including a display name, biography, and
            profile photo.
          </li>
          <li>
            <strong>Listing Information:</strong> Details about items you list
            for rent, including descriptions, photographs, rental prices, and
            availability.
          </li>
          <li>
            <strong>Messages:</strong> The content of messages you send and
            receive through the Platform&apos;s messaging system.
          </li>
          <li>
            <strong>Order and Rental History:</strong> Records of rentals you
            have participated in, both as a lender and as a borrower.
          </li>
          <li>
            <strong>Reviews:</strong> Reviews and ratings you leave for other
            users or receive from other users.
          </li>
          <li>
            <strong>Usage Data:</strong> Aggregated, non-personal usage
            information such as pages visited, features used, and
            Platform interactions.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Wrench,
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>
          We use the information we collect for the following purposes:
        </p>
        <ul>
          <li>
            <strong>To Provide the Service:</strong> Your information is
            essential to display listings, facilitate messaging, track rentals,
            and enable the core features of the Platform.
          </li>
          <li>
            <strong>To Facilitate Connections:</strong> Your profile and listing
            information helps other users discover your items and contact you
            within the Platform.
          </li>
          <li>
            <strong>To Improve the Platform:</strong> We analyze aggregated
            usage data to identify bugs, improve performance, and develop new
            features.
          </li>
          <li>
            <strong>To Send Notifications:</strong> We may send you emails or
            in-platform notifications about rental requests, messages from other
            users, overdue reminders, and important Platform announcements.
          </li>
          <li>
            <strong>For Safety and Moderation:</strong> Admin may review
            content to enforce Platform rules, investigate reports, and protect
            the community.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Share2,
    title: "3. Information Sharing",
    content: (
      <>
        <p>
          We take data privacy seriously. Our policy on sharing your information
          is as follows:
        </p>
        <ul>
          <li>
            <strong>We do NOT sell user data.</strong> We do not sell, rent, or
            trade your personal information to any third party for any purpose,
            including advertising.
          </li>
          <li>
            <strong>Personal contact details are NOT shared.</strong> Your
            email address and phone number (if provided) are never displayed to
            other users. All communication between users occurs through the
            Platform&apos;s messaging system.
          </li>
          <li>
            <strong>Messages are private.</strong> Messages exchanged between
            users are accessible only to the conversation participants. Platform
            administrators may review message content only when necessary for
            dispute resolution or moderation of reported violations.
          </li>
          <li>
            <strong>Public profile.</strong> Only limited profile information
            (your display name and rental history/reviews) is visible to other
            authenticated users of the Platform.
          </li>
          <li>
            <strong>Legal compliance.</strong> We may disclose information if
            required to do so by law, court order, or valid legal process.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Cookie,
    title: "4. Cookies",
    content: (
      <>
        <p>
          Our use of cookies is minimal and strictly functional:
        </p>
        <ul>
          <li>
            <strong>Session Cookies:</strong> We use essential session cookies
            to keep you signed in to your account. These cookies are necessary
            for the Platform to function and are deleted when you close your
            browser or log out.
          </li>
          <li>
            <strong>No Third-Party Tracking:</strong> The Platform does not use
            third-party analytics services, advertising networks, or tracking
            cookies. Your browsing activity on the Platform is not tracked
            across other websites.
          </li>
          <li>
            <strong>Cookie Control:</strong> You can configure your browser to
            block all cookies, but doing so will prevent you from signing in and
            using the Platform.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Shield,
    title: "5. Google Authentication",
    content: (
      <>
        <p>
          If you choose to sign in using Google Sign-In (&ldquo;Sign in with
          Google&rdquo;):
        </p>
        <ul>
          <li>
            We receive from Google your name and email address. We use this
            information solely to create and authenticate your account on the
            Platform.
          </li>
          <li>
            <strong>We do NOT access</strong> your Google contacts, calendar,
            Drive files, location data, or any other Google service data.
          </li>
          <li>
            Google&apos;s use of your data when you use the Sign in with Google
            button is governed by{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-light underline transition-colors"
            >
              Google&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            You may revoke this Platform&apos;s access to your Google account at
            any time through your Google Account settings.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Database,
    title: "6. Data Storage and Security",
    content: (
      <>
        <p>
          All user data is stored on secure cloud servers with industry-standard
          security measures, including:
        </p>
        <ul>
          <li>Encryption of data in transit using TLS/HTTPS.</li>
          <li>Hashed and salted storage of account passwords (using bcrypt).</li>
          <li>Access controls limiting data access to authorized administrators.</li>
        </ul>
        <p>
          Images uploaded to listings are stored in secure cloud storage. We
          take reasonable precautions to protect your data, but no method of
          electronic storage is 100% secure. You use the Platform with
          awareness of this limitation.
        </p>
      </>
    ),
  },
  {
    icon: Clock,
    title: "7. Data Retention",
    content: (
      <>
        <p>We retain your data according to the following principles:</p>
        <ul>
          <li>
            <strong>Active Accounts:</strong> Account information and profile
            data are retained for as long as your account remains active.
          </li>
          <li>
            <strong>Messages and Orders:</strong> Message history and rental
            order records are retained for dispute resolution purposes even
            after a rental is completed. These records help protect all parties
            in the event of a later dispute.
          </li>
          <li>
            <strong>Account Deletion:</strong> You may request the deletion of
            your account and associated personal data at any time by contacting
            the Platform administrators. Upon deletion, your personal
            information will be removed from the Platform&apos;s active
            database. Some anonymized transaction records may be retained to
            preserve the integrity of rental histories involving other users.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: UserCheck,
    title: "8. Your Rights",
    content: (
      <>
        <p>
          You have the following rights regarding your personal data:
        </p>
        <ul>
          <li>
            <strong>Right to Access:</strong> You may request a copy of the
            personal data we hold about you.
          </li>
          <li>
            <strong>Right to Correction:</strong> You may update or correct
            inaccurate personal data through your account settings or by
            contacting us.
          </li>
          <li>
            <strong>Right to Deletion:</strong> You may request that your
            personal data be deleted, subject to the retention needs described
            in Section 7.
          </li>
          <li>
            <strong>Right to Withdraw Consent:</strong> You may withdraw your
            consent to our processing of your personal data at any time by
            requesting account deletion.
          </li>
          <li>
            <strong>Exercising Your Rights:</strong> To exercise any of these
            rights, please contact the Platform administrators at{" "}
            <a
              href="mailto:admin@scie.test"
              className="text-primary hover:text-primary-light underline transition-colors"
            >
              admin@scie.test
            </a>
            . We will respond to your request within a reasonable timeframe.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Baby,
    title: "9. Children&apos;s Privacy",
    content: (
      <>
        <p>
          The Platform is not intended for use by children under the age of 13.
          We do not knowingly collect personal information from children under
          13.
        </p>
        <p>
          If we become aware that a child under 13 has provided us with personal
          information without verifiable parental consent, we will take steps to
          remove that information from our systems. If you believe a child under
          13 has created an account on the Platform, please contact us
          immediately.
        </p>
      </>
    ),
  },
  {
    icon: RefreshCw,
    title: "10. Changes to This Privacy Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, the Platform&apos;s features, or applicable law.
        </p>
        <p>
          When we make material changes, we will notify users through the
          Platform or by email. The &ldquo;Last Updated&rdquo; date at the top
          of this page will be revised accordingly.
        </p>
        <p>
          Your continued use of the Platform after any changes to this Policy
          constitutes your acceptance of the revised terms.
        </p>
      </>
    ),
  },
  {
    icon: Mail,
    title: "11. Contact Us",
    content: (
      <>
        <p>
          If you have questions, concerns, or requests regarding this Privacy
          Policy or our data practices, please contact us:
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
          <strong>Contact Page:</strong>{" "}
          <a
            href="/contact"
            className="text-primary hover:text-primary-light underline transition-colors"
          >
            /contact
          </a>
        </p>
        <p className="mt-2">
          We take your privacy seriously and will make every effort to address
          your concerns promptly and transparently.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-base text-muted-dark">
          How we collect, use, and protect your personal information on the
          Hillwalking Rental Platform.
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
        This Privacy Policy was last revised on June 19, 2026. For any
        questions, please{" "}
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
