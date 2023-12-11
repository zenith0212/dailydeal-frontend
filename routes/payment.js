const axios = require("axios").default;
const express = require("express");
const router = express.Router();
const stripe = require('stripe')('sk_test_51HjQPwHUGttVuI2venbCu58Mp3U8Kb3pGN98pzBO0HHWgZ9VrqGYVuUnwGTpZqguAVzSdbEVk2oYhHE3ZIRVmTXn00drS76eYn')
// const axios = require('axios');
const OrderData = require('../db/Model/orderModel');

var orderID = 456;
router.post ('/', async (request, response) => {
    var order_details = {
        order_id: request.body.order_id,
        line_items: request.body.line_items,
        shipping: request.body.shipping,
        date: request.body.date,
        email: request.body.email,
        amount: request.body.amount *100
    }
    
    try {
        // Create the PaymentIntent
        let intent = await stripe.paymentIntents.create({
            payment_method: request.body.payment_method_id,
            description: "Test payment",
            amount: request.body.amount,
            currency: 'usd',
            confirmation_method: 'manual',
            confirm: true
        });
        // Send the response to the client
        const result = await generateResponse(intent, order_details);

        response.send(result);
    } catch (e) {
        // Display error on client
        return response.send({ error: e.message });
    }
});

router.post('/paypal', async(req, res)=>{
    const intent = {status: 'succeeded'}
    var order_details = {
        order_id: req.body.order_id,
        line_items: req.body.line_items,
        shipping: req.body.shipping,
        email: req.body.email,
        amount: req.body.amount
    }
    console.log(order_details);
    const result = await generateResponse(intent, order_details);

    res.send(result);
})
const generateResponse = async (intent, order_details) => {
    if (intent.status === 'succeeded') {

        try {
            const res = await axios({
                url: 'https://nova.shopwoo.com/api/v1/orders?store_id=2',
                method: 'post',
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Basic c3RldmVAbmV3bWlyYS5jb20gOnN3NDg0NCEh',
                    'Content-Type': 'application/json'
                },
                data: order_details
            });

            
            orderID = res.data.id;
            const orderData = new OrderData({
                order_id: orderID,
                order_email: order_details.email,
                order_amount: order_details.amount,
            });
    
            orderData.save();
        }
        catch (error) {
            orderID = error.response.data.message;
        }

        return {
            orderID: orderID
        }
    } else {
        // Invalid statusy
        return {
            error: 'Invalid PaymentIntent status'
        };
    }
};



module.exports = router;