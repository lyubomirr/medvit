'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let HospitalSchema = new Schema({
  hospitalName: String,
  hospitalAddress: String,
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Hospital', HospitalSchema);
