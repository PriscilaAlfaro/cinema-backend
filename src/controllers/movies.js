const express = require('express');
const Movies = require('../models/movies');

const moviesRouter = express.Router();

// get movies
moviesRouter.get('/', async (req, res) => {
    try {
        const allMovies = await Movies.find();
        return res.json(allMovies);
    } catch (error) {
        res.status(500).json({ message: message.error });
    }

});

module.exports = moviesRouter;