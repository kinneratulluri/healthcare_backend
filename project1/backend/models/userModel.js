import mongoose from "mongoose";
//DEFINE THE SCHEMA FOR USER COLLECTION
const userSchema= new mongoose.Schema({
    email:{
        type: String,//DATA TYPE IS STRING
        unique: true,// ENSURES EMAIL IS UNIQUE
        required : true,// ENSURES EMAIL IS MANDATORY
    },
    password : {
        type: String,// DATATYPE IS STRING
        required: true// ENSURES PASSWORD IS MANDATORY
    }
})
//CREATE NEW MODEL USING THE SCHEMA
const User=mongoose.model('user',userSchema)

//EXPORT USER MODEL FOR USE IN OTHER FILES
export default User