'use strict';

const express = require('express');
const http = require('http');
const app = express();
const mongoose = require('mongoose');

// Server config
const port = process.env.PORT || 80;
const server = http.createServer(app);
const io = require('socket.io')(server);

// Database config
require('./config/database')();

// Express config
require('./config/express')(app);

// Passport config
require('./config/passport')(app);

// Socket.IO
require('./config/socket')(io);

server.listen(port, () => {
  if(mongoose.connection.readyState != 0)
  console.log('MedVit is running on http://localhost:' + port);
});
