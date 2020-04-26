module.exports = {
  up: (queryInterface) => {
    // this is taken from node_modules/connect-pg-simple/table.sql at time of installation
    return queryInterface.sequelize.query(`
      CREATE TABLE "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      )
      WITH (OIDS=FALSE);

      ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

      CREATE INDEX "IDX_session_expire" ON "session" ("expire");
    `)
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('session');
  }
};
