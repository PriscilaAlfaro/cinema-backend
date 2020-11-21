const mongoose = require('mongoose');

const MoviesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  actors: { type: String, required: false },
  rated: {
    sv: { type: String, required: true },
    es: { type: String, required: true },
  },
  duration: { type: String, required: true },
  minimunAge: { type: Number, required: true },
  poster: { type: String, required: false },
  video: { type: String, required: true },
  image: { type: String, required: false },
  description: {
    sv: { type: String, required: true },
    es: { type: String, required: true },
  },
});

module.exports = mongoose.model('Movies', MoviesSchema);
