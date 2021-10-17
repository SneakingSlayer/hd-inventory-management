const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required: true
    },
    product_desc:{
        type:String,
        required: true
    },
    product_price:{
        type:String,
        required: true
    },
    date_created:{
        type:Date,
        required: true
    }
});

module.exports = mongoose.model('Products', productSchema);