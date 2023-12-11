const mongoose = require("mongoose");

const OurProductSchema = new mongoose.Schema({

    product_id: {
        type: String,
        require: [true, "Product id"]
    },

    variation_id: {
        type: Array,
        require: [true, "Variation id"]
    },
    
    product_image: {
        type: String,
        require: [true, "Image Path"]
    },
    product_name: {
        type: String,
        required: [true, "Cart Name!"],
        unique: [false],
    },
    sale_price: {
        type: Number,
        required: [true, "Product price"],
        unique: [false],
    },
    regular_price: {
        type: Number,
        required: [true, "Regular price"],
        unique: [false],
    },
    post_date: {
        type: Date,
        required: [true, "post date"],
        unique: [false],
    },
});



module.exports = mongoose.model.OurProduct || mongoose.model("OurProduct", OurProductSchema);