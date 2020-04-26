// sequelize cli doesn't like my config files, this is workaround for now
// this is only needed when using the sequelize cli
const { env, database } = require('./index');

module.exports = { [env]: database };
