const { Router } = require('express');

const authRouter = require('./routes/authentication');
const homeRouter = require('./routes/home');
const drinksRouter = require('./routes/drinks');

const router = Router();

router.use('/', authRouter, homeRouter, drinksRouter);

module.exports = router;
