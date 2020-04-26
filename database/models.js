const Sequelize = require('sequelize');

const { database } = require('../config');

const devDatabaseURL = 'postgresql://localhost:5432/tracking_development';
const sequelize = new Sequelize(process.env.DATABASE_URL || devDatabaseURL, database);

const models = {
  User: sequelize.import('../models/user'),
  Drink: sequelize.import('../models/drink'),
};

Object.keys(models).forEach((key) => {
  const model = models[String(key)];
  if ('associate' in model) model.associate(models);
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
