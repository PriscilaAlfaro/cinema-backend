const supertest = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../../server');
const { connect } = require('../../config/database');
const Locations = require('../../models/locations');

describe('Locations API test', () => {
  beforeEach(async () => {
    await connect();
  });

  afterEach(async () => {
    await Locations.deleteMany();
    await mongoose.connection.close();
  });

  describe('GET /locations', () => {
    it('should return all locations', async () => {
      const location = new Locations({
        location: 'Stockholm',
        price: 10,
        totalSeats: 25,
        salong: 1,
        place: 'Mall of Scandinavia',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2032.8304870547397!2d18.003176316284286!3d59.36916798167282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9dc632e678ff%3A0x4bb453ffd468743e!2sMall%20of%20Scandinavia!5e0!3m2!1sen!2sse!4v1604833710731!5m2!1sen!2sse'
      });
      await location.save();

      const response = await supertest(app)
        .get('/locations')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      const body = response.body[0];
      expect(body.location).to.equal('Stockholm');
      expect(body.price).to.equal(10);
      expect(body.totalSeats).to.equal(25);
      expect(body.salong).to.equal(1);
      expect(body.place).to.equal('Mall of Scandinavia');
      expect(body.mapUrl).to.equal('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2032.8304870547397!2d18.003176316284286!3d59.36916798167282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9dc632e678ff%3A0x4bb453ffd468743e!2sMall%20of%20Scandinavia!5e0!3m2!1sen!2sse!4v1604833710731!5m2!1sen!2sse');
    });
  });

  describe('POST /locations', () => {
    it('should save location to the database', async () => {
      const response = await supertest(app)
        .post('/locations')
        .send({
          location: 'Stockholm',
          price: 10,
          totalSeats: 25,
          salong: 1,
          place: 'Mall of Scandinavia',
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2032.8304870547397!2d18.003176316284286!3d59.36916798167282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9dc632e678ff%3A0x4bb453ffd468743e!2sMall%20of%20Scandinavia!5e0!3m2!1sen!2sse!4v1604833710731!5m2!1sen!2sse'
        })
        .expect(200);

      const locationFromDB = await Locations.findOne({ _id: response.body._id });

      const { body } = response;

      expect(body._id).to.equal(locationFromDB._id.toString());
      expect(body.location).to.equal(locationFromDB.location);
      expect(body.price).to.equal(locationFromDB.price);
      expect(body.totalSeats).to.equal(locationFromDB.totalSeats);
      expect(body.totalSeats).to.equal(locationFromDB.totalSeats);
      expect(body.salong).to.equal(locationFromDB.salong);
      expect(body.place).to.equal(locationFromDB.place);
      expect(body.mapUrl).to.equal(locationFromDB.mapUrl);
    });

    it('should save return 400 if any data required is not sent in body request', async () => {
      await supertest(app)
        .post('/locations')
        .send({
          price: 10,
          totalSeats: 25,
          salong: 1,
          place: 'Mall of Scandinavia',
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2032.8304870547397!2d18.003176316284286!3d59.36916798167282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9dc632e678ff%3A0x4bb453ffd468743e!2sMall%20of%20Scandinavia!5e0!3m2!1sen!2sse!4v1604833710731!5m2!1sen!2sse'
        })
        .expect(400, { message: 'please include location, price, totalSeats, place, salong, mapUrl' });
    });
  });
});
