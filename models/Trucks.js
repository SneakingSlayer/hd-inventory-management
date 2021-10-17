const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
    truck_code:{
        type:String,
        required: true
    },
    truck_desc:{
        type:String,
        required: true
    },
    type:{
        type:String,
        required: true
    },
    date_created:{
        type:Date,
        required: true
    }
});

module.exports = mongoose.model('Trucks', truckSchema);