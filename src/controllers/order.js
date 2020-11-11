/* eslint-disable no-console */
const express = require('express');
const sgMail = require('@sendgrid/mail');
const Order = require('../models/order');
const SeatAvailability = require('../models/seatAvailability');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const orderRouter = express.Router();

const buildEmailContent = (name, movie, location, place, salong, date, screening, seatNumber, totalPrice) => `<html lang="en">
            <head>
             <title>Ticket details</title>
           </head >
            <body>
              <h2 style="font-size: 1.5em; color: white; background-color: rgb(39, 7, 90); padding: 20px; margin: 0px">Cinema CR
              </h2>
              <h2>Hi ${name}</h2>
               <h3> You can find details about your purchase in Cinema CR here:</h2>
               <h2>Ticket details</h2>
                 <hr />
                   <div>
                      <div style="text-align: center;">
                                  <table style="background-color: rgb(175, 168, 235); border-spacing: 0;">
                                      <tbody style="font-size: 1em; padding: 20px">
                                          <tr>
                                              <td style="font-size: 1em; padding: 10px 15px; justify-content: center;">
                                                  <strong>Movie</strong>
                                              </td>
                                              <td style="font-size: 1em; padding: 10px 15px; justify-content: center;">
                                                  <strong>Location</strong>
                                              </td>
                                               <td style="font-size: 1em; padding: 10px 15px; justify-content: center;">
                                                  <strong>Place</strong>
                                              </td>
                                               <td style="font-size: 1em; padding: 10px 15px; justify-content: center;">
                                                  <strong>Screen</strong>
                                              </td>
                                              <td style="font-size: 1em; padding: 10px 15px; justify-content: center;">
                                                  <strong>Date</strong>
                                              </td>
                                              <td style="font-size: 1em; padding: 10px 15px; justify-content: center;">
                                                  <strong>Hour</strong>
                                              </td>
                                              <td style="font-size: 1em; padding: 10px 15px; justify-content: center;">
                                                  <strong>Tickets</strong>
                                              </td>
                                              <td style="font-size: 1em; padding: 10px 15px; justify-content: center;">
                                                  <strong>Seats</strong>
                                              </td>
                                              <td style="font-size: 1em; padding: 10px 15px; justify-content: center;">
                                                  <strong>Total</strong>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td style="justify-content: center;">${movie}</td>
                                              <td style="justify-content: center; ">${location}</td>
                                              <td style="justify-content: center; ">${place}</td>
                                              <td style="justify-content: center; ">${salong}</td>
                                              <td style="justify-content: center;">${date}</td>
                                              <td style="justify-content: center; ">${screening}</td>
                                              <td style="justify-content: center; ">${seatNumber.length}</td>
                                              <td style="justify-content: center; ">${seatNumber}</td>
                                              <td style="justify-content: center; ">${totalPrice}</td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                          <h5>If you any problem with your purchase please write to cinema_cr@outlook.com</h5>
                          <h3>Thanks for your purchase in Cinema CR!</h3>
                          <h2>Enjoy your movie!</h2>
                          <hr/>
                      </body>
                     </html >`;

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

orderRouter.patch('/:sessionId', async (req, res) => {
  const { newPaymentStatus } = req.body;

  try {
    const order = await Order.findOne({
      paymentReference: req.params.sessionId,
    });
    if (!order) {
      res.status(404).json({ message: 'order does not exist' });
    } else {
      await Order.updateOne(
        { _id: order._id },
        { $set: { paymentStatus: newPaymentStatus } }
      );

      order.paymentStatus = newPaymentStatus;
      res.send({ order });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
    ) {
      // sengrid-------------------------
      const msg = {
        to: email,
        from: 'priscilahistoria@gmail.com',
        subject: 'Cinema CR Tickets',
        text: 'Ticket details',
        // eslint-disable-next-line max-len
        html: buildEmailContent(name, movie, location, place, salong, date, screening, seatNumber, totalPrice),
      };
      sgMail.send(msg).then((r) => {
        console.log('Email sent', r);
      });
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
      });
      await order.save();
      return res.json(order);
    }
    return res.status(400).json({
      message:
        'please include name, email, location_id, location, movie_id, movie, date_id, date, screening_id, screening, price,totalPrice, seatNumber,paymentReference,paymentStatus',
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// Here I need delete order and seats selected in SeatAvailability Collection
orderRouter.delete('/:sessionId', async (req, res) => {
  try {
    const order = await Order.findOne({
      paymentReference: req.params.sessionId,
    });
    const seatsfromDB = await SeatAvailability.findOne({
      screening_id: order.screening_id,
    });
    const userSelectedSeats = order.seatNumber;
    if (!order) {
      return res.status(404).json({ message: 'order does not exist' });
    }
    await Order.deleteOne({ _id: order._id });
    if (
      seatsfromDB.purchasedSeats.some((seat) => userSelectedSeats.includes(seat))
    ) {
      const finalSeats = seatsfromDB.purchasedSeats.filter(
        (seatFromDB) => !userSelectedSeats.includes(seatFromDB)
      );

      await SeatAvailability.updateOne(
        { _id: seatsfromDB._id },
        { $set: { purchasedSeats: finalSeats } }
      );
    }
    return res.status(204).send({ _id: order._id });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

module.exports = orderRouter;
