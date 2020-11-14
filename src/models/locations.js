const mongoose = require('mongoose');

const LocationsSchema = new mongoose.Schema({
  location: { type: String, required: true },
  price: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  salong: { type: Number, required: true },
  place: { type: String, required: true },
  mapUrl: { type: String, required: true }
});

module.exports = mongoose.model('Locations', LocationsSchema);
