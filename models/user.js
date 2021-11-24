const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true,
        unique : false
    },
    email:{
        type: String,
        required : true,
        unique : true
    },
    password:{
        type: String,
        required : true,
        unique : true
    },
    avatar:{
        type: String,
    },
    data:{
        type: Date,
        default: Date.now()
    }
});

module.exports = User = mongoose.model('user',userSchema);