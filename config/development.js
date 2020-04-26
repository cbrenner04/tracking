module.exports = {
  database: {
    dialect: 'postgres',
    logging: console.log,
    url: 'postgresql://localhost:5432/tracking_development',
    dialectOptions: {
      useUTC: false // for reading from database
    },
    timezone: 'America/Chicago',
  },
};
