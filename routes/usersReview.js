const Review = require("../db/Model/reviewModel");
const express = require("express");
const router = express.Router();

router.post('/', async (request, response) => {

  const review = new Review({
    email: request.body.email,
    name: request.body.name,
    product_name: request.body.product_name,
    contents: request.body.contents,
    mark: request.body.mark
  });

  await Review.findOne({ email: request.body.email })
    .then((result) => {
      review.save()
        .then((r) => {
          response.status(201).send({
            message: 'Sent your Reviews Successfully!',
            r
          })
        })
    })
    .catch((error) => {
      response.status(500).send({
        message: "Please register your all information!",
        error
      })
    })
});

router.get('/', async (request, response) => {
  try {
    if (request.query.product_name === undefined) {
      const data = await Review.find();
      response.json(data);
    } else {
      const data = await Review.find({ product_name: request.query.product_name });
      response.json(data);
    }
  } catch {
    response.status(500).json({ message: error.message })
  }
})

module.exports = router;