const mongoose = require("mongoose");
const Schema = mongoos.Schema;

const tokenSchema = new Schema({
    userId:{
        type:Schema.Type.ObjectId,
        required: true,
        ref: "user",
    },
    token:{
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

module.exports = mongoose.module("token", tokenSchema);