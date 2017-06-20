'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FamilyMemberSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: 0
  },
  civil_status: {
    type: String,
    default: ''
  },
  relationship: {
    type: String,
    default: ''
  },
  education: {
    type: String,
    default: ''
  },
  occupation: {
    type: String,
    default: ''
  },
  income: {
    type: Number,
    default: 0
  },
  insurance: {
    type: String,
    default: ''
  },
  patient: {
    ref: 'Patient',
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('FamilyMember', FamilyMemberSchema);
