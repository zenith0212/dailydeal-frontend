const mongoose = require("mongoose");

const ShippingSchema = new mongoose.Schema({
    email:{
        type:String,
        require: "Require Email"
    },
    first_name: {
        type: String,
        unique: false
    },

    last_name: {
        type: String,
    },
    contact_number:{
        type: Number
    },
    alternate_number:{
        type: Number
    },
    address_email: {
        type: String,
    },

    street_address: {
        type: String,
    },

    city: {
        type: String,
    },

    zip_code: {
        type: Number,
    },
    state:{
        type:String,
    },
    country:{
        type:String
    },
    delivery_instruction:{
        type: String
    },
    preferred:{
        type: Boolean,
    }
});

module.exports = mongoose.model.Shipping || mongoose.model("Shipping", ShippingSchema);