'use strict';

const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Account = require('../models/Account');
const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');
const Expense = require('../models/Expense');
const FamilyMember = require('../models/FamilyMember');
const Imaging = require('../models/Imaging');
const Lab = require('../models/Lab');
const ClinicalRecord = require('../models/ClinicalRecord');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const uploading = multer({
  dest: path.join(__dirname, '/../public/uploads/'),
  limits: {fileSize: 10000000, files: 1}
});
const isAuthed = require('../config/isAuthed');

function isLogged (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect('/login');
  }
}


function onlyUnique (value, index, self) {
  return self.indexOf(value) === index;
}

function getDoctors (doctorIds, patient) {
  for (let i = 0; i < patient.clinical_record.appointments.length; i++) {
    doctorIds.push(patient.clinical_record.appointments[i].examiner.id);
  }
  for (let i = 0; i < patient.clinical_record.labs.length; i++) {
    doctorIds.push(patient.clinical_record.labs[i].requested_by.id);
  }
  for (let i = 0; i < patient.clinical_record.imagings.length; i++) {
    doctorIds.push(patient.clinical_record.imagings[i].requested_by.id);
  }
  for (let i = 0; i < patient.clinical_record.medications.length; i++) {
    doctorIds.push(patient.clinical_record.medications[i].requested_by.id);
  }
}

router.get('/', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('patient employee')
    .then((user) => {
      if (user.patient) {
        return res.redirect('/patient/' + user.patient._id);
      } else {
        if (!req.query.search_patients) {
          Patient
                .find(req.query)
                .populate('doctors clinical_record')
                .then((patients) => {
                  return res.render('patients', {user: user, patients: patients});
                })
                .catch((err) => {
                  console.log(err);
                  return res.redirect('/');
                });
        } else {
          Patient
                .find({$text: {$search: req.query.search_patients}})
                .populate('doctors clinical_record')
                .then((patients) => {
                  return res.render('patients', {user: user, patients: patients});
                })
                .catch((err) => {
                  console.log(err);
                  return res.redirect('/');
                });
        }
      }
    });
});

router.get('/other', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('employee')
    .then((user) => {
      if (user.patient) {
        return res.redirect('/patient/' + user.patient._id);
      } else {
        if (!req.query.search_patients) {
          var query = req.query;
          query.admitted = false;
          Patient
            .find(query)
            .populate('doctors clinical_record')
            .then((patients) => {
              return res.render('patients-other', {user: user, patients: patients});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        } else {
          Patient
            .find({$text: {$search: req.query.search_patients}, admitted: false})
            .populate('doctors clinical_record')
            .then((patients) => {
              return res.render('patients-other', {user: user, patients: patients});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        }
      }
    });
});

router.get('/admitted', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('employee')
    .then((user) => {
      if (user.patient) {
        return res.redirect('/patient/' + user.patient._id);
      } else {
        if (!req.query.search_patients) {
          var query = req.query;
          query.admitted = true;
          Patient
            .find(query)
            .populate('doctors clinical_record')
            .then((patients) => {
              return res.render('patients-admitted', {user: user, patients: patients});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        } else {
          Patient
            .find({$text: {$search: req.query.search_patients}, admitted: true})
            .populate('doctors clinical_record')
            .then((patients) => {
              return res.render('patients-admitted', {user: user, patients: patients});
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

router.get('/admit/:patientid', isAuthed, (req, res) => {
  var patientid = req.params.patientid;
  Patient
    .findById(patientid)
    .then((patient) => {
      patient.admitted = true;
      patient
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

router.get('/discharge/:patientid', isAuthed, (req, res) => {
  var patientid = req.params.patientid;
  Patient
    .findById(patientid)
    .then((patient) => {
      patient.admitted = false;
      patient
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

router.get('/add-new', isAuthed, (req, res) => {
  Account.findById(req.user.id)
    .populate('employee')
    .then((user) => {
      return res.render('add-patient', {
        user: user
      });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

router.get('/edit/:patientid', isAuthed, (req, res) => {
  Account.findById(req.user.id)
    .populate('employee')
    .then((user) => {
      let id = req.params.patientid;
      Patient
       .findOne({'_id': id})
       .then((patient) => {
         return res.render('edit-patient', {
           patient: patient,
           user: user
         });
       })
       .catch((err) => {
         console.log(err);
         return res.redirect('/');
       });
    });
});

router.post('/edit/:patientid', uploading.single('photo'), (req, res) => {
  let id = req.params.patientid;
  Account
    .findOne({'patient': id})
    .then((user) => {
      Patient
        .findOne({'_id': id})
        .then((patient) => {
          patient.first_name = req.body.first_name;
          patient.middle_name = req.body.middle_name;
          patient.last_name = req.body.last_name;
          patient.sex = req.body.sex;
          patient.place_of_birth = req.body.place_of_birth;
          patient.occupation = req.body.occupation;
          patient.status = req.body.status;
          patient.blood_type = req.body.blood_type;
          patient.department = req.body.department;
          patient.religion = req.body.religion;
          patient.phone = req.body.phone;
          patient.address = req.body.address;
          patient.egn = req.body.egn;
          patient.email = req.body.email;
          patient.admitted = !!req.body.admitted;

          user.username = req.body.egn;
          user.password = user.generateHash(req.body.password);

          if (req.file) {
            patient.photo = '/uploads/' + req.file.filename;
          }

          user
            .save()
            .then(() => {
              patient
                .save()
                .then(() => {
                  return res.redirect('/patient/' + patient.id);
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

router.post('/', uploading.single('photo'), (req, res) => {
  Account
    .findOne({username: req.body.egn})
    .then((results) => {
      if (results === null) {
        var newUser = new Account();
        newUser.username = req.body.egn;
        newUser.password = newUser.generateHash(req.body.password);

        let newPatient = new Patient({
          first_name: req.body.first_name,
          middle_name: req.body.middle_name,
          last_name: req.body.last_name,
          sex: req.body.sex,
          place_of_birth: req.body.place_of_birth,
          occupation: req.body.occupation,
          status: req.body.status,
          blood_type: req.body.blood_type,
          department: req.body.department,
          religion: req.body.religion,
          phone: req.body.phone,
          address: req.body.address,
          egn: req.body.egn,
          email: req.body.email,
          admitted: !!req.body.admitted
        });
        if (req.file) {
          newPatient.photo = '/uploads/' + req.file.filename;
        }
        newUser.patient = newPatient._id;
        let newClinicalRecord = new ClinicalRecord();
        newPatient.clinical_record = newClinicalRecord._id;

        newUser
            .save()
            .then(() => {
              newPatient
                .save()
                .then(() => {
                  newClinicalRecord
                     .save()
                     .then(() => {
                       return res.redirect('/patient/' + newPatient.id);
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
      } else {
        return res.send('Username taken');
      }
    })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

router.get('/:patientid', isLogged, (req, res) => {
  let id = req.params.patientid;

  Account
   .findById(req.user.id)
   .populate('employee patient')
   .then((user) => {
     Patient
       .findOne({'_id': id})
       .populate({
         path: 'clinical_record doctors',
         populate: {
           path: 'appointments medications imagings labs family_members expenses', options: { sort: { 'date': -1 } }
         }
       })
       .then((patient) => {
         let doctorIds = [];
         getDoctors(doctorIds, patient);
         doctorIds = doctorIds.filter(onlyUnique);
         Account.find({'_id': {$in: doctorIds}})
            .populate('employee')
            .then((doctors) => {
              return res.render('patient', {
                patient: patient,
                record: patient.clinical_record,
                user: user,
                doctors: doctors
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
   })
   .catch((err) => {
     return res.send(err);
   });
});

router.get('/delete/:patientid', isAuthed, (req, res) => {
  let id = req.params.patientid;
  Patient
   .findById(id)
   .then((patient) => {
     Account.remove({'patient': patient._id})
       .then(() => {
         Appointment.remove({'patient': patient._id}).then(() => {
           Expense.remove({'patient': patient._id}).then(() => {
             FamilyMember.remove({'patient': patient._id}).then(() => {
               Imaging.remove({'patient': patient._id}).then(() => {
                 Lab.remove({'patient': patient._id}).then(() => {
                   Medication.remove({'patient': patient._id}).then(() => {
                     ClinicalRecord.remove({'_id': patient.clinical_record})
                        .then(() => {
                          patient.remove()
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
                 });
               });
             });
           });
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

router.post('/:patientid/addnewallergy', isLogged, (req, res) => {
  let id = req.params.patientid;
  Patient
   .findOne({'_id': id})
   .then((patient) => {
     let Allergy = {
       value: req.body.allergy
     };
     patient.allergies.push(Allergy);
     patient
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

router.get('/:patientid/removeallergy/:allergyid', isLogged, (req, res) => {
  let id = req.params.patientid;
  Patient
    .findOne({'_id': id})
    .then((patient) => {
      patient.allergies.remove(req.params.allergyid);
      patient
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

router.get('/export/:patientid/', isAuthed, (req, res) => {
  let id = req.params.patientid;
  Account
   .findById(req.user.id)
   .populate('employee patient')
   .then((user) => {
     Patient
       .findOne({'_id': id})
       .populate({
         path: 'clinical_record doctors',
         populate: {
           path: 'appointments medications imagings labs family_members expenses'
         }
       })
       .then((patient) => {
         let doctorIds = [];
         getDoctors(doctorIds, patient);
         doctorIds = doctorIds.filter(onlyUnique);
         Account.find({'_id': {$in: doctorIds}})
               .populate('employee')
               .then((doctors) => {
                 fs.writeFile(path.join(__dirname, '/../public/send/file.json'),
                        JSON.stringify({
                          patient: patient,
                          doctors: doctors
                        }),
                    (error) => {
                      if (error) throw error;
                      res.download(path.join(__dirname, '/../public/send/file.json'), 'patient.json', function (err) {
                        fs.unlink(path.join(__dirname, '/../public/send/file.json'));
                        if (err) {
                          return res.send(err);
                        }
                      });
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
   })
   .catch((err) => {
     console.log(err);
     return res.redirect('/');
   });
});

router.post('/import', uploading.single('json'), (req, res) => {
  if (req.file) {
    console.log('/uploads/' + req.file.filename);
    fs.readFile(path.join(__dirname, '/../public/uploads/' + req.file.filename), 'utf8', (err, data) => {
      if (err) throw (err);
      var parsed = JSON.parse(data);
      console.log(parsed.patient.egn);

      console.log(parsed.patient.clinical_record.appointments.length);

      Account
                        .findOne({username: parsed.patient.egn})
                        .then((results) => {
                          if (results === null) {
                            var newUser = new Account();
                            newUser.username = parsed.patient.egn;
                            newUser.password = '$2a$09$EiBpn431hAnlbFJQoaDx6uCGSUkXLaL9W.13cAsmzZkw4Pip9y0Ty';

                            let newPatient = new Patient({
                              first_name: parsed.patient.first_name,
                              middle_name: parsed.patient.middle_name,
                              last_name: parsed.patient.last_name,
                              sex: parsed.patient.sex,
                              place_of_birth: parsed.patient.place_of_birth,
                              occupation: parsed.patient.occupation,
                              status: parsed.patient.status,
                              blood_type: parsed.patient.blood_type,
                              department: parsed.patient.department,
                              religion: parsed.patient.religion,
                              phone: parsed.patient.phone,
                              address: parsed.patient.address,
                              egn: parsed.patient.egn,
                              email: parsed.patient.email,
                              admitted: !!parsed.patient.admitted
                            });

                            newUser.patient = newPatient._id;
                            let clinicalRecordObject = {
                              appointments: []
                            };

                            for (var i = 0; i < parsed.patient.clinical_record.appointments.length; i++) {
                              var newAppointment = new Appointment({
                                patient: newPatient._id,
                                notes: parsed.patient.clinical_record.appointments[i].notes,
                                status: parsed.patient.clinical_record.appointments[i].status,
                                type: parsed.patient.clinical_record.appointments[i].type,
                                location: parsed.patient.clinical_record.appointments[i].location,
                                examiner: {
                                  id: '000000000000000000000000',
                                  first_name: parsed.patient.clinical_record.appointments[i].examiner.first_name,
                                  last_name: parsed.patient.clinical_record.appointments[i].examiner.last_name
                                },
                                date: parsed.patient.clinical_record.appointments[i].date

                              });

                              clinicalRecordObject.appointments.push(newAppointment._id);

                              newAppointment
                                .save()
                                .then(() => {
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            }

                            let newClinicalRecord = new ClinicalRecord(clinicalRecordObject);

                            newPatient.clinical_record = newClinicalRecord._id;

                            newUser
                              .save()
                              .then(() => {
                                newPatient
                                  .save()
                                  .then(() => {
                                    newClinicalRecord
                                      .save()
                                      .then(() => {
                                        return res.redirect('/patient/' + newPatient.id);
                                      })
                                      .catch((err) => {
                                        return res.send(err);
                                      });
                                  })
                                  .catch((err) => {
                                    return res.json({error: err});
                                  });
                              })
                              .catch((err) => {
                                return res.send(err);
                              });
                          } else {
                            return res.send('Username taken');
                          }
                        })
                        .catch((err) => {
                          return res.send(err);
                        });
    });
  }
});

module.exports = router;
