const { Router } = require('express');
const router = Router();
const { auth } = require('../middleware');
const render = require('./render-helper');
const { Drink, sequelize } = require('../database/models');

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

/* POST drinks */
router.post('/drinks', auth, async function(req, res, next) {
  const { user: { id: user_id }, body: { date, quantity, alcoholPercent }, query: { historical } } = req;
  let redirectURL = '/';
  if (historical) redirectURL = '/drinks';
  const alcohol_content = Number(quantity) * (Number(alcoholPercent) / 100);
  Drink
    .create({ date, alcohol_content, user_id })
    .catch(function(error) {
      console.error(error);
    })
    .finally(function() {
      res.redirect(redirectURL);
    });
});

// GET drinks
router.get('/drinks', auth, async function(req, res, next) {
  const { user } = req;
  const [drinks] = await sequelize.query(`
    SELECT DATE_TRUNC('day', date)::timestamp::date, SUM(alcohol_content)
    FROM drinks
    WHERE user_id=${user.id}
    GROUP BY DATE_TRUNC('day', date)::timestamp::date
    ORDER BY DATE_TRUNC('day', date)::timestamp::date DESC;
  `);
  const dateTime = toLocalIsoString(new Date());
  render(res, 'drinks', { drinks, dateTime, user });
});

module.exports = router;
