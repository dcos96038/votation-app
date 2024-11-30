import { getPollById } from "./actions";
import { ClientVotingPage } from "./page.client";

export default async function VotingPage({
  params,
}: {
  params: Promise<{ [key: string]: string }>;
}) {
  const { pollId } = await params;

  if (!pollId) {
    throw new Error("Poll ID is required");
  }

  const poll = await getPollById({ id: pollId });

  if (!poll?.data) {
    throw new Error("Poll not found");
  }

  return <ClientVotingPage poll={poll.data} />;
}
