const WishList = require("../db/Model/wishlistModel");
const OurProduct = require("../db/Model/ourProduct");
const express = require("express");
const router = express.Router();
const auth = require('../auth');

router.post('/add', auth, async (request, response) => {
    const wishlist = new WishList({
        email: request.body.email,
        product_id: request.body.product_id
    });
    try {
        const productList = await WishList.find({ email: request.body.email })
        for (var i = 0; i < productList.length; i++) {
            if (productList[i].product_id == request.body.product_id) {
                response.send({
                    message: "You already added this product to your wishlist"
                });
                return;
            }
        }
        wishlist.save()
            .then((result) => {
                response.status(201).send({
                    message: 'you added successfully!',
                    result,
                })
            })
            .catch((error) => {
                response.status(500).send({
                    message: "Error adding product",
                    error,
                });
            });

    }
    catch (error) {

    }
});
router.get('/count', async (request, response) => {
    try {
        const wishList = await WishList.find();
        var idList = []
        for (var i = 0; i < wishList.length; i++) {
            idList.push(wishList[i].product_id)
        }
        let uniqueList = [...new Set(idList)];

        let uniqueItems = [];
        for (var i = 0; i < uniqueList.length; i++) {
            const uniqueItem = await WishList.find({ product_id: uniqueList[i] });
            uniqueItems.push(uniqueItem);
        }
        var final = []
        for (var i = 0; i < uniqueItems.length; i++) {
            const uniqueItem = await OurProduct.find({ product_id: uniqueItems[i][0].product_id });
            if(uniqueItem.length === 0){
                continue;
            }else{
                final.push({ product_id: uniqueItem[0].product_id, product_name: uniqueItem[0].product_name, count: uniqueItems[i].length });
            }
            // console.log(uniqueItem[0].product_name)
        }
        response.json(final);
    }
    catch (error) {
        response.status(500).json({ message: error.message })
    }
})
router.get('/', async (request, response) => {

    try {
        const productIdList = await WishList.find();
        var porductDetails = [];
        for (var i = 0; i < productIdList.length; i++) {
            var merged_data;

            const data = await OurProduct.findOne({ product_id: productIdList[i].product_id })
            // porductDetails.push(data);
            if(data===null){
                continue;
            }else{   
                merged_data = data;
                merged_data = { ...merged_data._doc, email: productIdList[i].email }
                // merged_data = merged_data.concat(productIdList[i])
                porductDetails.push(merged_data);
            }
        }

        response.json(porductDetails)
    }

    catch (error) {
        response.status(500).json({ message: error.message })
    }

});

router.post('/', async (request, response) => {

    try {
        const productIdList = await WishList.find({ email: request.body.email });
        var productDetails = [];
        for (var i = 0; i < productIdList.length; i++) {

            const data = await OurProduct.findOne({ product_id: productIdList[i].product_id })
            if (data === null) {
                productDetails.push({product_id:productIdList[i].product_id})
            } else
                productDetails.push(data)
        }

        response.json(productDetails)
    }
    catch (error) {
        response.status(500).json({ message: error.message })
    }
    // const data = await OurProduct.find().where('')
    //   // const test = await OurProduct.find().where('post_date').gt('2023-02-16').lt('2023-02-18')
    // const data = await OurProduct.find().where(request.body.email)

})

router.delete('/:product_id', (request, response) => {

    // console.log("product_id", request.params.product_id)

    WishList.deleteOne({ product_id: request.params.product_id }).where('email', request.body.email)
        .then((product) => {
            // console.log(product);
            response.send({
                message: request.params.product_id + "was removed!!"
            });
        });
});

module.exports = router;