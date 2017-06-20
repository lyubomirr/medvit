'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let AccountSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient'
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }
});

AccountSchema.methods.generateHash = function GenerateHash (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

AccountSchema.methods.validPassword = function ValidatePassword (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Account', AccountSchema);
