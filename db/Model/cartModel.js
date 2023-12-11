const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({

    product_image: {
        type: String,
        require: [true, "Image Path"]
    },
    product_name: {
        type: String,
        required: [true, "Cart Name!"],
        unique: [false],
    },
    product_quantity: {
        type: Number,
        required: [true, "Product quantity"],
        unique: [false],
    },

});



module.exports = mongoose.model.Cart || mongoose.model("Cart", CartSchema);