import { Mountain } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <Mountain className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground">About SCIE Hillwalking Rental</h1>
        <p className="text-sm text-muted mt-2">The official gear rental platform for SCIE students</p>
      </div>
      <div className="prose prose-sm max-w-none space-y-4 text-muted-dark">
        <p>SCIE Hillwalking Gear Rental & Exchange is a student-run platform designed to make outdoor adventures more accessible to everyone in the SCIE community.</p>
        <p>Many students need hillwalking gear for school activities, club trips, or personal adventures — but purchasing expensive equipment for occasional use isn&apos;t practical. This platform lets students share gear, save money, and build a more sustainable community.</p>
        <h2 className="text-lg font-semibold text-foreground">How It Works</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Browse gear posted by SCIE students</li>
          <li>Contact lenders through the platform</li>
          <li>Arrange pickup on campus</li>
          <li>Return and leave reviews</li>
        </ul>
        <h2 className="text-lg font-semibold text-foreground">For the SCIE Community</h2>
        <p>This platform is built by SCIE students, for SCIE students. It operates on trust, transparency, and mutual respect. All users are verified through school email, and admins moderate content to ensure safety.</p>
      </div>
    </div>
  );
}
