import emailRoutes from "./emails.js";
import llmRoutes from "./llm.js";

export default async function routes(fastify, options) {
  fastify.register(emailRoutes);
  fastify.register(llmRoutes);

  fastify.get("/ping", async (request, reply) => {
    return "pong\n";
  });
}
