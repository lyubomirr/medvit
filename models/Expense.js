'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ExpenseSchema = new Schema({
  category: {
    type: String,
    default: ''
  },
  sources: {
    type: String,
    default: ''
  },
  monthly_cost: {
    type: Number,
    default: 0
  },
  patient: {
    ref: 'Patient',
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
