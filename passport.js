const passport = require('passport');
const { Strategy } = require('passport-local');

const { User } = require('./database/models');

passport.use(new Strategy(
  function(username, password, done) {
    User.findOne({ where: { username } }).then(function(user) {
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, user);
    }).catch(done)
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findByPk(id).then(function(user) {
    done(null, user);
  }).catch(done);
});

module.exports = passport;
