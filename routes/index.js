'use strict';

const express = require('express');
const router = express.Router();

const Account = require('../models/Account');
const Patient = require('../models/Patient');
const Imaging = require('../models/Imaging');
const Lab = require('../models/Lab');
const Appointment = require('../models/Appointment');
const Post = require('../models/Post');
const Hospital = require('../models/Hospital')

const isAuthed = require('../config/isAuthed');

router.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/dashboard');
  }
  return res.render('index');
});

router.get('/login', (req, res) => {
  if (req.user) {
    res.redirect('/dashboard');
  }
  return res.render('login');
});

router.get('/dashboard', isAuthed, (req, res) => {
  Account.findById(req.user.id)
    .populate('employee')
    .then((user) => {
      Patient.find({})
        .then((patients) => {
          let patientsAdmitted = 0;
          let patientsOther = 0;
          for (let i = 0; i < patients.length; i++) {
            if (patients[i].admitted) {
              patientsAdmitted++;
            } else {
              patientsOther++;
            }
          }
          Lab.find({'requested_by.id': req.user.id})
            .then((labs) => {
              let labsPending = 0;
              let labsCompleted = 0;
              for (let i = 0; i < labs.length; i++) {
                if (labs[i].result) {
                  labsCompleted++;
                } else {
                  labsPending++;
                }
              }
              Imaging.find({'requested_by.id': req.user.id})
                .then((imagings) => {
                  let imagingsPending = 0;
                  let imagingsCompleted = 0;
                  for (let i = 0; i < imagings.length; i++) {
                    if (imagings[i].result) {
                      imagingsCompleted++;
                    } else {
                      imagingsPending++;
                    }
                  }
                  Appointment.find({'examiner.id': req.user.id})
                    .then((appointments) => {
                      let appointmentsPending = 0;
                      let appointmentsCompleted = 0;
                      for (let i = 0; i < appointments.length; i++) {
                        if (appointments[i].date > Date.now()) {
                          appointmentsPending++;
                        } else {
                          appointmentsCompleted++;
                        }
                      }
                      Post
                        .find()
                        .sort({date: -1})
                        .then((posts) => {
                            Hospital
                                .findOne()
                                .then((hospital) => {
                                    return res.render('dashboard', {
                                        user: user,
                                        patientsAdmitted: patientsAdmitted,
                                        patientsOther: patientsOther,
                                        labsPending: labsPending,
                                        labsCompleted: labsCompleted,
                                        imagingsPending: imagingsPending,
                                        imagingsCompleted: imagingsCompleted,
                                        appointmentsPending: appointmentsPending,
                                        appointmentsCompleted: appointmentsCompleted,
                                        posts: posts,
                                        hospital: hospital
                                  });
                                });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
