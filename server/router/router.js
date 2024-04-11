const express = require('express');
const router = express.Router();


// Import controller functions
const {
    addUser,
    addAgent,
    loginUser,
    loginAgent,
    getUser,
    getAgent,
    agentDetails,
    createRequest,
    showUserRequests,
    acceptRejectHandler
} = require('../controller/controller');

// Routes for adding user and agent
router.post('/add/user', addUser);
router.post('/add/agent', addAgent);

// Routes for user and agent login
router.post('/login/user', loginUser);
router.post('/login/agent', loginAgent);

//get info
router.get('/userinfo',getUser)
router.get('/agentinfo',getAgent)
router.get('/agentDetails',agentDetails)

//for user verification
router.post('/request-verification',createRequest)

//for showing the request done by user to agent
router.get('/verificationRequests',showUserRequests)

//for accepting or rejecting the user request
router.post('/verificationRequests',acceptRejectHandler)

module.exports = router;
