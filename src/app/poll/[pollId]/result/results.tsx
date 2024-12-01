"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { getTotalVotes, getVotationResults } from "./actions";

interface ResultsProps {
  question: string;
  votes: { count: number; optionText: string }[];
  pollId: string;
  totalVotes: number;
}

export const Results: React.FC<ResultsProps> = ({
  question,
  votes,
  pollId,
  totalVotes,
}) => {
  const client = createClient();

  const [currentTotalVotes, setCurrentTotalVotes] = useState(totalVotes);
  const [currentVotes, setCurrentVotes] = useState(votes);
  const { execute: executeGetVotationResults } = useAction(getVotationResults, {
    onSuccess: ({ data }) => {
      if (data) {
        setCurrentVotes(data);
      }
    },
  });

  const { execute: executeGetTotalVotes } = useAction(getTotalVotes, {
    onSuccess: ({ data }) => {
      if (data) {
        setCurrentTotalVotes(data);
      }
    },
  });

  const getPercentage = (count: number) => {
    return Number(((count / currentTotalVotes) * 100).toFixed(2));
  };

  useEffect(() => {
    const channel = client
      .channel("vote:insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        () => {
          executeGetVotationResults({ pollId });
          executeGetTotalVotes({ pollId });
        },
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [client, executeGetTotalVotes, executeGetVotationResults, pollId]);

  return (
    <CardContent>
      <h2 className="mb-4 text-lg font-semibold">{question}</h2>
      {currentVotes.map(({ count, optionText }, idx) => (
        <div key={idx + optionText} className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium">{optionText}</span>
            <span className="text-sm text-muted-foreground">
              {count} votes ({getPercentage(count)}%)
            </span>
          </div>
          <Progress value={getPercentage(count)} className="h-2" />
        </div>
      ))}
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Total votes: {currentTotalVotes}
      </p>
    </CardContent>
  );
};
