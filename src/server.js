const express = require('express');
const { connect } = require('./config/database');
const app = express();

module.exports = app;

const PORT = process.env.PORT || 4001;

const cors = require('cors');
app.use(cors());

const movies = require('./controllers/movies');
app.use('/movies', movies);

app.get('/', (req, res) => {
  res.json({
    message: 'it works',
  });
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
connect();


