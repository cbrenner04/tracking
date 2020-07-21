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

const allDrinksQuery = `
  SELECT x.date, COALESCE(SUM(d.alcohol_content), 0) as sum
  FROM (
    SELECT generate_series(min(date), CURRENT_DATE, '1d')::date AS date
    FROM drinks
  ) x
  LEFT JOIN (
    SELECT DATE_TRUNC('day', timezone('america/chicago', date))::date AS date, alcohol_content, user_id
    FROM drinks
    WHERE user_id = :userId
  ) d USING (date)
  GROUP BY x.date
  ORDER BY x.date DESC
`;

async function allTimeDrinks(userId) {
  const [allDrinks] = await sequelize.query(allDrinksQuery, {
    replacements: {
      userId,
    },
  });
  return allDrinks;
}

async function moving7DayAvgDrinks(userId) {
  const [moving7DayAvg] = await sequelize.query(`
    SELECT
      allDrinks.date,
      AVG(allDrinks.sum)
      OVER(ORDER BY allDrinks.date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
    FROM (${allDrinksQuery}) AS allDrinks;
  `, {
    replacements: {
      userId,
    },
  });
  return moving7DayAvg;
}

async function avgDrinks(userId) {
  const [[{ avg }]] = await sequelize.query(`
    SELECT ((SUM(alcohol_content) / 0.6) / (CURRENT_DATE - min(date)::date)) AS avg
    FROM drinks
    WHERE user_id = :userId;
  `, {
    replacements: {
      userId,
    },
  });
  return avg;
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
  moving7DayAvgDrinks,
  avgDrinks
}
