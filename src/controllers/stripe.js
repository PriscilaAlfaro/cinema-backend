const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripeRouter = express.Router();

stripeRouter.get("/key", (req, res) => {
    try {
        if (process.env.STRIPE_API_KEY) {
            res.send({ publishableApiKey: process.env.STRIPE_API_KEY });
        } return res
            .status(400)
            .json({
                message: 'there is not STRIPE_API_KEY'
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});


stripeRouter.post('/create-checkout-session', async (req, res) => {
    const { product, price, amount, email } = req.body;
    try {
        if (product && price && amount) {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'sek',
                            product_data: {
                                name: product,
                            },
                            unit_amount: price * 100,
                        },
                        quantity: amount,
                    },
                ],
                mode: 'payment',
                success_url: 'http://localhost:3000/thanks?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'http://localhost:3000/cancelled?session_id={CHECKOUT_SESSION_ID}',
                customerEmail: email,
            });

            res.json({ id: session.id });
        } else {
            return res
                .status(400)
                .json({
                    message: 'please include product, price, amount'
                });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = stripeRouter;