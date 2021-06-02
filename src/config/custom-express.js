const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const logger = require('../services/logger.js')

app.use(morgan('common', {
    stream: {
        write: (msg) => {
            logger.info(msg);
        }
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

consign({ cwd: 'src' })
    .include('controllers')
    .then('dao')
    .then('services')
    .into(app);

module.exports = app;