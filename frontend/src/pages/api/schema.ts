import { z } from "zod";

export const emailTemplateSchema = z.object({
  subject: z.string(),
  body: z.string(),
  classification: z.enum(["sales", "followup"]),
});
