import { Shield, Eye, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted mb-8">How we protect your information on the SCIE Hillwalking Rental platform.</p>
      
      <div className="space-y-6">
        {[
          { icon: Shield, title: "SCIE Community Only", desc: "This platform is accessible only to verified SCIE students and staff. Your information is never shared outside the school community." },
          { icon: Eye, title: "Limited Public Profile", desc: "Only your name, grade, house, and rental rating are visible to other users. Your email, phone number, and private messages are never made public." },
          { icon: Lock, title: "Secure Authentication", desc: "Passwords are encrypted using industry-standard bcrypt hashing. We never store or transmit plain-text passwords." },
          { icon: Shield, title: "No Third-Party Tracking", desc: "This platform does not use third-party analytics, advertising, or tracking cookies. Your activity stays within the platform." },
          { icon: Eye, title: "Message Privacy", desc: "Messages between users are private and can only be viewed by the conversation participants and platform administrators when necessary for dispute resolution." },
          { icon: Lock, title: "Data Retention", desc: "Your data is stored only as long as your account is active. Suspended accounts are archived, not deleted, to maintain rental history integrity." },
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
      <p className="text-xs text-muted mt-8 text-center">
        For questions about privacy, contact the platform administrator through the Contact page.
      </p>
    </div>
  );
}
