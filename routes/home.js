const { Router } = require('express');
const router = Router();
const { auth } = require('../middleware');
const render = require('./render-helper');
const { sequelize } = require('../database/models');

function pad(n) {
  return n < 10 ? '0' + n : n;
};
// https://stackoverflow.com/a/16177227
function toLocalIsoString(date) {
  return `${
    date.getFullYear()
  }-${
    pad(date.getMonth() + 1)
  }-${
    pad(date.getDate())
  }T${
    pad(date.getHours())
  }:${
    pad(date.getMinutes())
  }`;
};

/* GET home page. */
router.get('/', auth, async function(req, res, next) {
  const { user } = req;
  const [[{ sum }]] = await sequelize.query(`
    SELECT SUM(alcohol_content)
    FROM drinks
    WHERE user_id=${user.id} AND date >= (CURRENT_DATE - integer '7');
  `);
  const totalDrinks = Number(sum).toFixed(3)
  const [[{ age: { days: daysSinceLastDry } }]] = await sequelize.query(`
    SELECT AGE(CURRENT_DATE, (
      SELECT *
      FROM generate_series('2020-04-01', CURRENT_DATE - 1, INTERVAL '1 day') AS dates
      WHERE dates NOT IN (
        SELECT DISTINCT DATE_TRUNC('day', date)
        FROM drinks
        WHERE user_id=${user.id}
      )
      ORDER BY dates DESC
      LIMIT 1
    ));
  `);
  const dateTime = toLocalIsoString(new Date());
  render(res, 'home', { dateTime, totalDrinks, daysSinceLastDry, user });
});

module.exports = router;
