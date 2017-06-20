'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ClinicalRecordSchema = new Schema({
  doctors: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  general_info: {
    type: String,
    default: ''
  },
  egn: {
    type: String,
    default: ''
  },
  appointments: [{
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  medications: [{
    type: Schema.Types.ObjectId,
    ref: 'Medication'
  }],
  imagings: [{
    type: Schema.Types.ObjectId,
    ref: 'Imaging'
  }],
  labs: [{
    type: Schema.Types.ObjectId,
    ref: 'Lab'
  }],
  family_members: [{
    type: Schema.Types.ObjectId,
    ref: 'FamilyMember'
  }],
  expenses: [{
    type: Schema.Types.ObjectId,
    ref: 'Expense'
  }]
});

module.exports = mongoose.model('ClinicalRecord', ClinicalRecordSchema);
