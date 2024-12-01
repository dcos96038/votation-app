import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { getPollQuestion, getTotalVotes, getVotationResults } from "./actions";
import { Results } from "./results";

export default async function ClientResultPage({
  params,
}: {
  params: Promise<{ [key: string]: string }>;
}) {
  const { pollId } = await params;

  if (!pollId) {
    throw new Error("Poll ID is required");
  }

  const [question, votes, totalVotes] = await Promise.all([
    getPollQuestion({ pollId }),
    getVotationResults({ pollId }),
    getTotalVotes({ pollId }),
  ]);

  if (!votes?.data) {
    throw new Error("Failed to fetch votation results", {
      cause: votes?.serverError,
    });
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Voting Results
          </CardTitle>
        </CardHeader>

        <Results
          question={question?.data || ""}
          votes={votes.data}
          pollId={pollId}
          totalVotes={totalVotes?.data || 0}
        />
      </Card>
    </div>
  );
}
