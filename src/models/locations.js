const mongoose = require('mongoose');

const LocationsSchema = new mongoose.Schema({
    location: { type: String, required: true },
});

module.exports = mongoose.model('Locations', LocationsSchema);