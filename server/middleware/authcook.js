const jwt = require('jsonwebtoken');
const UserCook = require('../schema/UserCook');
const User = require('../schema/User');

const authcook = async(req, res, next) => {
    const token = req.cookies.ctoken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(verifyToken);
    const user  = await UserCook.findById(verifyToken.id);
    // console.log(user);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    next();

}

module.exports = authcook;