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
app.use('/movies', movies);
app.use('/locations', locations);
app.use('/screenings', screenings);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
connect();


