'use strict';

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Account = require('../models/Account');
const isAuthed = require('../config/isAuthed');

router.get('/pending', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('employee')
    .then((user) => {
      if (!req.query.search_appointments) {
        var query = {};
        if (req.query.requested_by) {
          query = {
            'examiner.id': req.query.requested_by };
        }

        Appointment
          .find(query)
          .populate('patient', 'first_name last_name id')
          .then((appointments) => {
            var filtered = appointments.filter((value) => {
              return value.date > Date.now();
            });

            return res.render('appointments-pending', {user: user, appointments: filtered});
          })
          .catch((err) => {
            console.log(err);
            return res.redirect('/');
          });
      } else {
        Appointment
          .find({$text: {$search: req.query.search_appointments}})
          .populate('patient', 'first_name last_name id')
          .then((appointments) => {
            var filtered = appointments.filter((value) => {
              return value.date > Date.now();
            });

            return res.render('appointments-pending', {user: user, appointments: filtered});
          })
          .catch((err) => {
            console.log(err);
            return res.redirect('/');
          });
      }
    });
});

router.get('/completed', isAuthed, (req, res) => {
  Account
      .findById(req.user.id)
      .populate('employee')
      .then((user) => {
        if (!req.query.search_appointments) {
          var query = {};
          if (req.query.requested_by) {
            query = {
              'examiner.id': req.query.requested_by };
          }

          Appointment
            .find(query)
            .populate('patient', 'first_name last_name id')
            .then((appointments) => {
              var filtered = appointments.filter((value) => {
                return value.date <= Date.now();
              });
              return res.render('appointments-completed', {user: user, appointments: filtered});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        } else {
          Appointment
            .find({$text: {$search: req.query.search_appointments}})
            .populate('patient', 'first_name last_name id')
            .then((appointments) => {
              var filtered = appointments.filter((value) => {
                return value.date > Date.now();
              });
              return res.render('appointments-completed', {user: user, appointments: filtered});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        }
      });
});

router.post('/:id', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('employee')
    .then((user) => {
      Patient
        .findById(req.params.id)
        .populate('doctors clinical_record')
        .then((patient) => {
          let newAppointment = new Appointment({
            date: req.body.date,
            examiner: {
              id: req.user.id,
              first_name: user.employee.firstName,
              last_name: user.employee.lastName
            },
            location: req.body.location,
            type: req.body.type,
            status: req.body.status,
            notes: req.body.notes,
            patient: patient.id
          });

          newAppointment
            .save()
            .then(() => {
              patient.clinical_record.appointments.push(newAppointment.id);

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

router.post('/edit/:appointmentid', isAuthed, (req, res) => {
  let id = req.params.appointmentid;

  Appointment
    .findById(id)
    .then((appointment) => {
      appointment.date = req.body.date;
      appointment.location = req.body.location;
      appointment.type = req.body.type;
      appointment.status = req.body.status;
      appointment.notes = req.body.notes;

      appointment
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

router.get('/:appointmentid', isAuthed, (req, res) => {
  var id = req.params.appointmentid;
  Appointment
    .findById(id)
    .then((appointment) => {
      return res.json(appointment);
    })
    .catch((err) => {
      return res.send(err);
    });
});

router.get('/delete/:appointmentid', isAuthed, (req, res) => {
  let id = req.params.appointmentid;
  Appointment
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
