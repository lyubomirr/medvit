'use strict';

const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();

const sslPath = '/etc/letsencrypt/live/medvit.me/';
const options = {
  key: fs.readFileSync(sslPath + 'privkey.pem'),
  cert: fs.readFileSync(sslPath + 'fullchain.pem')
};

// Server config
const port = process.env.PORT || 443;
const server = https.createServer(options, app);

// Database config
require('./config/database')();

// Express config
require('./config/express')(app);

// Passport config
require('./config/passport')(app);

server.listen(port, () => {
  console.log('MedVit is running on http://localhost:' + port);
});

const wsServer = http.createServer(app).listen(80);

const io = require('socket.io')(wsServer);

// Socket.IO
require('./config/socket')(io);
