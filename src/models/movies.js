const mongoose = require('mongoose');

const MoviesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    rated: { type: String, required: true },
    duration: { type: String, required: true },
    rated: { type: String, required: true },
    minimunAge: { type: Number, required: true },
    video: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Movies', MoviesSchema);