const supertest = require('supertest');
const { expect } = require('chai');

const app = require('../../server');

describe('Stripe API test', () => {
  describe('POST /stripe/create-checkout-session', () => {
    it('should save return 400 if any data required is not sent in body request', async () => {
      await supertest(app)
        .post('/stripe/create-checkout-session')
        .send({
          price: 10,
          amount: 2
        })
        .expect(400, { message: 'please include product, price, amount' });
    });
  });
});
