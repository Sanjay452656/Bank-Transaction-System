const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a from user"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a to user"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Status must be defined"
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required"],
        min:[0,"Transaction amount cannot be zero"]
    },
    idempotencyKey:{// always generated from client(frontend) side
        type:String,
        required:[true,"Idempo key is required"],
        index:true,
        unique:true,
    }
},{timestamps:true})

const transactionModel = mongoose.model("transaction",transactionSchema);

mongoose.exports = transactionModel;