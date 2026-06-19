import {
  Users,
  CheckCircle,
  Ban,
  CreditCard,
  MapPin,
  Shield,
  Lock,
  Scale,
  Gavel,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Rules | Hillwalking Rental",
  description:
    "Platform Rules & Guidelines for the Hillwalking Gear Rental Platform. Learn about allowed items, prohibited items, safety rules, payment policies, and community guidelines.",
};

const sections = [
  {
    icon: Users,
    title: "1. Who Can Use This Platform",
    variant: "default" as const,
    content: (
      <>
        <p>
          The Hillwalking Rental Platform is open to anyone interested in
          renting outdoor and hillwalking gear. Whether you are an experienced
          hiker looking to lend equipment, or a newcomer wanting to try the
          outdoors without purchasing expensive gear, you are welcome here.
        </p>
        <p>To get started:</p>
        <ul>
          <li>Create an account with your email address or Google sign-in.</li>
          <li>Complete your profile with accurate information.</li>
          <li>Start browsing available gear or list your own items for rent.</li>
        </ul>
        <p>
          All users must be at least 13 years old. Users who provide false
          information or misuse the Platform will have their accounts
          restricted.
        </p>
      </>
    ),
  },
  {
    icon: CheckCircle,
    title: "2. Allowed Items",
    variant: "default" as const,
    content: (
      <>
        <p>
          The Platform is designed for outdoor and hillwalking equipment. You
          are welcome to list items in the following categories:
        </p>
        <ul>
          <li>
            <strong>Outdoor Gear:</strong> Hiking boots, trekking poles,
            backpacks, daypacks, dry bags, gaiters.
          </li>
          <li>
            <strong>Hillwalking Equipment:</strong> Navigation tools (compasses,
            GPS units), headlamps, multi-tools, emergency whistles,
            first-aid kits.
          </li>
          <li>
            <strong>Camping Gear:</strong> Tents, sleeping bags, sleeping pads,
            camp stoves, cookware, water filters, portable chairs, hammocks.
          </li>
          <li>
            <strong>Sports Equipment:</strong> Climbing harnesses, helmets,
            carabiners, ropes (with certification dates), crampons, ice axes.
          </li>
          <li>
            <strong>Photography Gear:</strong> Cameras, lenses, tripods, and
            accessories intended for outdoor use.
          </li>
          <li>
            <strong>Safety Equipment:</strong> Avalanche transceivers, personal
            locator beacons (PLBs), satellite messengers, emergency shelters,
            bear canisters.
          </li>
          <li>
            <strong>Clothing:</strong> Waterproof jackets and trousers,
            insulated layers, base layers, gloves, hats, buffs, gaiters.
          </li>
        </ul>
        <p>
          Items should be in safe, usable condition. If an item has known wear
          or limitations, you must clearly disclose this in the listing
          description.
        </p>
      </>
    ),
  },
  {
    icon: Ban,
    title: "3. Prohibited Items",
    variant: "danger" as const,
    content: (
      <>
        <p>
          The following items are <strong>strictly prohibited</strong> from
          being listed, offered, or exchanged on the Platform. Violations will
          result in immediate removal of the listing and may lead to account
          suspension or permanent ban.
        </p>
        <ul>
          <li>Weapons of any kind — including knives, firearms, ammunition, and replica weapons.</li>
          <li>Alcohol, tobacco products, e-cigarettes, and vaping devices.</li>
          <li>Drugs, controlled substances, medicines, supplements, and drug paraphernalia.</li>
          <li>Adult content, sexually explicit materials, or items of an adult nature.</li>
          <li>Exam papers, coursework, cheating materials, or academic dishonesty aids.</li>
          <li>Fake identification documents, counterfeit goods, and forged items.</li>
          <li>Illegal software, hacked accounts, or digital piracy materials.</li>
          <li>Explosives, fireworks, flammable liquids, and hazardous chemicals.</li>
          <li>Unsafe electronics — including devices with exposed wiring, unlabelled lithium batteries, or recalled products.</li>
          <li>Any item prohibited by applicable local, regional, or national law.</li>
        </ul>
        <p>
          This list is not exhaustive. The Platform administrators reserve the
          right to determine that an item is prohibited even if not explicitly
          listed above, when that item poses a safety risk or is inconsistent
          with the Platform&apos;s purpose.
        </p>
      </>
    ),
  },
  {
    icon: CreditCard,
    title: "4. Payments and Deposits",
    variant: "default" as const,
    content: (
      <>
        <p>
          <strong>The Platform does NOT process any payments.</strong> All
          financial arrangements are made directly between users, offline.
        </p>
        <ul>
          <li>
            Rental fees: The lender sets the price. All payment amounts, methods,
            and timing are agreed upon directly between the lender and borrower.
          </li>
          <li>
            Security deposits: If a lender requires a deposit, the amount and
            return conditions must be communicated clearly in the listing.
          </li>
          <li>
            The Platform is <strong>NOT responsible</strong> for payment
            disputes. We cannot refund money, enforce payment, or mediate
            deposit disputes. Users are encouraged to document payment
            agreements in writing (via Platform messages) before handoff.
          </li>
          <li>
            Free rentals: Users are welcome to offer items for free. This is
            encouraged as a way to build community and share resources.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: MapPin,
    title: "5. Pickup and Return Guidelines",
    variant: "default" as const,
    content: (
      <>
        <p>
          Safe and organized handoffs protect both parties. Follow these
          guidelines:
        </p>
        <ul>
          <li>
            <strong>Meet in public:</strong> Arrange pickup and return at
            public, well-lit locations. Busy cafes, campus common areas, or
            shopping center entrances are good choices.
          </li>
          <li>
            <strong>Document condition:</strong> Take clear, timestamped
            photographs of the item at both pickup and return. Photograph any
            existing damage before accepting the item.
          </li>
          <li>
            <strong>Return on time:</strong> Respect the agreed return
            deadline. If you need an extension, contact the lender before the
            due date. Late returns inconvenience other users and may affect
            your rating.
          </li>
          <li>
            <strong>Report damage immediately:</strong> If an item is damaged
            during your rental period, inform the lender right away through the
            Platform messaging system. Honest communication helps resolve
            issues quickly.
          </li>
          <li>
            <strong>Bring a friend:</strong> If meeting a user you do not know,
            consider bringing a friend along to the handoff.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Shield,
    title: "6. Safety Rules for Gear",
    variant: "default" as const,
    content: (
      <>
        <p>
          Outdoor gear must be safe and reliable. Both lenders and borrowers
          share responsibility for gear safety:
        </p>
        <ul>
          <li>
            <strong>Check all gear before use:</strong> Inspect items thoroughly
            when you receive them. Do not use any item that appears damaged,
            worn, or unsafe.
          </li>
          <li>
            <strong>Test electronics and batteries:</strong> Verify headlamps,
            GPS devices, and other electronics function correctly before heading
            out. Check battery levels and bring spares.
          </li>
          <li>
            <strong>Verify waterproof gear integrity:</strong> Check jackets,
            trousers, and tents for tears, delamination, or failed seams. Water
            resistance degrades with age and wear.
          </li>
          <li>
            <strong>Inspect trekking poles and straps:</strong> Check pole
            locking mechanisms, wrist straps, and basket attachments. A failed
            pole on steep terrain is a serious hazard.
          </li>
          <li>
            <strong>Check safety equipment certifications:</strong> Climbing
            ropes, harnesses, and helmets have limited lifespans. Verify
            manufacture dates and certifications — do not use expired safety
            equipment.
          </li>
          <li>
            <strong>Do not use damaged gear:</strong> If you discover a safety
            issue with an item, stop using it immediately and contact the
            lender.
          </li>
          <li>
            <strong>Report unsafe items:</strong> If you believe an item listed
            on the Platform is unsafe or misrepresented, report it to the
            administrators immediately.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Lock,
    title: "7. Privacy and Contact",
    variant: "default" as const,
    content: (
      <>
        <p>
          The Platform protects your privacy. These rules help keep everyone
          safe:
        </p>
        <ul>
          <li>
            <strong>Phone numbers are not publicly displayed:</strong> Your
            contact details are never shown to other users on the Platform.
          </li>
          <li>
            <strong>Communicate through Platform messaging:</strong> Use the
            in-platform messaging system for all rental-related communication.
            This creates a record in case of disputes.
          </li>
          <li>
            <strong>Do not share others&apos; personal information:</strong> Do
            not post another user&apos;s email address, phone number, social
            media accounts, or other personal details anywhere on the Platform.
          </li>
          <li>
            <strong>Be mindful of photos:</strong> Listing photos should show
            the item, not people (unless people are necessary to show how the
            item is used). Avoid including identifiable locations, license
            plates, or other personal information in listing photos.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Scale,
    title: "8. Disputes and Reports",
    variant: "default" as const,
    content: (
      <>
        <p>
          Disputes should be handled calmly and constructively:
        </p>
        <ul>
          <li>
            <strong>Step 1 — Communicate directly:</strong> Most issues are
            misunderstandings. Message the other user through the Platform and
            try to reach a fair resolution together.
          </li>
          <li>
            <strong>Step 2 — File a report:</strong> If direct communication
            fails, use the Platform&apos;s Report feature to escalate the
            issue. Include relevant details and any supporting photos or
            message screenshots.
          </li>
          <li>
            <strong>Step 3 — Admin review:</strong> Platform administrators
            will review submitted reports. Admin may contact both parties for
            additional information and will determine an appropriate course of
            action.
          </li>
          <li>
            <strong>Repeated violations:</strong> Users who repeatedly violate
            these Rules, fail to resolve disputes fairly, or engage in
            dishonest behavior will face escalating consequences, up to and
            including permanent account suspension.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Gavel,
    title: "9. Admin Moderation",
    variant: "default" as const,
    content: (
      <>
        <p>
          Platform administrators have the authority and responsibility to
          maintain a safe, fair, and functional community:
        </p>
        <ul>
          <li>
            <strong>Content moderation:</strong> Admin can review, hide, or
            remove any listing that violates these Rules or the Terms of
            Service.
          </li>
          <li>
            <strong>Account actions:</strong> Admin can temporarily suspend or
            permanently ban user accounts for violations of Platform rules,
            Terms of Service, or repeated problematic behavior.
          </li>
          <li>
            <strong>Appeals:</strong> If you believe an admin action against
            your account was made in error, you may submit an appeal by
            contacting the administrators at{" "}
            <a
              href="mailto:admin@scie.test"
              className="text-primary hover:text-primary-light underline transition-colors"
            >
              admin@scie.test
            </a>
            . Appeals are reviewed on a case-by-case basis.
          </li>
          <li>
            <strong>Discretion:</strong> Admin decisions are made in the best
            interest of the community. While guidelines are applied
            consistently, admin reserves the right to act on a case-by-case
            basis when necessary for community safety.
          </li>
        </ul>
      </>
    ),
  },
];

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Platform Rules &amp; Guidelines
        </h1>
        <p className="text-base text-muted-dark">
          Important guidelines for a safe, fair, and positive experience on the
          Hillwalking Rental Platform.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`flex gap-4 p-6 rounded-xl border transition-colors ${
              section.variant === "danger"
                ? "bg-error-light border-error/30 hover:border-error/60"
                : "bg-white border-surface-dark hover:border-primary-light"
            }`}
          >
            <section.icon
              className={`w-6 h-6 flex-shrink-0 mt-1 ${
                section.variant === "danger" ? "text-error" : "text-primary"
              }`}
            />
            <div className="min-w-0">
              <h2
                className={`font-semibold mb-3 text-lg ${
                  section.variant === "danger" ? "text-error" : "text-foreground"
                }`}
              >
                {section.title}
              </h2>
              <div className="text-sm text-muted-dark leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:pl-0.5">
                {section.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-xs text-muted mt-10 text-center leading-relaxed">
        These Rules were last updated on June 19, 2026. For questions about
        these Rules, please{" "}
        <a
          href="/contact"
          className="text-primary hover:text-primary-light underline transition-colors"
        >
          contact the administrators
        </a>
        .
      </p>
    </div>
  );
}
