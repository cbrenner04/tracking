module.exports = {
  database: {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      useUTC: false // for reading from database
    },
    timezone: 'America/Chicago',
    url: process.env.DATABASE_URL
  },
};
