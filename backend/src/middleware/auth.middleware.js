const User = require('../models/user.model.js')
const jwt = require('jsonwebtoken')

async function authMiddleware(req,res,next){

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message :"Unauthorized access, token is missing"
        })
    }

    try {

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId);
        req.user = user; 
        return next();

    } catch (error) {
        return res.status(401).json({
            message:"Unauthorized access, token is missing"
        })
    }
}

async function authSystemUserMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token not found"
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("TOKEN:", token);
console.log("DECODED:", decoded);
console.log("USER ID:", decoded.user_id);
        
        const user = await User.findById(decoded.userId).select("+systemUser");
        // userId instead of user._id
        if (!user) {
            return res.status(403).json({ // forbidden access
                message: "User not found"
            });
        }

        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            });
        }

        req.user = user;

        next();

    } catch (error) {
    console.log(error);

    return res.status(401).json({
        message: error.message
    })
}
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
};
