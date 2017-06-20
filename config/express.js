'use strict';

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const flash = require('express-flash');

module.exports = (app) => {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views/'));

  app.use(helmet());
  app.use(helmet.hsts({
    maxAge: 10886400,
    includeSubDomains: false
  }));

  app.use(express.static(path.join('public')));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cookieParser());
  app.use(session({
    secret: 'lqto2016',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 4 * 60 * 60 * 1000 }
  }));

  app.use(flash());
  app.use(cors());
  // app.use(morgan('combined'));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(require('./../routes/index'));
  app.use('/auth', require('./../routes/auth'));
  app.use('/lab', require('./../routes/LabRoutes'));
  app.use('/patient', require('./../routes/PatientRoutes'));
  app.use('/imaging', require('./../routes/ImagingRoutes'));
  app.use('/medication', require('./../routes/MedicationRoutes'));
  app.use('/expense', require('./../routes/ExpenseRoutes'));
  app.use('/familymember', require('./../routes/FamilyMemberRoutes'));
  app.use('/appointment', require('./../routes/AppointmentRoutes'));
  app.use('/clinicalrecord', require('./../routes/ClinicalRecordRoutes'));
  app.use('/employee', require('./../routes/EmployeeRoutes'));
  app.use('/post', require('./../routes/PostRoutes'));
};
