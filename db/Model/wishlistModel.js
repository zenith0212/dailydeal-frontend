const mongoose = require('mongoose');

const WishListSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [true, "Please provide email"],
    },
    product_id:{
        type: String,
        require: [true, 'Please provide productID']
    }
});

module.exports = mongoose.model.WishList || mongoose.model("WishList", WishListSchema);