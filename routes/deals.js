const OurProduct = require("../db/Model/ourProduct");
const WishList = require('../db/Model/wishlistModel');
const express = require("express");
const router = express.Router();
const fuzz = require('fuzzball');
const User = require("../db/Model/userModel");

// const uuidv4 = require('uuid');
const { Novu } = require("@novu/node");
// const {response, application} = require("express"); const sharp =
// require('sharp'); Novu api key
const cron = require('node-cron');

const novu = new Novu("2792de1aa02ee6b16edec7d66f1bcd8b");
const sendNovuNotification = async (recipient, email, name, src, dealname) => {
    try {
        let response = await novu.trigger('wishlist', {
            to: {
                subscriberId: recipient,
                phone: recipient,
                email: email
            },
            payload: {
                name: name,
                dealsrc: src,
                dealname: dealname
            }
        });
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

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
// let localTime = new Date();
// const phonenumber = Math.floor(Math.random() * 1000000) + '5'
// console.log(phonenumber)
// sendNovuNotification(phonenumber, "harryjulin0411@gmail.com", "name","https://cdn.brandsgateway.com/2020/02/643506-white-silk-i-love-italy-cami-t-shirt.jpg", "white silk cami short")
const alertToUsers = async () => {
    let localTime = new Date();

    const phonenumber = Math.floor(Math.random() * 1000000) + '5'
    console.log(phonenumber)
    sendNovuNotification(phonenumber, "harryjulin0411@gmail.com", localTime.toDateString())
    console.log('send notification to whishlist users at 8 AM');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(t1);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayProducts = await OurProduct.find({
        post_date: {
            "$gte": today,
            "$lt": tomorrow
        }
    });
    // console.log(todayProducts[0].product_name); const wishlist = await
    // WishList.find();
    const productIdList = await WishList.find();
    var porductDetails = [];
    for (var i = 0; i < todayProducts.length; i++) {
        // var id = todayProducts[i].product_id;
        var name = todayProducts[i].product_name;
        for (var j = 0; j < productIdList.length; j++) {

            const data = await OurProduct.findOne({ product_id: productIdList[j].product_id })
            // porductDetails.push(data); console.log(productIdList[i].product_id);
            if (!!data === false) {
                continue;
            } else {
                console.log(data);
                var compareName = data.product_name;
                var score = fuzz.partial_ratio(name, compareName);
                if (score >= 50) {
                    console.log(name, compareName, productIdList[j].email);
                    await User
                        .findOne({ email: productIdList[j].email })
                        .then((user) => {
                            phone_number = user.phone_number;
                            sendNovuNotification(user.phone_number, productIdList[j].email, user.first_name + " " + user.last_name, data.product_image, compareName)
                        })
                }
            }
        }
    }
    // console.log(value);
    response.json(todayProducts);
};
cron.schedule('0 8 * * *', alertToUsers, { timeZone: "America/Los_Angeles" });

router.post('/today', async (request, response) => {
    try {
        const today = new Date();
        today.setHours(8, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0)
        console.log(today, tomorrow)

        const todayProducts = await OurProduct.find({
            post_date: {
                "$gte": today,
                "$lt": tomorrow,
            }
        }).limit(2);
        // const productIdList = await WishList.find();
        // var porductDetails = [];
        // for (var i = 0; i < todayProducts.length; i++) {
        //     // var id = todayProducts[i].product_id;
        //     var name = todayProducts[i].product_name;
        //     for (var j = 0; j < productIdList.length; j++) {

        //         const data = await OurProduct.findOne({product_id: productIdList[j].product_id})
        //         // porductDetails.push(data); console.log(productIdList[i].product_id);
        //         if (!!data === false) {
        //             continue;
        //         } else {
        //             console.log(data);
        //             var compareName = data.product_name;
        //             var score = fuzz.partial_ratio(name, compareName);
        //             if (score >= 50) {
        //                 console.log(name, compareName, productIdList[j].email);
        //             }
        //         }
        //     }

        //     // const wishProductList = await
        //     // WishList.find({product_id:productIdList.product_id})

        // }
        // console.log(value);
        response.json(todayProducts);
    } catch (error) {
        response
            .status(500)
            .json({ message: error.message })
    }

});

router.post('/yesterday', async (request, response) => {
    const yesterday = new Date();
    yesterday.setHours(8, 0, 0, 0);
    yesterday.setDate(yesterday.getDate() - 1);
    console.log("yesterday", yesterday)
    try {
        const yesterdayProducts = await OurProduct.find({
            post_date: {
                "$gte": yesterday,
                "$lt": new Date().setHours(8,0,0,0)
            }
        }).limit(2);
        // console.log(request.body.post_date)
        response.json(yesterdayProducts)
    } catch (error) {
        response
            .status(500)
            .json({ message: error.message })
    }

});

router.post('/previous', async (request, response) => {
    try {
        const data = await OurProduct
            .find()
            .where('post_date')
            .gt(request.body.start_date)
            .lt(request.body.end_date)
        // const test = await
        // OurProduct.find().where('post_date').gt('2023-02-16').lt('2023-02-18')
        response.json(data)
    } catch (error) {
        response
            .status(500)
            .json({ message: error.message })
    }

});
const today = new Date();
const start_date = new Date();
const end_date = new Date();
start_date.setDate(today.getDate() - 8);
end_date.setDate(today.getDate() - 1);

router.get('/previous/all', async (request, response) => {
    const pageSize = request.query.pageSize
        ? parseInt(request.query.pageSize)
        : 0;
    const page = request.query.page
        ? parseInt(request.query.page)
        : 0;
    // console.log(end_date)

    try {
        const data = await OurProduct
            .find()
            .where('post_date')
            .lt(end_date)
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        // const test = await
        // OurProduct.find().where('post_date').gt('2023-02-16').lt('2023-02-18')

        response.json(data)
    } catch (error) {
        response
            .status(500)
            .json({ message: error.message })
    }
});

router.get('/previous/count', async (request, response) => {

    const count = await OurProduct
        .find()
        .where('post_date')
        .lt(end_date)
    response.json(count.length)
});

module.exports = router;