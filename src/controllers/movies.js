const express = require('express');
const Movies = require('../models/movies');

const moviesRouter = express.Router();

moviesRouter.get('/', async (req, res) => {
  try {
    const allMovies = await Movies.find();
    return res.json(allMovies);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

moviesRouter.post('/', async (req, res) => {
  const {
    title,
    director,
    actors,
    rated,
    duration,
    minimunAge,
    poster,
    video,
    image,
    description,
  } = req.body;

  try {
    if (
      (title && director && actors)
      || (actors === null
        && rated
        && duration
        && minimunAge
        && poster
        && video
        && image
        && description)
    ) {
      const movie = new Movies({
        title,
        director,
        actors,
        rated,
        duration,
        minimunAge,
        poster,
        video,
        image,
        description,
      });
      await movie.save();
      return res.json(movie);
    }
    return res.status(400).json({
      message:
        'please include title, director, actors, rated {sv, es}, duration, minimunAge, video, poster, image, description: {sv, es}, actors',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = moviesRouter;
