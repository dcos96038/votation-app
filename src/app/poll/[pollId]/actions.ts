"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { actionClient } from "@/lib/safe-actions-client";
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
      .select("*, options(*)")
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
    }),
  )
  .action(async ({ parsedInput }) => {
    const client = await createClient();

    const voteCreationResponse = await client.from("votes").insert(
      parsedInput.options.map((optionId) => ({
        option_id: optionId,
      })),
    );

    if (voteCreationResponse.error) {
      throw new Error("Failed to create vote", {
        cause: voteCreationResponse.error,
      });
    }

    redirect(`/poll/${parsedInput.pollId}/result`);
  });
