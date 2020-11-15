const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../../server');
const Screenings = require('../../models/screenings');
const SeatAvailability = require('../../models/seatAvailability');

describe('Screenings API test', () => {
  afterEach(async () => {
    await Screenings.deleteMany();
    await SeatAvailability.deleteMany();
  });

  describe('GET /screenings', () => {
    it('should return all screenings', async () => {
      const screening = new Screenings({
        movie_id: '5f97eae8b06cca78a869a6a5',
        location_id: '5f9936d9b06cca78a869c01c',
        dates: [
          {
            date: '2020-11-15',
            screening: [
              {
                hour: '17:00'
              },
              {
                hour: '20:30'
              }
            ]
          }
        ]
      });
      await screening.save();

      const response = await supertest(app)
        .get('/screenings')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      const body = response.body[0];
      expect(body.movie_id).to.equal('5f97eae8b06cca78a869a6a5');
      expect(body.location_id).to.equal('5f9936d9b06cca78a869c01c');
      expect(body.dates).to.have.lengthOf(1);
      expect(body.dates[0].date).to.equal(screening.dates[0].date.toISOString());
      expect(body.dates[0].screening).to.have.lengthOf(2);
      expect(body.dates[0].screening[0].hour).to.equal('17:00');
      expect(body.dates[0].screening[1].hour).to.equal('20:30');
    });
  });

  describe('POST /screenings', () => {
    it('should save screening to the database', async () => {
      const response = await supertest(app)
        .post('/screenings')
        .send({
          movie_id: '5f97eae8b06cca78a869a6a5',
          location_id: '5f9936d9b06cca78a869c01c',
          dates: [
            {
              date: '2020-11-15',
              screening: [
                {
                  hour: '17:00'
                },
                {
                  hour: '20:30'
                }
              ]
            }
          ]
        })
        .expect(200);

      const screeningFromDB = await Screenings.findOne({ _id: response.body.screening._id });

      const { screening } = response.body;

      expect(screening._id).to.equal(screeningFromDB._id.toString());
      expect(screening.movie_id).to.equal(screeningFromDB.movie_id.toString());
      expect(screening.location_id).to.equal(screeningFromDB.location_id.toString());
      expect(screening.dates[0].date).to.equal(screeningFromDB.dates[0].date.toISOString());
      expect(screening.dates[0].screening[0].hour)
        .to.equal(screeningFromDB.dates[0].screening[0].hour);
      expect(screening.dates[0].screening[1].hour)
        .to.equal(screeningFromDB.dates[0].screening[1].hour);
    });

    it('should save return 400 if any data required is not sent in body request', async () => {
      await supertest(app)
        .post('/screenings')
        .send({
          movie_id: '5f97eae8b06cca78a869a6a5',
          dates: [
            {
              date: '2020-11-15',
              screening: [
                {
                  hour: '17:00'
                },
                {
                  hour: '20:30'
                }
              ]
            }
          ]
        })
        .expect(400, { message: 'please include movie_id, location_id and dates array' });
    });
  });
});
