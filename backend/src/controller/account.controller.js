const accountModel = require('../models/account.model.js')
const mongoose = require('mongoose')

async function createAccount(req,res){

    const user = req.user;


    const account = await accountModel.create({
        user:user._id
    })

    res.status(201).json({
        message:"Account created successfully",
        account
    })
}

async function getAccounts(req,res){

    const accounts = await accountModel.find({
        user: new mongoose.Types.ObjectId(req.user.userId)
    });

    res.status(200).json({
        accounts    
    })
}

module.exports = {createAccount,getAccounts};