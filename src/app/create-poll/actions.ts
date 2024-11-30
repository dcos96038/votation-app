"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { actionClient } from "@/lib/safe-actions-client";
import { createClient } from "@/lib/supabase/server";

export const createPoll = actionClient
  .metadata({
    actionName: "createPoll",
  })
  .schema(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
    }),
  )
  .action(async ({ parsedInput }) => {
    const client = await createClient();

    const pollCreationResponse = await client
      .from("polls")
      .insert({
        question: parsedInput.question,
      })
      .select("id")
      .single();

    if (pollCreationResponse.error) {
      throw new Error("Failed to create poll", {
        cause: pollCreationResponse.error,
      });
    }

    const pollOptionsCreationResponse = await client.from("options").insert(
      parsedInput.options.map((option) => ({
        option_text: option,
        poll_id: pollCreationResponse.data.id,
      })),
    );

    if (pollOptionsCreationResponse.error) {
      throw new Error("Failed to create poll options", {
        cause: pollOptionsCreationResponse.error,
      });
    }

    redirect(`/poll/${pollCreationResponse.data.id}`);
  });
