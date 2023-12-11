const express = require("express");
const router = express.Router();
const OrderData = require('../db/Model/orderModel');
const User =  require('../db/Model/userModel');

router.get('/', async(request, response)=>{
    try{
        const customers = await User.find();
        const total_order = await OrderData.find();
        var total_sale = 0;
        for(var i=0; i<total_order.length; i++){

            if(total_order[i].order_amount !== undefined){
                total_sale += total_order[i].order_amount;
            }

        }
        const today_order = await OrderData.find({order_date: request.query.date});
        var today_sale = 0;
        for(var i=0; i<today_order.length; i++){
            if(today_order[i].order_amount !== undefined){
                today_sale += today_order[i].order_amount;
            }
        }
        response.json({customers: customers.length, total_sale: total_sale, today_sale: today_sale, new_order: today_order.length})

    } catch(error){
        response.status(500).json({message:error.message})
    }
})

module.exports = router;