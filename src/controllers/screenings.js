const express = require('express');
const Screening = require('../models/screenings');

const screeningRouter = express.Router();


screeningRouter.get('/', async (req, res) => {
    try {
        const allScreening = await Screening.find();
        return res.json(allScreening);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});


screeningRouter.post('/', async (req, res) => {
    const { movie_id, location_id, dates } = req.body;
    try {
        if (movie_id && location_id && dates) {
            const screening = new Screening({
                movie_id,
                location_id,
                dates,
            });
            await screening.save();
            return res.json(screening);
        }
        return res
            .status(400)
            .json({ message: 'please include a dates array' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

module.exports = screeningRouter;