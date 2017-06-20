'use strict';

const express = require('express');
const router = express.Router();
const Lab = require('../models/Lab');
const Patient = require('../models/Patient');
const Account = require('../models/Account');
const isAuthed = require('../config/isAuthed');

router.get('/pending', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('employee')
    .then((user) => {
      if (user.patient) {
        return res.redirect('/patient/' + user.patient._id);
      } else {
        if (!req.query.search_labs) {
          var query = {};
          if (req.query.requested_by) {
            query = {
              'requested_by.id': req.query.requested_by };
          }
          Lab
            .find(query)
            .populate('patient', 'first_name last_name id')
            .then((labs) => {
              var filtered = labs.filter((value) => {
                return !value.result;
              });
              return res.render('labs', {user: user, labs: filtered});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        } else {
          Lab
            .find({$text: {$search: req.query.search_labs}})
            .populate('patient', 'first_name last_name id')
            .then((labs) => {
              var filtered = labs.filter((value) => {
                return !value.result;
              });
              return res.render('labs', {user: user, labs: filtered});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        }
      }
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
        if (!req.query.search_labs) {
          var query = {};
          if (req.query.requested_by) {
            query = {
              'requested_by.id': req.query.requested_by };
          }
          Lab
                .find(query)
                .populate('patient', 'first_name last_name id')
                .then((labs) => {
                  var filtered = labs.filter((value) => {
                    return value.result;
                  });
                  return res.render('labs-completed', {user: user, labs: filtered});
                })
                .catch((err) => {
                  console.log(err);
                  return res.redirect('/');
                });
        } else {
          Lab
          .find({$text: {$search: req.query.search_labs}})
          .populate('patient', 'first_name last_name id')
          .then((labs) => {
            var filtered = labs.filter((value) => {
              return value.result;
            });
            return res.render('labs-completed', {user: user, labs: filtered});
          })
          .catch((err) => {
            console.log(err);
            return res.redirect('/');
          });
        }
      }
    });
});

router.post('/:id', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('patient employee')
    .then((user) => {
      Patient
        .findById(req.params.id)
        .populate('doctors clinical_record')
        .then((patient) => {
          let newLab = new Lab({
            lab_type: req.body.type,
            status: req.body.status,
            result: req.body.result,
            notes: req.body.notes,
            requested_by: {
              id: req.user.id,
              first_name: user.employee.firstName,
              last_name: user.employee.lastName
            },
            patient: patient.id
          });
          newLab
            .save()
            .then(() => {
              patient.clinical_record.labs.push(newLab.id);
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

router.post('/complete/:labid', isAuthed, (req, res) => {
  var id = req.params.labid;
  Lab
   .findById(id)
   .then((lab) => {
     lab.result = req.body.result;
     lab
      .save()
      .then(() => {
        return res.redirect('back');
      })
      .catch((err) => {
        console.log(err);
        return res.redirect('/');
      });
   });
});

router.get('/:labid', isAuthed, (req, res) => {
  var id = req.params.labid;
  Lab
   .findById(id)
   .then((lab) => {
     return res.json(lab);
   })
   .catch((err) => {
     return res.send(err);
   });
});

router.post('/edit/:labid', isAuthed, (req, res) => {
  let id = req.params.labid;
  Lab
    .findById(id)
    .then((lab) => {
      lab.result = req.body.result;
      lab.lab_type = req.body.type;
      lab.notes = req.body.notes;
      lab.status = req.body.status;
      lab
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

router.get('/delete/:labid', isAuthed, (req, res) => {
  let id = req.params.labid;
  Lab
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
