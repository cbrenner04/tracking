const { Router } = require('express');

const passport = require('../passport');
const { User } = require('../database/models');
const render = require('./util/render');

const router = Router();

/* GET /register */
router.get('/register', function(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/');
  render(res, 'register');
});

/* POST /register */
router.post('/register', async function(req, res, next) {
  const { username, password, passwordConfirmation } = req.body;
  if (password !== passwordConfirmation) {
    return render(res, 'register', { errorMessage: 'Passwords must match.', username });
  }
  User.create({ username, password })
    .then(function() {
      res.redirect('/login');
    })
    .catch(function(error) {
      console.error(error);
      render(res, 'register', { errorMessage: 'Something went wrong. Please check the data and try again.', username });
    });
});

/* GET /login */
router.get('/login', function(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/');
  render(res, 'login');
});

/* POST /login */
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

/* GET /logout */
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

module.exports = router;
