'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PostSchema = new Schema({
  poster: {
    id: String,
    image: String,
    first_name: String,
    last_name: String
  },
  body: String,
  date: Date
});

module.exports = mongoose.model('Post', PostSchema);
