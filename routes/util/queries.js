const { sequelize } = require('../../database/models');

async function totalDrinksLast7Days(userId) {
  const [[{ sum }]] = await sequelize.query(`
    SELECT SUM(alcohol_content)
    FROM drinks
    WHERE user_id = :userId AND date >= (CURRENT_DATE - 7);
  `, {
    replacements: {
      userId,
    },
  });
  return sum;
}

async function numberOfDaysSinceLastDry(userId) {
  const [[{ age: { days } }]] = await sequelize.query(`
    SELECT AGE(CURRENT_DATE, (
      SELECT *
      FROM generate_series('2020-04-01', CURRENT_DATE - 1, INTERVAL '1 day') AS dates
      WHERE dates NOT IN (
        SELECT DISTINCT DATE_TRUNC('day', date)
        FROM drinks
        WHERE user_id = :userId
      )
      ORDER BY dates DESC
      LIMIT 1
    ));
  `, {
    replacements: {
      userId,
    },
  });
  return days;
}

async function allTimeDrinks(userId) {
  const [allDrinks] = await sequelize.query(`
    SELECT DATE_TRUNC('day', date)::timestamp::date, SUM(alcohol_content)
    FROM drinks
    WHERE user_id = :userId
    GROUP BY DATE_TRUNC('day', date)::timestamp::date
    ORDER BY DATE_TRUNC('day', date)::timestamp::date DESC;
  `, {
    replacements: {
      userId,
    },
  });
  return allDrinks;
}

async function todaysDrinkTotal(userId) {
  const [[{ sum }]] = await sequelize.query(`
    SELECT SUM(alcohol_content)
    FROM drinks
    WHERE user_id = :userId AND date >= CURRENT_DATE;
  `, {
    replacements: {
      userId,
    },
  });
  return Number(sum).toFixed(3);
}

async function oneDayDrinks(userId, date) {
  const [year, month, day] = date.split('-');
  const nextDay = `${year}-${month}-${Number(day) + 1}`;
  const [result] = await sequelize.query(`
    SELECT id, date, alcohol_content
    FROM drinks
    WHERE user_id = :userId AND date BETWEEN :date AND :nextDay
  `, {
    replacements: {
      userId,
      date,
      nextDay,
    }
  });
  return result;
}

module.exports = {
  totalDrinksLast7Days,
  numberOfDaysSinceLastDry,
  allTimeDrinks,
  todaysDrinkTotal,
  oneDayDrinks,
}
