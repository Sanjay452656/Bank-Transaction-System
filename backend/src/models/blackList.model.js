const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is required to blacklist"],
        unique:[true,"Token must be unique in blacklist"]
    },
},{timestamps:true})

tokenBlacklistSchema.index({createdAt:1},{
    expireAfterSeconds:60*60*24*3 // 3 day
})

const tokenBlacklistModel = mongoose.model('TokenBlacklist',tokenBlacklistSchema)

module.exports = tokenBlacklistModel;