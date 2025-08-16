import knex from "knex";

const knexInstance = knex({
  client: "sqlite3", // or 'better-sqlite3'
  connection: {
    filename: "./dev.sqlite3",
  },
  useNullAsDefault: true,
});

class DB {
  static async addEmail(data) {
    return knexInstance("emails").insert(data).returning("id").limit(1);
  }

  static async getEmails() {
    return knexInstance("emails").select("*").orderBy("created_at", "desc");
  }

  static async getEmail(id) {
    return await knexInstance("emails").where("id", id).limit(1);
  }
}

export default DB;
