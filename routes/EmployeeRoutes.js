'use strict';

const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Account = require('../models/Account');
const multer = require('multer');
const path = require('path');
const isAuthed = require('../config/isAuthed');
const uploading = multer({
  dest: path.join(__dirname, '/../public/uploads/'),
  limits: {fileSize: 10000000, files: 1}
});


router.get('/', isAuthed, (req, res) => {
  Account
    .findById(req.user.id)
    .populate('employee')
    .then((user) => {
      if (user.patient) {
        return res.redirect('/patient/' + user.patient._id);
      } else {
        if (!req.query.search_employees) {
          Employee
            .find(req.query)
            .then((employees) => {
              return res.render('employees', {user: user, employees: employees});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        } else {
          Employee
            .find({$text: {$search: req.query.search_employees}})
            .then((employees) => {
              return res.render('employees', {user: req.user, employees: employees});
            })
            .catch((err) => {
              console.log(err);
              return res.redirect('/');
            });
        }
      }
    });
});

router.get('/add-new', isAuthed, (req, res) => {
  Account.findById(req.user.id)
    .populate('employee')
    .then((user) => {
      if (user.employee.role === 'administrator') {
        return res.render('add-employee', {
          user: user
        });
      } else return res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      return res.redirect('/');
    });
});

router.post('/', uploading.single('photo'), (req, res) => {
  Account
    .findOne({username: req.body.username})
    .then((results) => {
      if (results === null) {
        var newUser = new Account();
        newUser.username = req.body.username;
        newUser.password = newUser.generateHash(req.body.password);

        let newEmployee = new Employee({
          firstName: req.body.first_name,
          lastName: req.body.last_name,
          department: req.body.department,
          role: req.body.role
        });
        if (req.file) {
          newEmployee.photo = '/uploads/' + req.file.filename;
        }
        newUser.employee = newEmployee._id;
        newUser
            .save()
            .then(() => {
              newEmployee
                .save()
                .then(() => {
                  return res.redirect('/employee');
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
router.get('/delete/:employeeid', isAuthed, function (req, res) {
  let id = req.params.employeeid;
  Account
   .findOne({'employee': id})
   .then((account) => {
     Employee
       .remove({'_id': id})
       .then(() => {
         account
          .remove()
          .then(() => {
            return res.send('back');
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

module.exports = router;
