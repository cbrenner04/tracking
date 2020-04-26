const { Router } = require('express');

const { auth } = require('../middleware');
const { Drink } = require('../database/models');

const render = require('./util/render');
const { standardDrinks, toLocalIsoString } = require('./util/utils');
const { allTimeDrinks } = require('./util/queries');

const router = Router();

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
  const allDrinks = await allTimeDrinks(user.id);
  const drinks = allDrinks.map((drink) => {
    const count = standardDrinks(drink.sum);
    return {
      date: drink.date_trunc,
      count,
    };
  })
  const dateTime = toLocalIsoString(new Date());
  render(res, 'drinks', { drinks, dateTime, user });
});

module.exports = router;
