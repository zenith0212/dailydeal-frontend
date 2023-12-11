const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [true, "Please provide email"],
    },
    name:{
        type: String,
        require: [true, 'Please provide productID']
    },
    product_name:{
        type: String
    },
    contents:{
        type: String
    },
    mark: {
        type: Number,
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model.Review || mongoose.model("Review", ReviewSchema);