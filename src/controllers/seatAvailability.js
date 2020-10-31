const express = require('express');
const SeatAvailability = require('../models/seatAvailability');

const seatAvailabilityRouter = express.Router();

seatAvailabilityRouter.get('/', async (req, res) => {
    try {
        const seatAvailability = await SeatAvailability.find();
        return res.json(seatAvailability);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

seatAvailabilityRouter.post('/', async (req, res) => {
    const { screening_id, purchasedSeats } = req.body;
    try {
        if (screening_id && purchasedSeats) {
            const seatAvailability = new SeatAvailability({
                screening_id, purchasedSeats
            });
            await seatAvailability.save();
            return res.json(seatAvailability);
        }
        return res
            .status(400)
            .json({ message: 'please include screening_id, seatsAvailable and array purchasedSeats' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


seatAvailabilityRouter.patch('/:seatAvalabilityId', async (req, res) => {
    const { purchasedSeats } = req.body;

    try {

        if (purchasedSeats && purchasedSeats.length > 0) {
            const purchasedSeatsfromDB = await SeatAvailability.findOne({ _id: req.params.seatAvalabilityId });

            if (purchasedSeatsfromDB.purchasedSeats.some(seat => purchasedSeats.includes(seat))) {
                return res.json("The seats has been already purchased")
            } else {

                const updatedPurchasedSeats = [...purchasedSeatsfromDB.purchasedSeats, ...purchasedSeats];

                await SeatAvailability.updateOne(
                    { _id: req.params.seatAvalabilityId },
                    { $set: { purchasedSeats: updatedPurchasedSeats } }
                )
                return res.send({ _id: req.params.seatAvalabilityId, purchaseSeats: purchasedSeats });
            }
        }
        return res
            .status(400)
            .json({ message: 'please include selectedSeats' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = seatAvailabilityRouter;