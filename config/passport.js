'use strict';

const passport = require('passport');
const Account = require('../models/Account');

module.exports = function (app) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Account.findById(id, (err, user) => {
      done(err, user);
    });
  });

  require('./strategies/local.strategy')();
};
