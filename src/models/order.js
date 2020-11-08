const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  location_id: { type: mongoose.ObjectId, required: true },
  location: { type: String, required: true },
  movie_id: { type: mongoose.ObjectId, required: true },
  movie: { type: String, required: true },
  date_id: { type: mongoose.ObjectId, required: true },
  date: { type: String, required: true },
  screening_id: { type: mongoose.ObjectId, required: true },
  screening: { type: String, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  seatNumber: [{ type: Number, required: true }],
  paymentReference: { type: String, required: true },
  paymentStatus: { type: String, required: true },
});

module.exports = mongoose.model('Order', OrderSchema);
