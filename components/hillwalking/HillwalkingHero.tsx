import { Mountain, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function HillwalkingHero() {
  return (
    <section className="relative overflow-hidden bg-primary-gradient">
      {/* Background mountains silhouette */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute bottom-0 left-0 right-0 h-64 bg-cover bg-bottom opacity-20"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1440 320\"><path fill=\"white\" d=\"M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,192C672,181,768,139,864,128C960,117,1056,139,1152,144C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\"/></svg>')",
            backgroundSize: "cover",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium mb-6 border border-white/10">
            <Mountain className="w-4 h-4 text-accent" />
            SCIE Hillwalking Gear Rental
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Gear Up for Your
            <br />
            <span className="text-accent">Next Adventure</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
            The official SCIE gear rental platform. Borrow hiking boots,
            backpacks, tents, sleeping bags, and more from fellow students.
            Affordable, sustainable, and adventure-ready.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="/marketplace">
              <Button variant="accent" size="lg">
                Browse Gear
                <ChevronDown className="w-4 h-4 rotate-270" />
              </Button>
            </Link>
            <Link href="/hillwalking">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
              >
                Hillwalking Checklist
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
            <div>
              <p className="text-2xl font-bold text-accent">500+</p>
              <p className="text-sm text-white/60">Items Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">300+</p>
              <p className="text-sm text-white/60">SCIE Students</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">50+</p>
              <p className="text-sm text-white/60">Hillwalking Trips</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wavy bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
        <svg
          viewBox="0 0 1440 40"
          className="absolute bottom-0 w-full h-full text-cream"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,20 C240,40 480,0 720,20 C960,40 1200,0 1440,20 L1440,40 L0,40 Z"
          />
        </svg>
      </div>
    </section>
  );
}
