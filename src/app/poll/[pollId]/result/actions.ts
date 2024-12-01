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

export const getPollQuestion = actionClient
  .metadata({
    actionName: "getPollQuestion",
  })
  .schema(
    z.object({
      pollId: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const client = await createClient();

    const poll = await client
      .from("polls")
      .select("question")
      .eq("id", parsedInput.pollId)
      .single();

    if (poll.error) {
      throw new Error("Failed to fetch poll question", {
        cause: poll.error,
      });
    }

    return poll.data.question;
  });

export const getTotalVotes = actionClient
  .metadata({
    actionName: "getTotalVotes",
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
      .select("visitor_id, options(*)")
      .eq("options.poll_id", parsedInput.pollId);

    if (votes.error) {
      throw new Error("Failed to fetch total votes", {
        cause: votes.error,
      });
    }

    const uniqueVotes = new Map();
    votes.data.forEach(({ visitor_id }) => {
      if (!uniqueVotes.has(visitor_id)) {
        uniqueVotes.set(visitor_id, true);
      }
    });

    return uniqueVotes.size;
  });
