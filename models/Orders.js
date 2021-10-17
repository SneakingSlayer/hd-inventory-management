const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_code:{
        type:String,
        required: true
    },
    client_name:{
        type:String,
        required: true
    },
    item:{
        type:String,
        required: true
    },
    truck:{
        type:String,
        required: true
    },
    price:{
        type:String,
        required: true
    },
    date_created:{
        type:Date,
        required: true
    }
});

module.exports = mongoose.model('Orders', orderSchema);