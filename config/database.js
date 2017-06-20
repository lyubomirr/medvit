'use strict';

const mongoose = require('mongoose');
const fs = require('fs');
const readline = require('readline');
const Account = require('../models/Account');
const Employee = require('../models/Employee');
const Hospital = require('../models/Hospital');

mongoose.Promise = global.Promise;

module.exports = () => {
  let dbString = 'notConfigured';
  if(dbString === 'notConfigured'){
    console.log('Dobre doshli v installatora na MedVit!');
    console.log('Molya vuvedete connection string-a za bazata vi danni vuv format:');
    console.log('mongodb://<dbuser>:<dbpassword>@<host>:<port>');
    console.log();
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('connection string: ', (answer) => {
      dbString = answer;
      fs.readFile('config/database.js', 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          var result = data.replace("notConfigured", dbString);

          mongoose.connect(dbString);
          let database = mongoose.connection;
          database.once('open', (error) => {
            if (error) {
              console.log(error);
              return;
            } else {
              console.log();

              let newUser = new Account();
              let newEmployee = new Employee();
              let newHospital = new Hospital();

              rl.question('Admin potrebitelsko ime: ', (username) => {
                newUser.username = username;
                rl.question('Admin parola: ', (password) => {
                  newUser.password = newUser.generateHash(password);
                  rl.question('Admin ime: ', (firstName) => {
                    newEmployee.firstName = firstName;
                    rl.question('Admin familiya: ', (lastName) => {
                      newEmployee.lastName = lastName;
                      rl.question('Bolnitsa ime: ', (hospitalName) => {
                        newHospital.hospitalName = hospitalName;
                        rl.question('Bolnitsa address: ', (hospitalAddress) => {
                          newHospital.hospitalAddress = hospitalAddress;
                          rl.question('Admin otdelenie: ', (department) => {
                            newEmployee.department = department;
                            newEmployee.role = 'administrator';
                            newUser.employee = newEmployee._id;
                            newHospital
                              .save()
                              .then(() => {
                                newUser
                                    .save()
                                    .then(() => {
                                      newEmployee
                                        .save()
                                        .then(() => {
                                          fs.writeFile('config/database.js', result, 'utf8', function (err) {
                                            if (err) return console.log(err);
                                            else{
                                              console.log('Uspeshno nastroihte MedVit!');
                                              console.log('Medvit moje da bude startiran.');
                                              process.exit(0);
                                            }
                                          });
                                        })
                                        .catch((err) => {
                                          console.log(err);
                                          return;
                                        });
                                    })
                                    .catch((err) => {
                                      console.log(err);
                                      return;
                                    });
                                rl.close();
                              })
                              .catch((err) => {
                                console.log(err);
                                return;
                              });
                          });
                        });
                      });
                    });
                  });
                });
              });
            }
          });
        });
    });

  }

  else{
    mongoose.connect(dbString);
    let database = mongoose.connection;
    database.once('open', (error) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log('DB connected!');
    });
  }



};
