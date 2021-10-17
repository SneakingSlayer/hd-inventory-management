const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    order_code:{
        type:String,
        required: true
    },
    client_name:{
        type:String,
        required: true
    },
    project_total:{
        type:String,
        required: true
    },
    project_status:{
        type:String,
        required: true
    },
    date_created:{
        type:Date,
        required: true
    }
});

module.exports = mongoose.model('Clients', clientSchema);