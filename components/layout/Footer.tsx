import Link from "next/link";
import { Mountain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white/90 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Platform info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="w-6 h-6 text-accent" />
              <span className="text-lg font-bold text-white">Hillwalking Rental</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              A peer-to-peer hillwalking and outdoor gear rental platform. Borrow and lend
              hiking boots, backpacks, tents, sleeping bags, and more — by the community,
              for the community.
            </p>
            <p className="text-xs text-white/50 mt-4">
              &copy; {new Date().getFullYear()} Hillwalking Rental Platform &mdash; Peer-to-peer outdoor gear rental.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/about"
                className="text-sm text-white/70 hover:text-white transition-colors py-1"
              >
                About
              </Link>
              <Link
                href="/rules"
                className="text-sm text-white/70 hover:text-white transition-colors py-1"
              >
                Rules
              </Link>
              <Link
                href="/terms"
                className="text-sm text-white/70 hover:text-white transition-colors py-1"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-white/70 hover:text-white transition-colors py-1"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className="text-sm text-white/70 hover:text-white transition-colors py-1"
              >
                Contact
              </Link>
              <Link
                href="/marketplace"
                className="text-sm text-white/70 hover:text-white transition-colors py-1"
              >
                Marketplace
              </Link>
              <Link
                href="/hillwalking"
                className="text-sm text-white/70 hover:text-white transition-colors py-1"
              >
                Checklist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
