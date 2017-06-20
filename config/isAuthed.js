'use strict';

const Account = require('../models/Account');

module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    Account
      .findById(req.user.id)
      .populate('employee patient')
      .then((user) => {
        if (user.employee) {
          return next();
        } else {
          return res.redirect('/patient/' + user.patient.id);
        }
      });
  } else {
    return res.redirect('/login');
  }
};
