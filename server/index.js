
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config/config');

if (process.env.NODE_ENV === 'test') {
    // Connect to the mLab test database
    console.log('using the test database for the test env.');
    mongoose.connect(config.db.testmongodb.url, {useNewUrlParser: true});
} else {
    // Connect to mLab remote db service for production
    mongoose.connect(config.db.mongodb.url, {useNewUrlParser: true});
}

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authentication'));
app.use('/api/users', require('./routes/users'));

// Run the server on port 5000
app.listen(config.port);
console.log(`server started on port ${config.port}`);

// Exporting the app for unit testing with mocha/chai
module.exports = app;