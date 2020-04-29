const { Router } = require('express');

const passport = require('../passport');
const render = require('./util/render');

const router = Router();

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
