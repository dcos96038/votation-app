import { CheckCircle, Users, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { FeatureCard } from "./feature-card";

export default function LandingPage() {
  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h2 className="mb-4 text-4xl font-bold tracking-tight">
        Simplify Group Decisions
      </h2>
      <p className="mb-8 max-w-[600px] text-lg text-muted-foreground">
        Create polls, vote, and get results in real-time.
      </p>
      <Button size="lg" className="mb-16" asChild>
        <Link href="/create-poll">Start Voting</Link>
      </Button>

      <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<CheckCircle className="h-6 w-6" />}
          title="Easy to Use"
          description="Create polls and start voting in seconds."
        />
        <FeatureCard
          icon={<Users className="h-6 w-6" />}
          title="Group Friendly"
          description="Invite friends with a simple link."
        />
        <FeatureCard
          icon={<Zap className="h-6 w-6" />}
          title="Real-time Results"
          description="See voting results update instantly."
        />
      </div>
    </main>
  );
}
