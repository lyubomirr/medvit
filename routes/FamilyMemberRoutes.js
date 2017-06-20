'use strict';

const express = require('express');
const router = express.Router();
const FamilyMember = require('../models/FamilyMember');
const Patient = require('../models/Patient');
const Account = require('../models/Account');
const isAuthed = require('../config/isAuthed');

function isLogged (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

router.get('/', isAuthed, (req, res) => {
  FamilyMember
    .find(req.query)
    .then((familyMembers) => {
      return res.json(familyMembers);
    })
    .catch((err) => {
      return res.send(err);
    });
});

router.post('/:id', isLogged, (req, res) => {
  Patient
    .findById(req.params.id)
    .populate('doctors clinical_record')
    .then((patient) => {
      let newFamilyMember = new FamilyMember({
        name: req.body.name,
        age: req.body.age,
        civil_status: req.body.civil_status,
        relationship: req.body.relationship,
        education: req.body.education,
        occupation: req.body.occupation,
        income: req.body.income,
        insurance: req.body.insurance,
        patient: patient.id
      });
      newFamilyMember
            .save()
            .then(() => {
              patient.clinical_record.family_members.push(newFamilyMember.id);
              patient.clinical_record.save()
                .then(() => {
                  return res.redirect('back');
                })
                .catch((err) => {
                  return res.send(err);
                });
            })
            .catch((err) => {
              return res.send(err);
            });
    })
    .catch((err) => {
      return res.send(err);
    });
});

router.get('/:familymemberid', isAuthed, function (req, res) {
  var id = req.params.familymemberid;
  FamilyMember
    .findById(id)
    .then((familyMember) => {
      return res.json(familyMember);
    })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

router.post('/edit/:familymemberid', isAuthed, (req, res) => {
  let id = req.params.familymemberid;
  FamilyMember
    .findById(id)
    .then((familyMember) => {

      familyMember.name = req.body.name;
      familyMember.age = req.body.age;
      familyMember.civil_status = req.body.civil_status;
      familyMember.elationship = req.body.relationship;
      familyMember.education = req.body.education;
      familyMember.occupation = req.body.occupation;
      familyMember.income = req.body.income;
      familyMember.insurance = req.body.insurance;

      familyMember
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

router.get('/delete/:familymemberid', isLogged, (req, res) => {
  let id = req.params.familymemberid;
  FamilyMember
   .remove({'_id': id})
   .then(() => {
     return res.redirect('back');
   })
   .catch((err) => {
     return res.send(err);
   });
});

module.exports = router;
