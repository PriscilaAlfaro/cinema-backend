const mongoose = require('mongoose');

const seatAvailabilitySchema = new mongoose.Schema({
  screening_id: { type: mongoose.ObjectId, required: true },
  purchasedSeats: [{ type: Number, required: true }],
});

module.exports = mongoose.model('SeatAvailability', seatAvailabilitySchema);
