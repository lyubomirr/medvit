'use strict';

const Imaging = require('../models/Imaging');

var clients = [];
module.exports = (io) => {
  io.on('connection', (socket) => {
    var handshakeData = socket.request;

    clients.push({id: socket.id, oid: handshakeData._query['info']});
    console.log(clients);

    socket.on('resultImaging', function (data) {
      var id = data;
      Imaging
        .findById(id)
        .then((imaging) => {
          console.log(imaging);

          for (var i = 0; i < clients.length; i++) {
            if (clients[i].oid === imaging.requested_by.id) {
              io.to(clients[i].id).emit('imagingUpdate', {
                body: imaging.patient
              });
            }
          }
        });
    });

    socket.on('ecg', function (data) {
      socket.broadcast.emit('liveecg', data.value);
    });

    socket.on('disconnect', function () {
      console.log('Got disconnect!');

      for (var i = 0; i < clients.length; i++) {
        if (clients[i].id === socket.id) {
          clients.splice(i, 1);
        }
      }
    });
  });
};
