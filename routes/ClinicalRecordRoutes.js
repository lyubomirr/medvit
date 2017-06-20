'use strict';

const express = require('express');
const router = express.Router();
const ClinicalRecord = require('../models/ClinicalRecord');
const Patient = require('../models/Patient');
const isAuthed = require('../config/isAuthed');

router.post('/:patientid', isAuthed, function (req, res) {
  var id = req.params.patientid;
  Patient
   .findOne({'_id': id})
   .populate('doctors clinical_record')
   .then((patient) => {
     patient.clinical_record.general_info = req.body.general_info;
     patient.clinical_record
        .save()
        .then(() => {
          res.redirect('back');
        })
        .catch((err) => {
          return res.send(err);
        });
   })
   .catch((err) => {
     return res.send(err);
   });
});

module.exports = router;
