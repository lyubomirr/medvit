'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LabSchema = new Schema({
  lab_type: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  result: String,
  notes: {
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

LabSchema.index({
  lab_type: 'text',
  status: 'text',
  result: 'text',
  notes: 'text'
});

module.exports = mongoose.model('Lab', LabSchema);
