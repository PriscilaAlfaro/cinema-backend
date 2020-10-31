const mongoose = require('mongoose');

const LocationsSchema = new mongoose.Schema({
    location: { type: String, required: true },
    price: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
});

module.exports = mongoose.model('Locations', LocationsSchema);