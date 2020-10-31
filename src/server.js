const express = require('express');
const { connect } = require('./config/database');
const app = express();
const cors = require('cors');
module.exports = app;

const PORT = process.env.PORT || 4001;

app.use(express.json());

app.use(cors());


const movies = require('./controllers/movies');
const locations = require('./controllers/locations');
const screenings = require('./controllers/screenings');
const seatAvailability = require('./controllers/seatAvailability');
const order = require('./controllers/order');

app.use('/movies', movies);
app.use('/locations', locations);
app.use('/screenings', screenings);
app.use('/seatAvailability', seatAvailability);
app.use('/order', order);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
connect();


