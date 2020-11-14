const supertest = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../../server');
const { connect } = require('../../config/database');
const SeatAvailability = require('../../models/seatAvailability');

describe('SeatAvailability API test', () => {
  beforeEach(async () => {
    await connect();
  });

  afterEach(async () => {
    await SeatAvailability.deleteMany();
    await mongoose.connection.close();
  });

  describe('GET /seatAvailability/:screeningId', () => {
    it('should return SeatAvailability by screening Id', async () => {
      const seatAvailability = new SeatAvailability({
        screening_id: '5f9d5d2a7f933a1dcba88a26',
        purchasedSeats: [
          10, 11
        ]
      });
      await seatAvailability.save();

      const response = await supertest(app)
        .get(`/seatAvailability/${seatAvailability.screening_id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      const { body } = response;

      expect(body.screening_id).to.equal('5f9d5d2a7f933a1dcba88a26');
      expect(body.purchasedSeats).to.have.lengthOf(2);
    });
  });
});
