const express = require('express');
const cookRouter = express.Router()

const {
    login,
    register,
    getUser,
    logout
} = require('../controller/LoginRegisterCook');

const authcook = require('../middleware/authcook');

cookRouter.post('/register', register);
cookRouter.post('/login', login);
cookRouter.get('/user',authcook, getUser)
cookRouter.get('/logout', logout)

module.exports = cookRouter;