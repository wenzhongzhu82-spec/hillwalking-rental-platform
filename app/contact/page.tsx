import { Mail, MessageSquare, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">Contact</h1>
      <p className="text-sm text-muted mb-8">Get in touch with the platform administrators.</p>
      
      <div className="space-y-6">
        {[
          { icon: Mail, title: "Admin Email", desc: "Contact the platform administrator at admin@scie.test for account issues, disputes, or platform suggestions." },
          { icon: MessageSquare, title: "In-Platform Messages", desc: "For questions about specific items or rentals, use the in-platform messaging system. Log in and contact the lender or borrower directly." },
          { icon: MapPin, title: "Campus Office", desc: "Find the Hillwalking Club advisor, Ms. Chen, at the Geography Department office during school hours for in-person assistance." },
        ].map((item, i) => (
          <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-surface-dark">
            <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-dark leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
