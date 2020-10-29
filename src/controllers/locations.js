const express = require('express');
const Locations = require('../models/locations');

const locationsRouter = express.Router();

// get locations
locationsRouter.get('/', async (req, res) => {
    try {
        const allLocations = await Locations.find();
        return res.json(allLocations);
    } catch (error) {
        res.status(500).json({ message: message.error });
    }

});

module.exports = locationsRouter;