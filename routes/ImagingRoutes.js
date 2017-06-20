'use strict';

const express = require('express');
const router = express.Router();
const Imaging = require('../models/Imaging');
const Patient = require('../models/Patient');
const Account = require('../models/Account');

function isAuthed (req, res, next) {
  if (req.isAuthenticated()) {
    Account.findById(req.user.id)
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
}

router.get('/pending', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('employee')
    .then((user) => {
      if (user.patient) {
        return res.redirect('/patient/' + user.patient._id);
      } else {
        if (!req.query.search_imagings) {
          var query = {};
          if (req.query.requested_by) {
            query = {
              'requested_by.id': req.query.requested_by };
          }
          Imaging
            .find(query)
            .populate('patient', 'first_name last_name id')
            .then((imaging) => {
              var filtered = imaging.filter((value) => {
                return !value.result;
              });
              return res.render('imagings-pending', {user: user, imagings: filtered});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        } else {
          Imaging
            .find({$text: {$search: req.query.search_imagings}})
            .populate('patient', 'first_name last_name id')
            .then((imaging) => {
              var filtered = imaging.filter((value) => {
                return !value.result;
              });
              return res.render('imagings-pending', {user: user, imagings: filtered});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

router.get('/completed', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('employee')
    .then((user) => {
      if (user.patient) {
        return res.redirect('/patient/' + user.patient._id);
      } else {
        if (!req.query.imagings) {
          var query = {};
          if (req.query.requested_by) {
            query = {
              'requested_by.id': req.query.requested_by };
          }
          Imaging
            .find(query)
            .populate('patient', 'first_name last_name id')
            .then((imaging) => {
              var filtered = imaging.filter((value) => {
                return value.result;
              });
              return res.render('imagings-completed', {user: user, imagings: filtered});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        } else {
          Imaging
            .find({$text: {$search: req.query.search_imagins}})
            .populate('patient', 'first_name last_name id')
            .then((imaging) => {
              var filtered = imaging.filter((value) => {
                return value.result;
              });
              return res.render('labs-completed', {user: user, imagings: filtered});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

router.get('/:imagingid', (req, res) => {
  var id = req.params.imagingid;
  Imaging
    .findById(id)
    .then((imaging) => {
      return res.json(imaging);
    })
    .catch((err) => {
      return res.send(err);
    });
});

router.post('/complete/:imagingid', isAuthed, (req, res) => {
  var id = req.params.imagingid;
  Imaging
    .findById(id)
    .then((imaging) => {
      imaging.result = req.body.result;
      imaging
        .save()
        .then(() => {
          return res.redirect('back');
        })
        .catch((err) => {
          console.log(err);
          return res.redirect('/');
        });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

router.post('/edit/:imagingid', isAuthed, (req, res) => {
  var id = req.params.imagingid;
  Imaging
    .findById(id)
    .then((imaging) => {
      imaging.result = req.body.result;
      imaging.type = req.body.type;
      imaging.notes = req.body.notes;
      imaging
        .save()
        .then(() => {
          return res.redirect('back');
        })
        .catch((err) => {
          console.log(err);
          return res.redirect('/');
        });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

router.post('/:id', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('patient employee')
    .then((user) => {
      if (user.patient) {
        return res.redirect('/patient/' + user.patient._id);
      }
      Patient
        .findById(req.params.id)
        .populate('doctors clinical_record')
        .then((patient) => {
          let newImaging = new Imaging({
            type: req.body.type,
            result: req.body.result,
            notes: req.body.notes,
            requested_by: {
              id: req.user.id,
              first_name: user.employee.firstName,
              last_name: user.employee.lastName
            },
            patient: patient.id
          });
          newImaging
            .save()
            .then(() => {
              patient.clinical_record.imagings.push(newImaging.id);
              patient.clinical_record
                .save()
                .then(() => {
                  return res.redirect('back');
                })
                .catch((err) => {
                  console.log(err);
                  return res.redirect('/');
                });
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        })
        .catch((err) => {
          console.log(err);
          return res.redirect('/');
        });
    });
});

router.get('/delete/:imagingid', isAuthed, function (req, res) {
  var id = req.params.imagingid;
  Imaging
    .remove({'_id': id})
    .then(() => {
      return res.redirect('back');
    })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

module.exports = router;
