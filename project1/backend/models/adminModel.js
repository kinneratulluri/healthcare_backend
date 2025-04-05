import mongoose from "mongoose";

const adminSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:String,
        default:"admin"
    },

    status:{
        type:String,
        enum:['pending','booked','cancelled','completed'],
        default:'pending'
    }
})

const Admin= mongoose.model('admin',adminSchema)

export default adminSchema