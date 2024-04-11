const Agent = require('../schema/Agent');
const User = require('../schema/User');

const VerifyUser = require('../schema/Verification');

const jwt = require('jsonwebtoken');


const addUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const newUser = new User({ fullname, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addAgent = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const newAgent = new Agent({ fullname, email, password });
        await newAgent.save();
        res.status(201).json(newAgent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (password === user.password) {
            res.status(200).json(user);
        } else {
            res.status(401).json({ message: "Incorrect password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginAgent = async (req, res) => {
    try {
        const { email, password } = req.body;
        const agent = await Agent.findOne({ email });
        if (!agent) return res.status(404).json({ message: "Agent not found" });
        if (password === agent.password) {
            const token = jwt.sign({ email: agent.email, fullname:agent.fullname }, process.env.JWT_SECRET, {expiresIn: '1d'});
            res.status(200).json({"success":true, token:token});
        } else {
            res.status(401).json({ message: "Incorrect password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//getting the registred user
const getUser = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAgent = async (req, res) => {
    try {
        const user = await Agent.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const agentDetails = async (req, res) => {
    try {
        const token = req.headers.authorization;
        // console.log(token);
        const agentData = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        if (!agentData) return res.status(404).json({ message: "Agent not found" });
        res.status(200).json(agentData);
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


//create request for user verification
const createRequest = async (req, res) => {
    try {
        const { useremail, agentemail, age, favflim } = req.body;
        //check if user and agent exist
        const verifyUser = await User.findOne({ email: useremail });
        const verifyAgent = await Agent.findOne({ email: agentemail });
        if (!verifyUser ) return res.status(404).json({success:false,message: "User or Agent not found" });
        if (!verifyAgent ) return res.status(404).json({ success:false,message: "User or Agent not found" });
        
        //checking request already exist or not
        const checkRequest = await VerifyUser.findOne({ user: verifyUser._id });
        if (checkRequest) return res.status(404).json({ success:false,message: "Request already exist" });

        const newRequest = new VerifyUser({ 
            user: verifyUser._id,
            agent: verifyAgent._id,
            data: [{ age: age, favoriteFilm: favflim }]  
        });
        const updatedUserStatus = await User.findOneAndUpdate({ email: useremail }, { verified: "pending" });
        if (!updatedUserStatus) return res.status(404).json({ message: "User not found" });

        await newRequest.save();
        res.status(201).json({success:true, message:"Successfully requested"});
    } catch (error) {
        res.status(500).json({success:false, error: error.message });
    }
}





//to show the requests done by user to the particular agent
const showUserRequests = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const agentData = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        if (!agentData) return res.status(404).json({ message: "Agent not found" });

        const agent = await Agent.findOne({ email: agentData.email });
        if (!agent) return res.status(404).json({ message: "Agent not found" });

        const requests = await VerifyUser.find({ agent: agent._id });
        if (requests.length === 0) {
            return res.status(404).json({ message: "No requests found for this agent" });
        }

        const userData = [];
        for (const request of requests) {
            const user = await User.findById(request.user);
            
            if (user) {
                userData.push(user);
            }
        }

        res.status(200).json({ success: true, requests:requests, userinfo : userData});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// accepting or rejecting the user request
const acceptRejectHandler = async (req, res) => {
    try {
        const { action, userId, age, flim } = req.body;
        console.log(action, userId, age, flim);
        console.log(userId)
        //for agent data
        const token = req.headers.authorization;
        const agentData = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        if (!agentData) return res.status(404).json({ message: "Agent not found" });

        const agent = await Agent.findOne({ email: agentData.email });
        if (!agent) return res.status(404).json({ message: "Agent not found" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const request = await VerifyUser.findOne({ user: user._id, agent: agent._id });
        if (!request) return res.status(404).json({ message: "Request not found" });

        if (action === 'verify') {
            const updatedVerifyUser = await User.findByIdAndUpdate({ _id: user._id }, { verified: "verified" });
            const updatedRequest = await VerifyUser.findByIdAndUpdate({ _id: request._id }, { status: 'verified' });
            const updatUserProfile = await User.findByIdAndUpdate({ _id: user._id }, { age: age, favflim: flim });
            if (!updatedVerifyUser || !updatedRequest || !updatUserProfile ) return res.status(404).json({ message: "User not found" });
            return res.status(200).json({ success: true, message: "User verified successfully" });
        } else {
            const updatedVerifyUser = await User.findByIdAndUpdate({ _id: user._id }, { verified: "rejected" });
            const updatedRejectRequest = await VerifyUser.findByIdAndUpdate({ _id: request._id }, { status: 'rejected' });
            if (!updatedVerifyUser || !updatedRejectRequest) return res.status(404).json({ message: "User not found" });
            return res.status(200).json({ success: true, message: "Request rejected successfully" });        
        }

       
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
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

};
