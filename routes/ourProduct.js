const OurProduct = require("../db/Model/ourProduct");
const express = require("express");
const router = express.Router();

router.get('/', async (request, response) => {
    try {
        // const total = await OurProduct.find();
        console.log(request.query)
        const search = {};
        if (request.query.sort === "Date") {
            search["post_date"] = 1;
        }
        if (request.query.sort === "Price") {
            search["sale_price"] = 1;
        }
        if (request.query.sort === "Name") {
            search["product_name"] = 1;
        }
        console.log(search);
        const data = await OurProduct.find({ "product_name": { $regex: request.query.search } }).sort(search).limit(request.query.pageSize).skip(request.query.pageSize * (request.query.page - 1));
        console.log(data)
        response.json(data)
    }
    catch (error) {
        console.log(error)
        response.status(500).json({ message: error.message })
    }
})

//update to ourProduct
router.put('/:product_id', (request, response) => {
    // console.log(request.params.product_id, typeof request.body.post_date, request.body.post_date);
    const t1 = new Date(request.body.post_date);
    t1.setHours(8, 0, 0, 0);
    const t2 = new Date(t1);
    t2.setDate(t1.getDate() + 1);
    console.log(t1, t2)
    OurProduct.find({
        post_date: {
            "$gte": t1,
            "$lt": t2,
        },
        product_id: {"$ne": request.params.product_id}
    }).count().then( count => {
        console.log(count)
        if (count < 2) {
            OurProduct.findOneAndUpdate({ product_id: request.params.product_id }, { post_date: request.body.post_date, sale_price: request.body.sale_price })
                .then((product => {
                    response.send({
                        message: 'Updated successfully!'
                    })
                }))
        }
        else {
            console.log("Already two produsts are existed");
            response.send({
                message: "Already two produsts are existed"
            })
        }
    }).catch(err => console.log(err))
})

//add to cart
router.post("/", (request, response) => {

    OurProduct.findOne({ product_name: request.body.name })
        .then((product) => {
            response.send({
                message: "You already added this product.",
                product_name: product.product_name,
            });
        })
        .catch(async (product) => {

            const day = await OurProduct.find({ post_date: request.body.post_date });
            console.log(day);
            if (day.length >= 2) {
                response.send({
                    message: "You already added two products with this day."
                });
                return
            }

            // create a new user instance and collect the data
            const ourProduct = new OurProduct({
                product_id: request.body.id,
                variation_id: request.body.variation_id,
                product_image: request.body.image,
                product_name: request.body.name,
                sale_price: request.body.sale_price,
                regular_price: request.body.regular_price,
                post_date: request.body.post_date,
            });

            // save the new user
            ourProduct
                .save()
                // return success if the new user is added to the database successfully
                .then((result) => {
                    response.status(201).send({
                        message: "Product was added to your products list",
                        result,
                    });
                })
                // catch error if the new user wasn't added successfully to the database
                .catch((error) => {
                    response.status(500).send({
                        message: "Error creating user",
                        error,
                    });
                });
        });
});


router.delete('/:product_id', (request, response) => {

    OurProduct.deleteOne({ product_id: request.params.product_id })
        .then((product) => {
            // console.log(product);
            response.send({
                message: request.params.product_id + " was removed!!",
                product_id: request.params.product_id
            });
        });
});

module.exports = router;