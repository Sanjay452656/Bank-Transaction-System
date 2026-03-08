const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please fill a valid email address']
    },
    password:{
        type:String,
        required:[true,'Passwird is required'],
        minlength:[6,'Password must be atleast 6 characters long']
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false,
    }
},{timestamps:true});

userSchema.pre('save',async function(){

    if(!this.isModified('password')){
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
    } catch (error) {
        console.log(error);
    }
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

const User = mongoose.model('User',userSchema);

module.exports = User;