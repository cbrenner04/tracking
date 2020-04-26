const { Router } = require('express');

const { auth } = require('../middleware');

const render = require('./util/render');
const { toLocalIsoString, standardDrinks } = require('./util/utils');
const { totalDrinksLast7Days, numberOfDaysSinceLastDry, allTimeDrinks } = require('./util/queries');

const router = Router();

/* GET home page. */
router.get('/', auth, async function(req, res, next) {
  const { user } = req;
  const totalLast7 = await totalDrinksLast7Days(user.id);
  const totalDrinks = standardDrinks(totalLast7);
  const daysSinceLastDry = await numberOfDaysSinceLastDry(user.id);
  const allDrinks = await allTimeDrinks(user.id);
  const { date_trunc: lastBingeDate } = allDrinks.find(({ sum }) => standardDrinks(sum) >= 5);
  const daysSinceLastBinge = Math.floor((new Date() - new Date(lastBingeDate)) / (24 * 60 * 60 * 1000))
  const dateTime = toLocalIsoString(new Date());
  render(res, 'home', { dateTime, totalDrinks, daysSinceLastDry, user, daysSinceLastBinge });
});

module.exports = router;
