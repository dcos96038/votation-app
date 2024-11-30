"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { ActionError, actionClient } from "@/lib/safe-actions-client";
import { createClient } from "@/lib/supabase/server";

export const getPollById = actionClient
  .metadata({
    actionName: "getPollById",
  })
  .schema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const client = await createClient();

    const pollResponse = await client
      .from("polls")
      .select(
        `*, options(
        *, votes(*)
        )`,
      )
      .eq("id", parsedInput.id)
      .single();

    if (pollResponse.error) {
      throw new Error("Failed to fetch poll", {
        cause: pollResponse.error,
      });
    }

    return pollResponse.data;
  });

export const vote = actionClient
  .metadata({
    actionName: "vote",
  })
  .schema(
    z.object({
      options: z.array(z.string().uuid()),
      pollId: z.string().uuid(),
      visitorId: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const client = await createClient();

    const voteCreationResponse = await client.from("votes").insert(
      parsedInput.options.map((optionId) => ({
        option_id: optionId,
        visitor_id: parsedInput.visitorId,
      })),
    );

    if (voteCreationResponse.error) {
      if (voteCreationResponse.error.code === "23505") {
        throw new ActionError("You have already voted in this poll");
      }

      throw new ActionError("Failed to create vote", {
        cause: voteCreationResponse.error,
      });
    }

    redirect(`/poll/${parsedInput.pollId}/result`);
  });
