const express = require('express');
const Movies = require('../models/movies');
const { uploadImagesToGoogleCloud } = require('../config/googleCloudStorage');

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
    image,
    video,
    description,
  } = req.body;

  try {
    if (
      (title
        && director
        && actors
        && rated
        && duration
        && minimunAge
        && video
        && description)
      || (actors === null
        && title
        && director
        && rated
        && duration
        && minimunAge
        && video
        && description
      )
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
        'please include title, director, actors, rated {sv, es}, duration, minimunAge, video, description: {sv, es}, actors',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

moviesRouter.patch('/:movieId/image', async (req, res) => {
  try {
    const { files } = req;

    if (files.length === 2) {
      const imagesArray = await uploadImagesToGoogleCloud(files);

      if (imagesArray.length === 0) {
        return res.status(500).json({ message: 'please create a buckect in Google Cloud' });
      }

      await Movies.updateOne({ _id: req.params.movieId },
        { $set: { image: imagesArray[0], poster: imagesArray[1] } });

      return res.json({ _id: req.params.movieId, image: imagesArray[0], poster: imagesArray[1] });
    }
    return res.status(400).json({ message: 'please include 2 files under the name `image` (1.image and 2.poster in that order) as form-data format' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = moviesRouter;
