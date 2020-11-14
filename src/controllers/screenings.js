const express = require('express');
const Screenings = require('../models/screenings');
const SeatAvailability = require('../models/seatAvailability');

const screeningRouter = express.Router();

screeningRouter.get('/', async (req, res) => {
  try {
    const allScreening = await Screenings.find();
    return res.json(allScreening);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Here we create the seatAvailabity with an empty array, because I had the screening Id
screeningRouter.post('/', async (req, res) => {
  const { movie_id, location_id, dates } = req.body;
  try {
    if (movie_id && location_id && dates) {
      const screening = new Screenings({
        movie_id,
        location_id,
        dates,
      });
      const newScreening = await screening.save();

      const seatAvailability = new SeatAvailability({
        screening_id: newScreening._id,
        purchasedSeats: [],
      });

      await seatAvailability.save();

      return res.json({ screening: newScreening, seatAvailability });
    }
    return res.status(400).json({ message: 'please include movie_id, location_id and dates array' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = screeningRouter;
