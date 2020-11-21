/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { connect } = require('./config/database');
const checkFileType = require('./utils/ckeckFileType');

const app = express();

module.exports = app;

const PORT = process.env.PORT || 4001;

app.use(express.json());

app.use(cors());

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    checkFileType(req, file, cb);
  },
});

app.use(multerMid.array('image', 2));

const movies = require('./controllers/movies');
const locations = require('./controllers/locations');
const screenings = require('./controllers/screenings');
const seatAvailability = require('./controllers/seatAvailability');
const order = require('./controllers/order');
const stripe = require('./controllers/stripe');

app.use('/movies', movies);
app.use('/locations', locations);
app.use('/screenings', screenings);
app.use('/seatAvailability', seatAvailability);
app.use('/order', order);
app.use('/stripe', stripe);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
connect();
