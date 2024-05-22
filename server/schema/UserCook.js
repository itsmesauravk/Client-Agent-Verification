const mongoose = require('mongoose');

const UserCookSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const UserCook= mongoose.model('UserCook', UserCookSchema);
module.exports = UserCook;

