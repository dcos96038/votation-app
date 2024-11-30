import { Database } from "./database.types";

export type PollWithOptionsAndVotes =
  Database["public"]["Tables"]["polls"]["Row"] & {
    options: (Database["public"]["Tables"]["options"]["Row"] & {
      votes: Database["public"]["Tables"]["votes"]["Row"][];
    })[];
  };
