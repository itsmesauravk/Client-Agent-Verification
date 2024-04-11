const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        default: ''
    },
    favflim:{
        type: String,
        default: ''
    },
    verified: {
        type: String,
        default: "Not Verified"
    }
})

module.exports = mongoose.model('User', UserSchema);