import DB from "../db/index.js";

export default async function emailRoutes(fastify, options) {
  fastify.get("/emails", async (request, reply) => {
    try {
      const emails = await DB.getEmails();
      reply.code(200).send(emails);
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: error.message });
    }
  });

  fastify.get("/emails/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const email = await DB.getEmail(id);
      if (email.length === 0) {
        reply.code(404).send({ error: "Email not found" });
        return;
      }
      reply.code(200).send(email.pop());
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: error.message });
    }
  });

  fastify.post("/emails/send", async (request, reply) => {
    try {
      const { to, cc, bcc, subject, body } = request.body;

      if (!to || !subject || !body) {
        reply.code(400).send({
          error: "Missing fields: to, subject, and body are required.",
        });
        return;
      }
      // Add logic to handle the email sending
      const result = await DB.addEmail({ to, cc, bcc, subject, body });
      reply.code(200).send({
        id: result.pop().id,
      });
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: error.message });
    }
  });
}
