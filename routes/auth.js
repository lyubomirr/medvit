'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const RateLimit = require('express-rate-limit');
const authLimiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  delayMs: 0,
  handler: function (req, res) {
    req.flash('info', 'Too many unsuccessful login attempts.');
    return res.redirect('back');
  }
});

router.post('/signin', authLimiter, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      req.flash('info', err);
      return res.redirect('back');
    }
    req.logIn(user, (err) => {
      if (err) {
        req.flash('info', err);
        return res.redirect('back');
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/');
});

module.exports = router;
