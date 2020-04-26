const { Router } = require('express');
const router = Router();
const { auth } = require('../middleware');
const render = require('./render-helper');
const { Drink, sequelize } = require('../database/models');
const { STANDARD_DRINK, toLocalIsoString } = require('./utils');

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
  const [allDrinks] = await sequelize.query(`
    SELECT DATE_TRUNC('day', date)::timestamp::date, SUM(alcohol_content)
    FROM drinks
    WHERE user_id=${user.id}
    GROUP BY DATE_TRUNC('day', date)::timestamp::date
    ORDER BY DATE_TRUNC('day', date)::timestamp::date DESC;
  `);
  const drinks = allDrinks.map((drink) => {
    const count = (Number(drink.sum) / STANDARD_DRINK).toFixed(3);
    return {
      date: drink.date_trunc,
      count,
    };
  })
  const dateTime = toLocalIsoString(new Date());
  render(res, 'drinks', { drinks, dateTime, user });
});

module.exports = router;
