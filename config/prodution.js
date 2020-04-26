module.exports = {
  database: {
    dialect: 'postgres',
    logging: false,
    ssl: true,
    dialectOptions: {
      ssl: true,
      useUTC: false // for reading from database
    },
    timezone: 'America/Chicago',
  },
};
