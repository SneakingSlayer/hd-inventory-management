const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required: true
    },
    lastname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    isVerified:{
        type:Boolean
    },
    expiresAt: {
        type: Date 
    },
    email_token: {
        type: String
    },
    date_created:{
        type:Date,
        required: true
    }
});

module.exports = mongoose.model('Users', userSchema);