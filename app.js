const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config()
const cors = require('cors')

const apiRoute = require('./app_api/_config/routes')
const { errorHandler } = require('./app_api/_middlewares')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:4200'], credentials: true }))

app.use('/api', apiRoute);

app.use(errorHandler)

module.exports = app;
