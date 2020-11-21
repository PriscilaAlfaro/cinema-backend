const express = require('express');
const { format } = require('util');
const Movies = require('../models/movies');
const { storage } = require('../config/googleCloudStorage');

const moviesRouter = express.Router();

const bucket = storage().bucket(process.env.GOOGLE_CLOUD_BUCKET);

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
  const { files } = req;

  if (!bucket) {
    res.status(400).send('Create a buckect in Google Cloud');
  }

  try {
    const promises = [];
    if (files.length > 1) {
      files.forEach((file) => {
        const originalname = `img-${file.originalname}`;
        const { buffer } = file;
        const blob = bucket.file(originalname);

        const promise = new Promise((resolve, reject) => {
          const blobStream = blob.createWriteStream();

          blobStream.on('finish', async () => {
            const publicUrl = format(
              `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET}/${blob.name}`
            );
            resolve(publicUrl);
          });

          blobStream.on('error', (error) => {
            reject(error);
          });

          blobStream.end(buffer);
        });

        promises.push(promise);
      });
      const filePaths = await Promise.all(promises);

      await Movies.updateOne({ _id: req.params.movieId },
        { $set: { image: filePaths[0], poster: filePaths[1] } });

      res.json({ _id: req.params.movieId, image: filePaths[0], poster: filePaths[1] });
    }
    res.status(400).json({ message: 'please include 2 files under the name `image` (1.image and 2.poster in that order) as form-data format' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = moviesRouter;
