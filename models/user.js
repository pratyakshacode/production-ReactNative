import mongoose from "mongoose";

const Schema = mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        trim:true,  
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        trim:true,  
        min: 6,
        max: 64
    },
    role: {
        type:String, 
        default: 'user'
    },
},{timestamps:true})

export default mongoose.model('User', Schema);

