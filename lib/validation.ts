import { z } from "zod";

export const prompSchema = z.object({
  prompt: z.string().min(4),
});
