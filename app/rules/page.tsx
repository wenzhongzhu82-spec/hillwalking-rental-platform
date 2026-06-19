import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">Platform Rules</h1>
      <p className="text-sm text-muted mb-8">Important guidelines for using the SCIE Hillwalking Gear Rental platform.</p>
      <div className="space-y-6">
        {[
          { icon: Shield, title: "SCIE Community Only", desc: "This platform is exclusively for SCIE students and staff. You must use your school email to register." },
          { icon: AlertTriangle, title: "Prohibited Items", desc: "Do not post weapons, drugs, alcohol, tobacco, adult content, exam-related materials, fireworks, or other dangerous or illegal items. Such listings will be removed and accounts suspended." },
          { icon: CheckCircle, title: "Safe Exchanges", desc: "Always meet in campus public areas for item handovers. Take photos of the item condition during pickup and return. Do not share private phone numbers or addresses." },
          { icon: Shield, title: "Pricing & Payments", desc: "Rental prices are set by the owner. The platform does not process real payments — all financial arrangements are between users. Free borrowing is encouraged among friends." },
          { icon: AlertTriangle, title: "Item Condition", desc: "Lenders must accurately describe the item condition. Borrowers should inspect items before accepting. Report any discrepancies." },
          { icon: CheckCircle, title: "Returns & Overdue", desc: "Return items on time in the same condition. If you cannot return on time, communicate with the lender. Disputes can be escalated to admin." },
          { icon: Shield, title: "Privacy Protection", desc: "The platform protects student privacy. Personal contact information is not publicly visible. Messages go through the platform." },
          { icon: AlertTriangle, title: "Admin Authority", desc: "Administrators may remove items, suspend users, and resolve disputes. Repeated violations may result in permanent bans." },
        ].map((rule, i) => (
          <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-surface-dark">
            <rule.icon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">{rule.title}</h3>
              <p className="text-sm text-muted-dark leading-relaxed">{rule.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
