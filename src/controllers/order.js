const express = require('express');
const Order = require('../models/order');

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


orderRouter.post('/', async (req, res) => {
    const { name, email, location_id, location, movie_id, movie, date_id, date, screening_id, screening, price, totalPrice, seatNumber, paymentReference, paymentStatus } = req.body;
    try {
        if (name && email && location_id && location && movie_id && movie && date_id && date && screening_id && screening && price && totalPrice && seatNumber && paymentReference && paymentStatus) {
            const order = new Order({
                name, email, location_id, location, movie_id, movie, date_id, date, screening_id, screening, price, totalPrice, seatNumber, paymentReference, paymentStatus
            });
            await order.save();
            return res.json(order);
        }
        return res
            .status(400)
            .json({ message: 'please include  name, email, location_id, location, movie_id, movie, date_id, date, screening_id, screening, price, totalPrice, seatNumber, paymentReference, paymentStatus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

module.exports = orderRouter;