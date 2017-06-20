'use strict';

const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');
const Patient = require('../models/Patient');
const Account = require('../models/Account');
const isAuthed = require('../config/isAuthed');

router.get('/', isAuthed, (req, res) => {
  Medication
   .find(req.query)
   .populate('requested_by')
   .then((medications) => {
     return res.json(medications);
   })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

router.post('/:id', isAuthed, (req, res) => {
  Account.findById(req.user.id)
    .populate('employee')
    .then((user) => {
      Patient
        .findById(req.params.id)
        .populate('doctors clinical_record')
        .then((patient) => {
          let newMedication = new Medication({
            name: req.body.name,
            status: req.body.status,
            prescription: req.body.prescription,
            requested_by: {
              id: user.id,
              first_name: user.employee.firstName,
              last_name: user.employee.lastName
            },
            patient: patient.id
          });
          newMedication
            .save()
            .then(() => {
              patient.clinical_record.medications.push(newMedication.id);
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

router.get('/:medicationid', isAuthed, (req, res) => {
  var id = req.params.medicationid;
  Medication
    .findById(id)
    .then((medication) => {
      return res.json(medication);
    })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

router.post('/edit/:medicationid', isAuthed, (req, res) => {
  let id = req.params.medicationid;
  Medication
    .findById(id)
    .then((medication) => {
      medication.name = req.body.name;
      medication.status = req.body.status;
      medication.prescription = req.body.prescription;
      medication
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

router.get('/delete/:medicationid', isAuthed, (req, res) => {
  let id = req.params.medicationid;
  Medication
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
