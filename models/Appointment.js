'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AppointmentSchema = new Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  examiner: {
    id: String,
    first_name: String,
    last_name: String
  },
  location: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  patient: {
    ref: 'Patient',
    type: Schema.Types.ObjectId
  }
});

AppointmentSchema.index({
  type: 'text',
  status: 'text',
  notes: 'text',
  location: 'text',
  examiner: 'text'
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
