const express = require('express');
const SeatAvailability = require('../models/seatAvailability');

const seatAvailabilityRouter = express.Router();

seatAvailabilityRouter.get('/:screeningId', async (req, res) => {
  try {
    const { screeningId } = req.params;

    const seatAvailability = await SeatAvailability
      .findOne({ screening_id: screeningId });

    if (!seatAvailability) {
      return res.status(404).json({ message: 'screeningId does not exist' });
    }
    return res.json(seatAvailability);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Post is made from screenings controller POST with empty array
// Patch/update is made from order POST to insert new purchases
// Delete/update is made from order DELETE to remove cancelled purchases

module.exports = seatAvailabilityRouter;
