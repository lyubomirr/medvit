'use strict';

const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Patient = require('../models/Patient');
const Account = require('../models/Account');
const isAuthed = require('../config/isAuthed');

router.get('/', isAuthed, (req, res) => {
  Expense
   .find(req.query)
   .then((expenses) => {
     return res.status(200).json(expenses);
   })
   .catch((err) => {
     console.log(err);
     return res.redirect('/');
   });
});

router.post('/:id', isAuthed, (req, res) => {
  Patient
    .findById(req.params.id)
    .populate('doctors clinical_record')
    .then((patient) => {
      let newExpense = new Expense({
        category: req.body.category,
        sources: req.body.sources,
        monthly_cost: req.body.monthly_cost,
        patient: patient.id
      });
      newExpense
        .save()
        .then(() => {
          patient.clinical_record.expenses.push(newExpense.id);
          patient.clinical_record.save()
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

router.get('/:expenseid', isAuthed, (req, res) => {
  let id = req.params.expenseid;
  Expense
   .findById(id)
   .then((expense) => {
     return res.json(expense);
   })
   .catch((err) => {
     return res.send(err);
   });
});

router.post('/edit/:expenseid', isAuthed, (req, res) => {
  let id = req.params.expenseid;
  Expense
    .findById(id)
    .then((expense) => {
      expense.category = req.body.category;
      expense.sources = req.body.sources;
      expense.monthly_cost = req.body.monthly_cost;
      expense
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
router.get('/delete/:expenseid', isAuthed, (req, res) => {
  let id = req.params.expenseid;
  Expense
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
