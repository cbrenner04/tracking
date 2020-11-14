const { Router } = require('express');

const { auth } = require('../middleware');
const { Drink } = require('../database/models');

const render = require('./util/render');
const { standardDrinks, toLocalIsoString } = require('./util/utils');
const { allTimeDrinks, oneDayDrinks, moving7DayAvgDrinks, avgDrinks, moving30DayAvgDrinks } = require('./util/queries');

const router = Router();

/* POST drinks */
router.post('/drinks', auth, async function (req, res, next) {
  const {
    user: { id: user_id },
    body: { date, quantity, alcoholPercent },
    query: { historical },
  } = req;
  let redirectURL = '/';
  if (historical) redirectURL = '/drinks';
  const alcohol_content = Number(quantity) * (Number(alcoholPercent) / 100);
  Drink.create({
    date,
    alcohol_content,
    user_id,
  })
    .catch(function (error) {
      console.error(error);
    })
    .finally(function () {
      res.redirect(redirectURL);
    });
});

// GET drinks
router.get('/drinks', auth, async function (req, res, next) {
  const { user } = req;
  const allDrinks = await allTimeDrinks(user.id);
  const movingAvgDrinks = await moving7DayAvgDrinks(user.id);
  const movingMonthAvgDrinks = await moving30DayAvgDrinks(user.id);
  const averageDrinks = await avgDrinks(user.id);
  const drinks = allDrinks
    .map((drink) => {
      const count = standardDrinks(drink.sum);
      if (!Number(count)) return null;
      return {
        date: drink.date,
        count,
      };
    })
    .filter(Boolean);
  const dateTime = toLocalIsoString(new Date());
  const plotLayout = JSON.stringify({
    title: 'Number of drinks',
    xaxis: {
      title: 'Date',
    },
    yaxis: {
      title: 'Number of drinks',
    },
    showlegend: false,
  });
  const plotData = JSON.stringify([
    {
      x: allDrinks.map((drink) => drink.date),
      y: allDrinks.map((drink) => standardDrinks(drink.sum)),
      type: 'scatter',
      mode: 'lines',
      name: 'Drinks',
    },
    {
      x: movingAvgDrinks.map((drink) => drink.date),
      y: movingAvgDrinks.map((drink) => standardDrinks(drink.avg)),
      type: 'scatter',
      mode: 'lines',
      name: '7 Day Average',
    },
    {
      x: movingMonthAvgDrinks.map((drink) => drink.date),
      y: movingMonthAvgDrinks.map((drink) => standardDrinks(drink.avg)),
      type: 'scatter',
      mode: 'lines',
      name: '30 Day Average',
    },
    {
      x: allDrinks.map((drink) => drink.date),
      y: allDrinks.map(() => 2),
      type: 'scatter',
      mode: 'lines',
      line: {
        dash: 'dot',
        width: 4,
      },
      name: 'Goal',
    },
  ]);
  render(res, 'drinks', {
    drinks,
    dateTime,
    user,
    plotData,
    plotLayout,
    averageDrinks,
  });
});

// GET drinks/:date
router.get('/drinks/:date', auth, async function (req, res, next) {
  const { user } = req;
  const { date } = req.params;
  const returnedDrinks = await oneDayDrinks(user.id, date);
  const drinks = returnedDrinks.map((drink) => {
    const { id, date, alcohol_content: alcoholContent } = drink;
    return {
      id,
      alcoholContent,
      time: toLocalIsoString(date),
    };
  });
  render(res, 'edit-drinks', {
    date,
    drinks,
    user,
  });
});

// DELETE drinks/:date/:id
router.delete('/drinks/:date/:id', auth, async function (req, res, next) {
  const { user } = req;
  const { date, id } = req.params;
  const record = await Drink.findOne({
    where: {
      user_id: user.id,
      id,
    },
  });
  record.destroy();
  res.redirect(`/drinks/${date}`);
});

module.exports = router;
