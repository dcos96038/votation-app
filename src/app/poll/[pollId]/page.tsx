"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock data for results
const mockResults = [
  { option: "Italian Restaurant", votes: 7, percentage: 35 },
  { option: "Sushi Bar", votes: 5, percentage: 25 },
  { option: "Burger Joint", votes: 6, percentage: 30 },
  { option: "Vegan Cafe", votes: 2, percentage: 10 },
];

export default function VotingPage() {
  const [selectedOption, setSelectedOption] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the vote to your backend
    console.log("Submitted vote:", selectedOption);
    // For now, we'll just set hasVoted to true to show the results
    setHasVoted(true);
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {hasVoted ? "Voting Results" : "Cast Your Vote"}
          </CardTitle>
        </CardHeader>
        {!hasVoted ? (
          <form onSubmit={handleSubmit}>
            <CardContent>
              <h2 className="mb-4 text-lg font-semibold">
                Where should we go for dinner?
              </h2>
              <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
              >
                {mockResults.map(({ option }) => (
                  <div
                    key={option}
                    className="mb-2 flex items-center space-x-2"
                  >
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                type="submit"
                disabled={!selectedOption}
              >
                Submit Vote
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent>
            <h2 className="mb-4 text-lg font-semibold">
              Where should we go for dinner?
            </h2>
            {mockResults.map(({ option, votes, percentage }) => (
              <div key={option} className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{option}</span>
                  <span className="text-muted-foreground text-sm">
                    {votes} votes ({percentage}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            ))}
            <p className="text-muted-foreground mt-4 text-center text-sm">
              Total votes:{" "}
              {mockResults.reduce((sum, { votes }) => sum + votes, 0)}
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
