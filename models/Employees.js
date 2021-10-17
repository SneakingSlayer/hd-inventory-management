const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required: true
    },
    lastname:{
        type:String,
        required: true
    },
    birthdate:{
        type:String,
        required: true
    },
    role:{
        type:String,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    date_created:{
        type:Date,
        required: true
    }
});

module.exports = mongoose.model('Employees', empSchema);