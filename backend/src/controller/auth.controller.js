const User = require('../models/user.model.js')
const jwt = require('jsonwebtoken');
const { welcomeEmailTemplate } = require('../utils/emailTemplate.js');
const sendEmail = require('../utils/sendEmail.js');
const tokenBlacklistModel = require('../models/blackList.model.js');

// POST
// /api/auth/register 
async function registerUser(req,res){
    const {name,email,password} = req.body;

    const isExist = await User.findOne({email});

    if(isExist){
        return res.status(422).json({
            message:"User already exists",
            status:"failed"
        })
    }


    const user = await User.create({
        name,
        email,
        password
    })

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

    res.cookie("token",token);

    res.status(201).json({
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
        },
        token
    })

    const html = welcomeEmailTemplate(user.name);
    await sendEmail(email,"Welcome to the bank app",html);
}

async function loginUser(req,res){
    const {email,password} = req.body;

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({
            message:"Email or password is invalid"
        })
    }

    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword){
        return res.status(401).json({
            message:"Email or password is invalid"
        })
    }

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'3d'});

    res.cookie("token",token);

    res.status(200).json({
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
        },
        token
    })
}

async function logoutUser(req,res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if(token){
        return res.status(200).json({
            message:"Logout successful"
        })
    }

    res.cookie("token","");

    await tokenBlacklistModel.create({
        token:token
    })

    res.status(200).json({
        message:"Logout successful"
    })
}

async function getMe(req, res) {
    res.status(200).json({
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        }
    });
}

module.exports = { registerUser, loginUser, getMe,logoutUser }
