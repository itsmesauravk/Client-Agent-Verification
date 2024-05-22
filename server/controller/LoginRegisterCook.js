const UserCook  = require('../schema/UserCook');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authcook = require('../middleware/authcook');



// Register a new user
const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = await UserCook.create({
             email,
            username,
            password: hashedPassword
        });
        if (!user) {
            return res.status(400).json({success:false, message: 'User not created' });
        }
        res.status(201).json({success:true, message: 'User created successfully' });
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}

// Login a user

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserCook.findOne({ email});
        if (!user) {
            return res.status(400).json({success:false, message: 'Invalid email or password' });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({success:false, message: 'Invalid email or password' });
        }

        const ctoken = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('ctoken', ctoken, { 
            httpOnly: true ,
           
        });
        res.status(200).json({success:true, message: 'Login successful' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//getting user data
const getUser = async (req, res) => {
    try {
        console.log("getting user data...")
        res.status(200).json({success:true, data: req.user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//getting logout
const logout = async (req, res) => {
    try {
        res.clearCookie('ctoken', { httpOnly: true });
        res.status(200).json({success:true, message: 'User logged out' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}




module.exports = {
     register,
      login ,
      getUser,
        logout
    };