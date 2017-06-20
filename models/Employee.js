'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EmployeeSchema = new Schema({
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  photo: {
    type: String,
    default: '/images/user.png'
  }
});

EmployeeSchema.index({
  firstName: 'text',
  lastName: 'text',
  role: 'text'
});

module.exports = mongoose.model('Employee', EmployeeSchema);
