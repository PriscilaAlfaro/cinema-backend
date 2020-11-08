const mongoose = require('mongoose');

const seatAvailabilitySchema = new mongoose.Schema({
  screening_id: { type: mongoose.ObjectId, required: true, unique: true },
  purchasedSeats: [{ type: Number, required: true, unique: true }],
});

module.exports = mongoose.model('SeatAvailability', seatAvailabilitySchema);
