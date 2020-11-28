const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../../server');
const Order = require('../../models/order');
const SeatAvailability = require('../../models/seatAvailability');

describe('Order API test', () => {
  afterEach(async () => {
    await Order.deleteMany();
    await SeatAvailability.deleteMany();
  });

  describe('GET /order/:orderId', () => {
    it('should return order by Id', async () => {
      const order = new Order({
        name: 'Jhon Doe',
        email: 'jdoe@gmail.com',
        location_id: '5f9d5c2269cc111dac056c9e',
        location: 'Stockholm',
        movie_id: '5f9d57c26715be1b4bb655d1',
        movie: 'Nelly Rapp - Monsteragent',
        date_id: '5f9d5d2a7f933a1dcba88a27',
        date: '15/11/2020',
        screening_id: '5f9d5d2a7f933a1dcba88a26',
        screening: '17:00',
        salong: 1,
        place: 'Mall of Scandinavia',
        price: 10,
        totalPrice: 20,
        seatNumber: [
          5,
          6
        ],
        paymentReference: 'ch_1HiCaI2eZvKYlo2CsnhbyVsJ',
        paymentStatus: 'pending',
        purchaseDate: new Date().toISOString(),
        language: 'sv'
      });
      await order.save();

      const response = await supertest(app)
        .get(`/order/${order._id.toString()}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      const { body } = response;

      expect(body._id).to.equal(order._id.toString());
      expect(body.name).to.equal('Jhon Doe');
      expect(body.email).to.equal('jdoe@gmail.com');
      expect(body.location).to.equal('Stockholm');
      expect(body.location_id).to.equal('5f9d5c2269cc111dac056c9e');
      expect(body.movie).to.equal('Nelly Rapp - Monsteragent');
      expect(body.movie_id).to.equal('5f9d57c26715be1b4bb655d1');
      expect(body.date).to.equal('15/11/2020');
      expect(body.date_id).to.equal('5f9d5d2a7f933a1dcba88a27');
      expect(body.screening).to.equal('17:00');
      expect(body.screening_id).to.equal('5f9d5d2a7f933a1dcba88a26');
      expect(body.salong).to.equal('1');
      expect(body.place).to.equal('Mall of Scandinavia');
      expect(body.price).to.equal(10);
      expect(body.totalPrice).to.equal(20);
      expect(body.seatNumber[0]).to.equal(5);
      expect(body.paymentReference).to.equal('ch_1HiCaI2eZvKYlo2CsnhbyVsJ');
      expect(body.paymentStatus).to.equal('pending');
      expect(body.purchaseDate).to.equal(order.purchaseDate.toISOString());
      expect(body.language).to.equal('sv');
    });

    it('should return `order id does not exist` if orderId were not found', async () => {
      const order = new Order({
        name: 'Jhon Doe',
        email: 'jdoe@gmail.com',
        location_id: '5f9d5c2269cc111dac056c9e',
        location: 'Stockholm',
        movie_id: '5f9d57c26715be1b4bb655d1',
        movie: 'Nelly Rapp - Monsteragent',
        date_id: '5f9d5d2a7f933a1dcba88a27',
        date: '15/11/2020',
        screening_id: '5f9d5d2a7f933a1dcba88a26',
        screening: '17:00',
        salong: 1,
        place: 'Mall of Scandinavia',
        price: 10,
        totalPrice: 20,
        seatNumber: [
          5,
          6
        ],
        paymentReference: 'ch_1HiCaI2eZvKYlo2CsnhbyVsJ',
        paymentStatus: 'pending',
        purchaseDate: new Date().toISOString(),
        language: 'sv'
      });
      await order.save();

      await supertest(app)
        .get('/order/000000000000000000000000')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  describe('POST /order', () => {
    it('should save order to the database', async () => {
      const seatAvailability = new SeatAvailability({
        purchasedSeats: [],
        screening_id: '5f9d5d2a7f933a1dcba88a28',
      });
      await seatAvailability.save();

      const response = await supertest(app)
        .post('/order')
        .send({
          name: 'Jhon Doe',
          email: 'jdoe@gmail.com',
          location_id: '5f9d5c2269cc111dac056c9e',
          location: 'Stockholm',
          movie_id: '5f9d57c26715be1b4bb655d1',
          movie: 'Nelly Rapp - Monsteragent',
          date_id: '5f9d5d2a7f933a1dcba88a27',
          date: '15/11/2020',
          screening_id: '5f9d5d2a7f933a1dcba88a28',
          screening: '17:00',
          salong: 1,
          place: 'Mall of Scandinavia',
          price: 10,
          totalPrice: 20,
          seatNumber: [
            5,
            6
          ],
          paymentReference: 'ch_1HiCaI2eZvKYlo2CsnhbyVsJ',
          paymentStatus: 'pending',
          purchaseDate: new Date().toISOString(),
          availability_id: seatAvailability._id,
          language: 'sv'
        })
        .expect(200);

      const orderFromDB = await Order.findOne({ _id: response.body._id });

      const { body } = response;

      expect(body._id).to.equal(orderFromDB._id.toString());
      expect(body.name).to.equal(orderFromDB.name);
      expect(body.email).to.equal(orderFromDB.email);
      expect(body.location).to.equal(orderFromDB.location);
      expect(body.location_id).to.equal(orderFromDB.location_id.toString());
      expect(body.movie).to.equal(orderFromDB.movie);
      expect(body.movie_id).to.equal(orderFromDB.movie_id.toString());
      expect(body.date).to.equal(orderFromDB.date);
      expect(body.date_id).to.equal(orderFromDB.date_id.toString());
      expect(body.screening).to.equal(orderFromDB.screening);
      expect(body.screening_id).to.equal(orderFromDB.screening_id.toString());
      expect(body.salong).to.equal(orderFromDB.salong);
      expect(body.place).to.equal(orderFromDB.place);
      expect(body.price).to.equal(orderFromDB.price);
      expect(body.totalPrice).to.equal(orderFromDB.totalPrice);
      expect(body.seatNumber[0]).to.equal(orderFromDB.seatNumber[0]);
      expect(body.paymentReference).to.equal(orderFromDB.paymentReference);
      expect(body.paymentStatus).to.equal(orderFromDB.paymentStatus);
      expect(body.purchaseDate).to.equal(orderFromDB.purchaseDate.toISOString());
    });

    it('should save return 400 if any data required is not sent in body request', async () => {
      await supertest(app)
        .post('/order')
        .send({
          location_id: '5f9d5c2269cc111dac056c9e',
          location: 'Stockholm',
          movie_id: '5f9d57c26715be1b4bb655d1',
          movie: 'Nelly Rapp - Monsteragent',
          date_id: '5f9d5d2a7f933a1dcba88a27',
          date: '15/11/2020',
          screening_id: '5f9d5d2a7f933a1dcba88a28',
          screening: '17:00',
          salong: 1,
          place: 'Mall of Scandinavia',
          price: 10,
          totalPrice: 20,
          seatNumber: [
            5,
            6
          ],
          paymentReference: 'ch_1HiCaI2eZvKYlo2CsnhbyVsJ',
          paymentStatus: 'pending',
          purchaseDate: new Date().toISOString(),
          availability_id: '123abc',
          language: 'sv'
        })
        .expect(400, {
          message: 'please include name, email, location_id, location, movie_id, movie, date_id, date, screening_id, screening,  place, salong, price,totalPrice, seatNumber, paymentReference, paymentStatus, purchaseDate',
        });
    });
  });

  describe('PATCH /order/:sessionId', () => {
    it('should update a payment status in database', async () => {
      const order = new Order({
        name: 'Jhon Doe',
        email: 'jdoe@gmail.com',
        location_id: '5f9d5c2269cc111dac056c9e',
        location: 'Stockholm',
        movie_id: '5f9d57c26715be1b4bb655d1',
        movie: 'Nelly Rapp - Monsteragent',
        date_id: '5f9d5d2a7f933a1dcba88a27',
        date: '15/11/2020',
        screening_id: '5f9d5d2a7f933a1dcba88a26',
        screening: '17:00',
        salong: 1,
        place: 'Mall of Scandinavia',
        price: 10,
        totalPrice: 20,
        seatNumber: [
          5,
          6
        ],
        paymentReference: 'ch_1HiCaI2eZvKYlo2CsnhbyVsJ',
        paymentStatus: 'pending',
        purchaseDate: new Date().toISOString(),
        language: 'sv'
      });
      await order.save();
      const response = await supertest(app)
        .patch(`/order/${order.paymentReference}`)
        .send({
          newPaymentStatus: 'succes',
        });

      const body = response.body.order;
      const foundUpdatedOrder = await Order.findOne({ _id: body._id });
      expect(foundUpdatedOrder.paymentStatus).to.equal('succes');
    });

    it('should return `sessionId does not exist` if no match found for patch', async () => {
      const order = new Order({
        name: 'Jhon Doe',
        email: 'jdoe@gmail.com',
        location_id: '5f9d5c2269cc111dac056c9e',
        location: 'Stockholm',
        movie_id: '5f9d57c26715be1b4bb655d1',
        movie: 'Nelly Rapp - Monsteragent',
        date_id: '5f9d5d2a7f933a1dcba88a27',
        date: '15/11/2020',
        screening_id: '5f9d5d2a7f933a1dcba88a26',
        screening: '17:00',
        salong: 1,
        place: 'Mall of Scandinavia',
        price: 10,
        totalPrice: 20,
        seatNumber: [
          5,
          6
        ],
        paymentReference: 'ch_1HiCaI2eZvKYlo2CsnhbyVsJ',
        paymentStatus: 'pending',
        purchaseDate: new Date().toISOString(),
        language: 'sv'
      });
      await order.save();
      await supertest(app)
        .patch('/order/wrong.order.paymentReference')
        .send({
          newPaymentStatus: 'succes',
        }).expect(404, { message: 'sessionId does not exist' });
    });

    it('should save return 400 if any data required is not sent in body request', async () => {
      const order = new Order({
        name: 'Jhon Doe',
        email: 'jdoe@gmail.com',
        location_id: '5f9d5c2269cc111dac056c9e',
        location: 'Stockholm',
        movie_id: '5f9d57c26715be1b4bb655d1',
        movie: 'Nelly Rapp - Monsteragent',
        date_id: '5f9d5d2a7f933a1dcba88a27',
        date: '15/11/2020',
        screening_id: '5f9d5d2a7f933a1dcba88a26',
        screening: '17:00',
        salong: 1,
        place: 'Mall of Scandinavia',
        price: 10,
        totalPrice: 20,
        seatNumber: [
          5,
          6
        ],
        paymentReference: 'ch_1HiCaI2eZvKYlo2CsnhbyVsJ',
        paymentStatus: 'pending',
        purchaseDate: new Date().toISOString(),
        language: 'sv'
      });
      await order.save();
      await supertest(app)
        .patch(`/order/${order.paymentReference}`)
        .send({ })
        .expect(400, { message: 'please include newPaymentStatus' });
    });
  });

  describe('DELETE /order/:sessionId', () => {
    it('should delete a particular order and seats', async () => {
      const seatAvailability = new SeatAvailability({
        screening_id: '5f9d5d2a7f933a1dcba88a26',
        purchasedSeats: [4, 5, 6],
      });
      await seatAvailability.save();

      const order = new Order({
        name: 'Jhon Doe',
        email: 'jdoe@gmail.com',
        location_id: '5f9d5c2269cc111dac056c9e',
        location: 'Stockholm',
        movie_id: '5f9d57c26715be1b4bb655d1',
        movie: 'Nelly Rapp - Monsteragent',
        date_id: '5f9d5d2a7f933a1dcba88a27',
        date: '15/11/2020',
        screening_id: '5f9d5d2a7f933a1dcba88a26',
        screening: '17:00',
        salong: 1,
        place: 'Mall of Scandinavia',
        price: 10,
        totalPrice: 20,
        seatNumber: [
          5,
          6
        ],
        paymentReference: 'ch_1HiCaI2eZvKYlo2CsnhbyVsJ',
        paymentStatus: 'pending',
        purchaseDate: new Date().toISOString(),
        language: 'sv'
      });
      await order.save();

      const response = await supertest(app)
        .delete(`/order/${order.paymentReference}`)
        .set('Accept', 'application/json')
        .expect(204);

      // eslint-disable-next-line no-unused-expressions
      expect(response.body).to.be.empty;
    });

    it('should return `seats were not found in seatAvailability` if seatNumber were not include in seatAvalability', async () => {
      const order = new Order({
        name: 'Jhon Doe',
        email: 'jdoe@gmail.com',
        location_id: '5f9d5c2269cc111dac056c9e',
        location: 'Stockholm',
        movie_id: '5f9d57c26715be1b4bb655d1',
        movie: 'Nelly Rapp - Monsteragent',
        date_id: '5f9d5d2a7f933a1dcba88a27',
        date: '15/11/2020',
        screening_id: '5f9d5d2a7f933a1dcba88a26',
        screening: '17:00',
        salong: 1,
        place: 'Mall of Scandinavia',
        price: 10,
        totalPrice: 20,
        seatNumber: [
          5,
          6
        ],
        paymentReference: 'ch_1HiCaI2eZvKYlo2CsnhbyVsJ',
        paymentStatus: 'pending',
        purchaseDate: new Date().toISOString(),
        language: 'sv'
      });
      const seatAvailability = new SeatAvailability({
        screening_id: '5f9d5d2a7f933a1dcba88a26',
        purchasedSeats: [
          1, 2],
      });
      await order.save();
      await seatAvailability.save();
      await supertest(app)
        .delete(`/order/${order.paymentReference}`)
        .set('Accept', 'application/json')
        .expect(404, { message: 'seats were not found in seatAvailability' });
    });

    it('should return `sessionId does not exist` if no match found for delete', async () => {
      const order = new Order({
        name: 'Jhon Doe',
        email: 'jdoe@gmail.com',
        location_id: '5f9d5c2269cc111dac056c9e',
        location: 'Stockholm',
        movie_id: '5f9d57c26715be1b4bb655d1',
        movie: 'Nelly Rapp - Monsteragent',
        date_id: '5f9d5d2a7f933a1dcba88a27',
        date: '15/11/2020',
        screening_id: '5f9d5d2a7f933a1dcba88a26',
        screening: '17:00',
        salong: 1,
        place: 'Mall of Scandinavia',
        price: 10,
        totalPrice: 20,
        seatNumber: [
          5,
          6
        ],
        paymentReference: 'ch_1HiCaI2eZvKYlo2CsnhbyVsJ',
        paymentStatus: 'pending',
        purchaseDate: new Date().toISOString(),
        language: 'sv'
      });
      await order.save();
      await supertest(app)
        .delete('/order/wrong.order.paymentReference')
        .expect(404, { message: 'order does not exist' });
    });
  });
});
