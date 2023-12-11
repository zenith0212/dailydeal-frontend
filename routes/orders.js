const express = require("express");
const router = express.Router();
const OrderData = require('../db/Model/orderModel');

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

router.get('/', async (request, response) => {

    try {
        // if(request)
        if (Object.keys(request.query)[0] == 'order_id') {
            const data = await OrderData.find({ order_id: request.query.order_id });
            response.json(data);
        } else if (Object.keys(request.query)[0] == 'email') {
            const data = await OrderData.find({ order_email: request.query.email });
            response.json(data);
        }
    }
    catch (error) {
        response.status(500).json({ message: error.message })
    }
});

const getSale = async (date) => {
    const data = await OrderData.find().where('order_date').gt(date);
    var result = [];
    var sum = 0;
    if (data.length !== 0) {
        var line_date = formatDate(data[0].order_date);
        for (var i = 0; i < data.length; i++) {
            if (formatDate(data[i].order_date) === line_date) {
                sum += data[i].order_amount;
            } else {
                result.push({ amount: sum, day: line_date });
                line_date = formatDate(data[i].order_date);
                sum = data[i].order_amount;
            }
            if (i === data.length - 1)
                result.push({ amount: sum, day: line_date });
        }
        // console.log(result);
    }
    return result;
}
const getMonthSale = async (date) => {
    const today = new Date();
    const data = await OrderData.find().where('order_date').gt(date);
    var result = [];
    var sum = 0;
    if (data.length !== 0) {
        var line_date = data[0].order_date.getMonth();

        for (var i = 0; i < data.length; i++) {
            if (data[i].order_date.getMonth() === line_date) {
                sum += data[i].order_amount;
            } else {
                result.push({ amount: sum, day: formatDate(today.setMonth(line_date)) });
                line_date = data[i].order_date.getMonth();
                sum = data[i].order_amount;
            }
            if (i === data.length - 1)
                result.push({ amount: sum, day: formatDate(today.setMonth(line_date)) });
        }
    }
    return result;
}
router.get('/sale', async (request, response) => {
    try {
        // const data = await OrderData.find().where('order_date').gt(request.query.start_day);
        // var result = [];
        var result;
        if (request.query.duration == 7 || request.query.duration == 30) {
            // console.log(request.query.start_day);
            result = await getSale(request.query.start_day);
        }
        else if (request.query.duration == 12 || request.query.duration == 6) {
            result = await getMonthSale(request.query.start_day);
            // console.log(result);
        }
        response.json(result);

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

module.exports = router;