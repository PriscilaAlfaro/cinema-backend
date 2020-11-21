const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../../server');
const Movies = require('../../models/movies');

describe('Movies API test', () => {
  afterEach(async () => {
    await Movies.deleteMany();
  });

  describe('GET /movies', () => {
    it('should return all movies', async () => {
      const movie = new Movies({
        title: 'Nelly Rapp - Monsteragent',
        director: 'Amanda Adolfsson',
        actors: 'Matilda Gross, Johan Rheborg, Marianne Mörck, Björn Gustafsson, Lily Wahlsteen',
        rated: {
          sv: 'Familj',
          es: 'Familiar'
        },
        duration: '1:32 min',
        minimunAge: 11,
        poster: 'https://image.tmdb.org/t/p/original/4LuJCO1edIbLVGx99uv7luDoIJt.jpg',
        video: 'https://www.youtube.com/embed/Z7LQTZnaSzk',
        image: 'https://catalog.cinema-api.com/cf/images/ncg-images/4fcc013a61e04db3888f03f187b0c6b7.jpg?width=240&version=1C7CCC78AD4FC41C08AB456DF0A59168&format=webp',
        description: {
          sv: 'Nelly och hennes hund London ska tillbringa höstlovet hos sin morbror Hannibal. Men det visar sig att Hannibal inte lever det lugna liv som hon trott – han är en monsteragent! Nelly är snart omgiven av vampyrer, spöken, varulvar och Frankensteinare och dras in i ett gastkramande äventyr där allt hon tidigare trott på sätts på prov.',
          es: 'Nelly y su perro London pasarán las vacaciones de otoño con su tío Hannibal. Pero resulta que Hannibal no vive la vida tranquila que ella pensaba: ¡es un agente monstruo! Nelly pronto se ve rodeada de vampiros, fantasmas, hombres lobo y Frankensteiners y se ve arrastrada a una aventura sin aliento donde todo en lo que creía anteriormente se pone a prueba.'
        }
      });
      await movie.save();

      const response = await supertest(app)
        .get('/movies')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      const body = response.body[0];

      expect(body.title).to.equal('Nelly Rapp - Monsteragent');
      expect(body.director).to.equal('Amanda Adolfsson');
      expect(body.actors).to.equal('Matilda Gross, Johan Rheborg, Marianne Mörck, Björn Gustafsson, Lily Wahlsteen');
      expect(body.rated.sv).to.equal('Familj');
      expect(body.rated.es).to.equal('Familiar');
      expect(body.duration).to.equal('1:32 min');
      expect(body.minimunAge).to.equal(11);
      expect(body.poster).to.equal('https://image.tmdb.org/t/p/original/4LuJCO1edIbLVGx99uv7luDoIJt.jpg');
      expect(body.video).to.equal('https://www.youtube.com/embed/Z7LQTZnaSzk');
      expect(body.image).to.equal('https://catalog.cinema-api.com/cf/images/ncg-images/4fcc013a61e04db3888f03f187b0c6b7.jpg?width=240&version=1C7CCC78AD4FC41C08AB456DF0A59168&format=webp');
      expect(body.description.sv).to.equal('Nelly och hennes hund London ska tillbringa höstlovet hos sin morbror Hannibal. Men det visar sig att Hannibal inte lever det lugna liv som hon trott – han är en monsteragent! Nelly är snart omgiven av vampyrer, spöken, varulvar och Frankensteinare och dras in i ett gastkramande äventyr där allt hon tidigare trott på sätts på prov.');
      expect(body.description.es).to.equal('Nelly y su perro London pasarán las vacaciones de otoño con su tío Hannibal. Pero resulta que Hannibal no vive la vida tranquila que ella pensaba: ¡es un agente monstruo! Nelly pronto se ve rodeada de vampiros, fantasmas, hombres lobo y Frankensteiners y se ve arrastrada a una aventura sin aliento donde todo en lo que creía anteriormente se pone a prueba.');
    });
  });

  describe('POST /movies', () => {
    it('should save movie to the databse', async () => {
      const response = await supertest(app)
        .post('/movies')
        .send({
          title: 'Nelly Rapp - Monsteragent',
          director: 'Amanda Adolfsson',
          actors: 'Matilda Gross, Johan Rheborg, Marianne Mörck, Björn Gustafsson, Lily Wahlsteen',
          rated: {
            sv: 'Familj',
            es: 'Familiar'
          },
          duration: '1:32 min',
          minimunAge: 11,
          poster: 'https://image.tmdb.org/t/p/original/4LuJCO1edIbLVGx99uv7luDoIJt.jpg',
          video: 'https://www.youtube.com/embed/Z7LQTZnaSzk',
          image: 'https://catalog.cinema-api.com/cf/images/ncg-images/4fcc013a61e04db3888f03f187b0c6b7.jpg?width=240&version=1C7CCC78AD4FC41C08AB456DF0A59168&format=webp',
          description: {
            sv: 'Nelly och hennes hund London ska tillbringa höstlovet hos sin morbror Hannibal. Men det visar sig att Hannibal inte lever det lugna liv som hon trott – han är en monsteragent! Nelly är snart omgiven av vampyrer, spöken, varulvar och Frankensteinare och dras in i ett gastkramande äventyr där allt hon tidigare trott på sätts på prov.',
            es: 'Nelly y su perro London pasarán las vacaciones de otoño con su tío Hannibal. Pero resulta que Hannibal no vive la vida tranquila que ella pensaba: ¡es un agente monstruo! Nelly pronto se ve rodeada de vampiros, fantasmas, hombres lobo y Frankensteiners y se ve arrastrada a una aventura sin aliento donde todo en lo que creía anteriormente se pone a prueba.'
          }
        })
        .expect(200);

      const movieFromDB = await Movies.findOne({ _id: response.body._id });

      const { body } = response;
      expect(body._id).to.equal(movieFromDB._id.toString());
      expect(body.title).to.equal(movieFromDB.title);
      expect(body.director).to.equal(movieFromDB.director);
      expect(body.actors).to.equal(movieFromDB.actors);
      expect(body.rated.sv).to.equal(movieFromDB.rated.sv);
      expect(body.rated.es).to.equal(movieFromDB.rated.es);
      expect(body.duration).to.equal(movieFromDB.duration);
      expect(body.minimunAge).to.equal(movieFromDB.minimunAge);
      expect(body.poster).to.equal(movieFromDB.poster);
      expect(body.video).to.equal(movieFromDB.video);
      expect(body.image).to.equal(movieFromDB.image);
      expect(body.description.sv).to.equal(movieFromDB.description.sv);
      expect(body.description.es).to.equal(movieFromDB.description.es);
    });

    it('should return 400 if any data required is not sent in body request', async () => {
      await supertest(app)
        .post('/movies')
        .send({
          director: 'Amanda Adolfsson',
          actors: 'Matilda Gross, Johan Rheborg, Marianne Mörck, Björn Gustafsson, Lily Wahlsteen',
          rated: {
            sv: 'Familj',
            es: 'Familiar'
          },
          duration: '1:32 min',
          minimunAge: 11,
          poster: 'https://image.tmdb.org/t/p/original/4LuJCO1edIbLVGx99uv7luDoIJt.jpg',
          video: 'https://www.youtube.com/embed/Z7LQTZnaSzk',
          image: 'https://catalog.cinema-api.com/cf/images/ncg-images/4fcc013a61e04db3888f03f187b0c6b7.jpg?width=240&version=1C7CCC78AD4FC41C08AB456DF0A59168&format=webp',
          description: {
            sv: 'Nelly och hennes hund London ska tillbringa höstlovet hos sin morbror Hannibal. Men det visar sig att Hannibal inte lever det lugna liv som hon trott – han är en monsteragent! Nelly är snart omgiven av vampyrer, spöken, varulvar och Frankensteinare och dras in i ett gastkramande äventyr där allt hon tidigare trott på sätts på prov.',
            es: 'Nelly y su perro London pasarán las vacaciones de otoño con su tío Hannibal. Pero resulta que Hannibal no vive la vida tranquila que ella pensaba: ¡es un agente monstruo! Nelly pronto se ve rodeada de vampiros, fantasmas, hombres lobo y Frankensteiners y se ve arrastrada a una aventura sin aliento donde todo en lo que creía anteriormente se pone a prueba.'
          }

        })
        .expect(400, { message: 'please include title, director, actors, rated {sv, es}, duration, minimunAge, video, description: {sv, es}, actors' });
    });
  });

  describe('PATCH /movies/:movieId/image', () => {
    it('should update image and poster of an specific movie', async () => {
      const movie = new Movies({
        title: 'Nelly Rapp - Monsteragent',
        director: 'Amanda Adolfsson',
        actors: 'Matilda Gross, Johan Rheborg, Marianne Mörck, Björn Gustafsson, Lily Wahlsteen',
        rated: {
          sv: 'Familj',
          es: 'Familiar'
        },
        duration: '1:32 min',
        minimunAge: 11,
        poster: '',
        video: 'https://www.youtube.com/embed/Z7LQTZnaSzk',
        image: '',
        description: {
          sv: 'Nelly och hennes hund London ska tillbringa höstlovet hos sin morbror Hannibal. Men det visar sig att Hannibal inte lever det lugna liv som hon trott – han är en monsteragent! Nelly är snart omgiven av vampyrer, spöken, varulvar och Frankensteinare och dras in i ett gastkramande äventyr där allt hon tidigare trott på sätts på prov.',
          es: 'Nelly y su perro London pasarán las vacaciones de otoño con su tío Hannibal. Pero resulta que Hannibal no vive la vida tranquila que ella pensaba: ¡es un agente monstruo! Nelly pronto se ve rodeada de vampiros, fantasmas, hombres lobo y Frankensteiners y se ve arrastrada a una aventura sin aliento donde todo en lo que creía anteriormente se pone a prueba.'
        }
      });
      await movie.save();

      const id = movie._id.toString();

      const buffer = Buffer.from('Desktop/movie-image/image');

      const response = await supertest(app)
        .patch(`/movies/${id}/image`)
        .attach('image', buffer, 'Nelly-Rapp.jpg')
        .attach('image', buffer, 'Poster-Nelly-Rapp.jpg')
        .set('Accept', 'application/form-data')
        .expect('Content-Type', /json/)
        .expect(200);

      const { body } = response;

      expect(body.image).to.equal('https://storage.googleapis.com/cinema-cr-test/img-Nelly-Rapp.jpg');
      expect(body.poster).to.equal('https://storage.googleapis.com/cinema-cr-test/img-Poster-Nelly-Rapp.jpg');
    });

    it('should return 400 if any image is send', async () => {
      const movie = new Movies({
        title: 'Nelly Rapp - Monsteragent',
        director: 'Amanda Adolfsson',
        actors: 'Matilda Gross, Johan Rheborg, Marianne Mörck, Björn Gustafsson, Lily Wahlsteen',
        rated: {
          sv: 'Familj',
          es: 'Familiar'
        },
        duration: '1:32 min',
        minimunAge: 11,
        poster: '',
        video: 'https://www.youtube.com/embed/Z7LQTZnaSzk',
        image: '',
        description: {
          sv: 'Nelly och hennes hund London ska tillbringa höstlovet hos sin morbror Hannibal. Men det visar sig att Hannibal inte lever det lugna liv som hon trott – han är en monsteragent! Nelly är snart omgiven av vampyrer, spöken, varulvar och Frankensteinare och dras in i ett gastkramande äventyr där allt hon tidigare trott på sätts på prov.',
          es: 'Nelly y su perro London pasarán las vacaciones de otoño con su tío Hannibal. Pero resulta que Hannibal no vive la vida tranquila que ella pensaba: ¡es un agente monstruo! Nelly pronto se ve rodeada de vampiros, fantasmas, hombres lobo y Frankensteiners y se ve arrastrada a una aventura sin aliento donde todo en lo que creía anteriormente se pone a prueba.'
        }
      });
      await movie.save();

      const id = movie._id.toString();
      const buffer = Buffer.from('Desktop/movie-image/image');
      await supertest(app)
        .patch(`/movies/${id}/image`)
        .set('Accept', 'application/form-data')
        .attach('image', buffer, 'Nelly-Rapp.jpg')
        .expect('Content-Type', /json/)
        .expect(400, { message: 'please include 2 files under the name `image` (1.image and 2.poster in that order) as form-data format' });
    });

    it('should return 500 if any image is send', async () => {
      const movie = new Movies({
        title: 'Nelly Rapp - Monsteragent',
        director: 'Amanda Adolfsson',
        actors: 'Matilda Gross, Johan Rheborg, Marianne Mörck, Björn Gustafsson, Lily Wahlsteen',
        rated: {
          sv: 'Familj',
          es: 'Familiar'
        },
        duration: '1:32 min',
        minimunAge: 11,
        poster: '',
        video: 'https://www.youtube.com/embed/Z7LQTZnaSzk',
        image: '',
        description: {
          sv: 'Nelly och hennes hund London ska tillbringa höstlovet hos sin morbror Hannibal. Men det visar sig att Hannibal inte lever det lugna liv som hon trott – han är en monsteragent! Nelly är snart omgiven av vampyrer, spöken, varulvar och Frankensteinare och dras in i ett gastkramande äventyr där allt hon tidigare trott på sätts på prov.',
          es: 'Nelly y su perro London pasarán las vacaciones de otoño con su tío Hannibal. Pero resulta que Hannibal no vive la vida tranquila que ella pensaba: ¡es un agente monstruo! Nelly pronto se ve rodeada de vampiros, fantasmas, hombres lobo y Frankensteiners y se ve arrastrada a una aventura sin aliento donde todo en lo que creía anteriormente se pone a prueba.'
        }
      });
      await movie.save();

      const id = movie._id.toString();

      await supertest(app)
        .patch(`/movies/${id}/image`)
        .set('Accept', 'application/form-data')
        .expect('Content-Type', /json/)
        .expect(500);
    });
  });
});
