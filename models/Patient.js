'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PatientSchema = new Schema({
  first_name: {
    type: String,
    default: ''
  },
  middle_name: {
    type: String,
    default: ''
  },
  last_name: {
    type: String,
    default: ''
  },
  sex: {
    type: String,
    default: ''
  },
  date_of_birth: {
    type: Date,
    default: Date.now()
  },
  place_of_birth: {
    type: String,
    default: ''
  },
  occupation: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  blood_type: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  religion: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  egn: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  clinical_record: {
    ref: 'ClinicalRecord',
    type: Schema.Types.ObjectId
  },
  notes: {
    type: String,
    default: ''
  },
  allergies: [{
    value: String
  }],
  photo: {
    type: String,
    default: '/images/user.png'
  },
  admitted: Boolean
});

PatientSchema.index({
  first_name: 'text',
  middle_name: 'text',
  last_name: 'text',
  egn: 'text'
});

module.exports = mongoose.model('Patient', PatientSchema);
