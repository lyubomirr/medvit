'use strict';

const Account = require('../../models/Account');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function () {
  passport.use(new LocalStrategy(
  function (username, password, done) {
    Account.findOne({username: username}, function (err, results) {
      if (err) {
        return done(err);
      }

      if (!results) {
        return done('No such user', false, { message: 'Incorrect username.' });
      } else if (!results.validPassword(password)) {
        return done('Wrong password', false);
      } else {
        return done(null, results);
      }
    });
  }));
};
