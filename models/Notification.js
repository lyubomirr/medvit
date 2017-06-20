'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  issuer: {
    type: String,
    default: ''
  },
  receivers: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  type: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  patient: {
    ref: 'Patient',
    type: Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
