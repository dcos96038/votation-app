"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { getVisitorId } from "@/lib/fingerprint";

import { PollWithOptions } from "@/types/poll.types";

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

import { vote } from "./actions";

export function ClientVotingPage({ poll }: { poll: PollWithOptions }) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { execute } = useAction(vote, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: () => {
      toast.success("Votes submitted successfully");
    },
  });

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const visitorId = await getVisitorId();
    execute({ options: selectedOptions, pollId: poll.id, visitorId });
  };

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
                  checked={selectedOptions.includes(opt.id)}
                  onCheckedChange={() => handleOptionToggle(opt.id)}
                />
                <Label htmlFor={opt.id}>{opt.option_text}</Label>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              disabled={selectedOptions.length === 0}
            >
              Submit Votes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
