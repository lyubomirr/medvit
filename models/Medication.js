'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MedicationSchema = new Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  name: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  prescription: {
    type: String,
    default: ''
  },
  requested_by: {
    id: String,
    first_name: String,
    last_name: String
  },
  patient: {
    ref: 'Patient',
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('Medication', MedicationSchema);
