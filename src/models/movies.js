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
  poster: { type: String, required: true },
  video: { type: String, required: true },
  image: { type: String, required: true },
  description: {
    sv: { type: String, required: true },
    es: { type: String, required: true },
  },
});

module.exports = mongoose.model('Movies', MoviesSchema);
