const mongoose = require('mongoose');

const ScreeningSchema = new mongoose.Schema({
  movie_id: { type: mongoose.ObjectId, required: true },
  location_id: { type: mongoose.ObjectId, required: true },
  dates: [
    {
      date: { type: Date, required: true },
      screening: [{ hour: { type: String, required: true } }],
    },
  ],
});

module.exports = mongoose.model('Screening', ScreeningSchema);
