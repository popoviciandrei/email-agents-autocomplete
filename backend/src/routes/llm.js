import { openai } from "@ai-sdk/openai";
import { generateObject, streamObject, generateText } from "ai";
import { z } from "zod";

export const emailTemplateSchema = z.object({
  subject: z.string(),
  body: z.string(),
  classification: z.enum(["sales", "followup"]),
});

export default async function llmRoutes(fastify, options) {
  fastify.post("/emails/suggestions", async (request, reply) => {
    try {
      const { description } = request.body;

      if (!description) {
        reply.code(400).send({ error: "Description is required" });
        return;
      }

      // put the OPENAI_API_KEY in the .env file
      const model = openai("gpt-4o-mini");

      const { object: classification } = await generateObject({
        model,
        schema: z.object({
          type: z.enum(["sales", "followup"]),
        }),
        prompt:
          `Classify if the statement is sales or followup. ` +
          `Reply only with the "sales" or "followup" string.` +
          `This is the statement: ${description}`,
      });

      const object = streamObject({
        model,
        schema: emailTemplateSchema,
        system: {
          sales:
            "Generates sales emails, tailored to the recipient business description." +
            "(Keep the email under 40 words total. So it can be read under 10 seconds," +
            "max 7-10 words/sentence). Subject must contain word 'sales' always." +
            "Respond with subject, body and classification.",
          followup:
            "Generate one polite follow-up emails (e.g., “just checking in)." +
            "Subject must contain word 'followup' always." +
            "Respond with subject, body and classification. ",
        }[classification.type],
        prompt: description,
      });

      return object.toTextStreamResponse();
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: error.message });
    }
  });
}
