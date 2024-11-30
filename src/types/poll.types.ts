import { Database } from "./database.types";

export type PollWithOptions = Database["public"]["Tables"]["polls"]["Row"] & {
  options: Database["public"]["Tables"]["options"]["Row"][];
};
