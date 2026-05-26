import { z } from "zod";

export const PayoutsListInputSchema = z.object({}).strict();
export type PayoutsListInput = z.infer<typeof PayoutsListInputSchema>;
