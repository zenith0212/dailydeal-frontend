const mongoose = require("mongoose");

const BrandProductSchema = new mongoose.Schema({

    id: {
        type: Number,
        require: [true, "Product id"]
    },
    sku:{
        type: String
    },
    description:{
        type: String
    },
    regular_price:{
        type: Number
    },
    sale_price:{
        type:Number
    },
    in_stock:{
        type:Boolean
    },
    stock_quantity:{
        type:Number
    },
    stock_status:{
        type:String
    },
    categories: {
        type:Array
    },
    images:{
        type:Array
    },
    attributes:{
        type: Array
    },
    variations:{
        type:Array
    },
    type:{
        type:String
    },
    name:{
        type: String
    }
});



module.exports = mongoose.model.BrandProduct || mongoose.model("BrandProduct", BrandProductSchema);