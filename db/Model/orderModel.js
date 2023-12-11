const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

    order_id: {
        type: Number,
        require: [true, "Empty OrderID"],
        unique: false
    },

    name: {
        type: String,
    },
    order_amount:{
        type: Number
    },

    order_email: {
        type: String,
        require: [true, "Need Email"]
    },

    product_name: {
        type: String,
    },

    address: {
        type: String,
    },

    status: {
        type: String,
    },
    order_date:{
        type:Date,
        default: Date.now
    }
});



module.exports = mongoose.model.OrderData || mongoose.model("OrderData", OrderSchema);