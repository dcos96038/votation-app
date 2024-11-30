"use server";

import { z } from "zod";

import { actionClient } from "@/lib/safe-actions-client";
import { createClient } from "@/lib/supabase/server";

export const getVotationResults = actionClient
  .metadata({
    actionName: "getVotationResults",
  })
  .schema(
    z.object({
      pollId: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const client = await createClient();

    const votes = await client
      .from("votes")
      .select(
        `
          option_id,
          options!inner(
            option_text
          )
        `,
      )
      .eq("options.poll_id", parsedInput.pollId);

    if (votes.error) {
      throw new Error("Failed to fetch votation results", {
        cause: votes.error,
      });
    }

    const results = votes.data.reduce(
      (acc, vote) => {
        const optionId = vote.option_id;
        const optionText = vote.options?.option_text;

        if (!optionId) {
          return acc;
        }

        if (!acc[optionId]) {
          acc[optionId] = {
            optionText: optionText || "Unknown",
            count: 0,
          };
        }
        acc[optionId].count += 1;
        return acc;
      },
      {} as Record<string, { optionText: string; count: number }>,
    );

    return Object.values(results);
  });
