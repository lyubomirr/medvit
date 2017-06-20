'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ImagingSchema = new Schema({
  type: {
    type: String,
    default: ''
  },
  result: {
    type: String,
    default: ''
  },
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

ImagingSchema.index({
  type: 'text',
  result: 'text',
  notes: 'text'
});

module.exports = mongoose.model('Imaging', ImagingSchema);
