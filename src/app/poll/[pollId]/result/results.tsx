"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { getVotationResults } from "./actions";

interface ResultsProps {
  question: string;
  votes: { count: number; optionText: string }[];
  pollId: string;
}

export const Results: React.FC<ResultsProps> = ({
  question,
  votes,
  pollId,
}) => {
  const client = createClient();

  const [currentVotes, setCurrentVotes] = useState(votes);
  const { execute } = useAction(getVotationResults, {
    onSuccess: ({ data }) => {
      if (data) {
        setCurrentVotes(data);
      }
    },
  });

  const totalVotes = useMemo(
    () => currentVotes.reduce((sum, { count }) => sum + count, 0),
    [currentVotes],
  );

  const getPercentage = (count: number) => {
    return Number(((count / totalVotes) * 100).toFixed(2));
  };

  useEffect(() => {
    const channel = client
      .channel("vote:insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        () => {
          execute({ pollId });
        },
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [client, execute, pollId]);

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
        Total votes: {totalVotes}
      </p>
    </CardContent>
  );
};
