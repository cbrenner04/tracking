const path = require('path');

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require, security/detect-non-literal-require
const envConfig = require(path.join(__dirname, env));

const config = Object.assign({
  env,
}, envConfig);

module.exports = config;
