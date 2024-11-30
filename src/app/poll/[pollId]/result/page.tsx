import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { getVotationResults } from "./actions";

export default async function ClientResultPage({
  params,
}: {
  params: Promise<{ [key: string]: string }>;
}) {
  const { pollId } = await params;

  if (!pollId) {
    throw new Error("Poll ID is required");
  }

  const votes = await getVotationResults({ pollId });

  if (!votes?.data) {
    throw new Error("Failed to fetch votation results", {
      cause: votes?.serverError,
    });
  }

  const totalVotes = votes.data.reduce((sum, { count }) => sum + count, 0);

  const getPercentage = (count: number) => {
    return Number(((count / totalVotes) * 100).toFixed(2));
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Voting Results
          </CardTitle>
        </CardHeader>

        <CardContent>
          <h2 className="mb-4 text-lg font-semibold">
            Where should we go for dinner?
          </h2>
          {votes.data.map(({ count, optionText }, idx) => (
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
      </Card>
    </div>
  );
}
