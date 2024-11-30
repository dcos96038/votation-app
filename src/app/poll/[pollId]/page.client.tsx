"use client";

import confetti from "canvas-confetti";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getVisitorId } from "@/lib/fingerprint";

import { PollWithOptionsAndVotes } from "@/types/poll.types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LoadingIcon } from "@/components/ui/loading-icon";

import { vote } from "./actions";

export function ClientVotingPage({ poll }: { poll: PollWithOptionsAndVotes }) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [visitorId, setVisitorId] = useState<string>();
  const { execute, isExecuting } = useAction(vote, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: () => {
      toast.success("Votes submitted successfully");
      fireConfetti();
    },
  });

  const fireConfetti = () => {
    const end = Date.now() + 1 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitorId) return;

    execute({ options: selectedOptions, pollId: poll.id, visitorId });
  };

  useEffect(() => {
    getVisitorId().then(setVisitorId);
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Cast Your Vote
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <h2 className="mb-4 text-lg font-semibold">{poll.question}</h2>
            {poll.options.map((opt) => (
              <div key={opt.id} className="mb-2 flex items-center space-x-2">
                <Checkbox
                  id={opt.id}
                  checked={
                    selectedOptions.includes(opt.id) ||
                    opt.votes.some((v) => v.visitor_id === visitorId)
                  }
                  disabled={opt.votes.some((v) => v.visitor_id === visitorId)}
                  onCheckedChange={() => handleOptionToggle(opt.id)}
                />
                <Label htmlFor={opt.id}>{opt.option_text}</Label>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant={"outline"} className="w-full" asChild>
              <Link href={`/poll/${poll.id}/result`}>View Results</Link>
            </Button>
            <Button
              className="w-full"
              type="submit"
              disabled={selectedOptions.length === 0 || isExecuting}
            >
              Submit Votes {isExecuting && <LoadingIcon />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
