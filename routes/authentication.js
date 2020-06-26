const { Router } = require('express');

const passport = require('../passport');
const render = require('./util/render');
// const { User } = require('../database/models');

const router = Router();

/* GET /login */
router.get('/login', function (req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/');
  render(res, 'login');
});

/* POST /login */
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

/* GET /logout */
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

// TURN ON WHEN NEEDED
// /* GET /register */
// router.get('/register', function (req, res, next) {
//   if (req.isAuthenticated()) return res.redirect('/');
//   render(res, 'register');
// });

// /* POST /register */
// router.post('/register', async function (req, res, next) {
//   const { username, password, passwordConfirmation } = req.body;
//   if (password !== passwordConfirmation) {
//     return render(res, 'register', { errorMessage: 'Passwords must match.', username });
//   }
//   User.create({ username, password })
//     .then(function () {
//       res.redirect('/login');
//     })
//     .catch(function (error) {
//       console.error(error);
//       render(res, 'register', { errorMessage: 'Something went wrong. Please check the data and try again.', username });
//     });
// });

// /* GET /forgot */
// router.get('/forgot', (req, res, next) => {
//   render(res, 'forgot-password');
// });

// /* POST /forgot */
// router.post('/forgot', (req, res, next) => {
//   const { username } = req.body;
//   User.findOne({ where: { username } })
//     .then(function () {
//       render(res, 'reset-password', { username });
//     })
//     .catch(function () {
//       // this will then error on submit and start the process over
//       render(res, 'reset-password');
//     });
// });

// /* POST /reset */
// router.post('/reset', async (req, res, next) => {
//   const { username, password, passwordConfirmation } = req.body;
//   if (!username) return render(res, 'forgot-password', { errorMessage: 'Something went wrong. Please try again.' });
//   if (password !== passwordConfirmation) {
//     return render(res, 'reset-password', { errorMessage: 'Passwords must match.', username });
//   }
//   const user = await User.findOne({ where: { username } });
//   if (!user) return render(res, 'forgot-password', { errorMessage: 'Something went wrong. Please try again.' });
//   user
//     .update({ password })
//     .then(function () {
//       res.redirect('/login');
//     })
//     .catch(function (error) {
//       console.error(error);
//       res.redirect('/forgot-password');
//     });
// });

module.exports = router;
