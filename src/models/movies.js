const mongoose = require('mongoose');

const MoviesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  actors: { type: String, required: false },
  rated: {
    type: Map,
    of: String,
    required: true
  },
  duration: { type: String, required: true },
  minimunAge: { type: Number, required: true },
  poster: { type: String, required: true },
  video: { type: String, required: true },
  image: { type: String, required: true },
  description: {
    type: Map,
    of: String,
    required: true
  },
});

module.exports = mongoose.model('Movies', MoviesSchema);
