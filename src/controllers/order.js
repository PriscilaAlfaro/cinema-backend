/* eslint-disable no-console */
const express = require('express');
const sgMail = require('@sendgrid/mail');
const fs = require('fs').promises;
const path = require('path');
const Handlebars = require('handlebars');
const Order = require('../models/order');
const SeatAvailability = require('../models/seatAvailability');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const orderRouter = express.Router();

orderRouter.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId });
    if (!order) {
      res.status(404).json({ message: 'order id does not exist' });
    } else {
      res.send(order);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post data in order and update the seatSelected in SeatAvailability
orderRouter.post('/', async (req, res) => {
  const {
    name,
    email,
    location_id,
    location,
    place,
    salong,
    movie_id,
    movie,
    date_id,
    date,
    screening_id,
    screening,
    price,
    totalPrice,
    seatNumber,
    paymentReference,
    paymentStatus,
    purchaseDate,
    availability_id,
    language
  } = req.body;

  try {
    if (
      name
      && email
      && location_id
      && location
      && place
      && salong
      && movie_id
      && movie
      && date_id
      && date
      && screening_id
      && screening
      && price
      && totalPrice
      && seatNumber
      && paymentReference
      && paymentStatus
      && purchaseDate
      && availability_id
      && language
    ) {
      // data base ------------------------

      const order = new Order({
        name,
        email,
        location_id,
        location,
        place,
        salong,
        movie_id,
        movie,
        date_id,
        date,
        screening_id,
        screening,
        price,
        totalPrice,
        seatNumber,
        paymentReference,
        paymentStatus,
        purchaseDate,
        availability_id,
        language
      });

      // case order have seatNumber
      if (seatNumber.length > 0) {
        const purchasedSeatsfromDB = await SeatAvailability.findOne({
          _id: availability_id,
        });

        // case the seats were not available
        if (
          purchasedSeatsfromDB.purchasedSeats.some((seat) => seatNumber.includes(seat))
        ) {
          return res.status(400).json('The seats has been already purchased');
        }

        // case seats were available
        const updatedPurchasedSeats = [
          ...purchasedSeatsfromDB.purchasedSeats,
          ...seatNumber,
        ];

        // order is save until the seats were checked to be update
        await order.save();
        await SeatAvailability.updateOne(
          { _id: availability_id },
          { $set: { purchasedSeats: updatedPurchasedSeats } }
        );

        return res.send({ ...order.toObject(), updatedPurchasedSeats: 'success' });
      }
    }
    // case order dont have seatNumber
    return res.status(400).json({
      message:
        'please include name, email, location_id, location, movie_id, movie, date_id, date, screening_id, screening,  place, salong, price,totalPrice, seatNumber, paymentReference, paymentStatus, purchaseDate',
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// email based on language to use in patch
const buildEmailContent = async (name, movie, location, place, salong, date,
  screening, seatNumber, totalPrice, language) => {
  try {
    const context = {
      name: name.split(' ')[0],
      movie,
      location,
      place,
      salong,
      date,
      screening,
      seatNumber,
      totalPrice,
      language

    };

    const html = await fs.readFile(path.join(__dirname, `../emailTemplate/tickets-${language}.html`));
    const template = Handlebars.compile(html.toString());
    const compiledHTML = template(context);
    return compiledHTML;
  } catch (error) {
    return error;
  }
};

// Here we update the status of the order and send the email when user pay
orderRouter.patch('/:sessionId', async (req, res) => {
  const { newPaymentStatus } = req.body;

  try {
    if (newPaymentStatus) {
      const order = await Order.findOne({
        paymentReference: req.params.sessionId,
      });
      if (!order) {
        res.status(404).json({ message: 'sessionId does not exist' });
      }

      const orderUpdated = await Order.updateOne(
        { _id: order._id },
        { $set: { paymentStatus: newPaymentStatus } }
      );

      // sengrid----email is sent until the information was found and updated
      if (order && orderUpdated) {
        const msg = {
          to: order.email,
          from: 'priscilahistoria@gmail.com',
          subject: 'Cinema CR Tickets',
          text: 'Cinema CR Tickets',

          html: await buildEmailContent(order.name, order.movie, order.location,
            order.place, order.salong, order.date, order.screening, order.seatNumber,
            order.totalPrice, order.language),
        };

        if (process.env.NODE_ENV !== 'test') {
          const emailResponse = await sgMail.send(msg);
          console.log('Email sent', emailResponse);
        }
      }
      // --------------------------

      order.paymentStatus = newPaymentStatus;
      return res.send({ order });
    }
    return res.status(400).json({
      message:
        'please include newPaymentStatus',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Here we need delete order and seats selected in SeatAvailability Collection in case of cancelled
orderRouter.delete('/:sessionId', async (req, res) => {
  try {
    const order = await Order.findOne({
      paymentReference: req.params.sessionId,
    });

    if (!order) {
      return res.status(404).json({ message: 'order does not exist' });
    }

    const seatsfromDB = await SeatAvailability.findOne({
      screening_id: order.screening_id,
    });

    const userSelectedSeats = order.seatNumber;

    // case seats were not in seatAvailabity
    if (!seatsfromDB.purchasedSeats.some((seat) => userSelectedSeats.includes(seat))) {
      return res.status(404).json({ message: 'seats were not found in seatAvailability' });
    }

    const finalSeats = seatsfromDB.purchasedSeats.filter(
      (seatFromDB) => !userSelectedSeats.includes(seatFromDB)
    );

    // both deletions are made together after validation
    await Order.deleteOne({ _id: order._id });
    await SeatAvailability.updateOne(
      { _id: seatsfromDB._id },
      { $set: { purchasedSeats: finalSeats } }
    );
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

module.exports = orderRouter;
