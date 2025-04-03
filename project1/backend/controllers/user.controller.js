
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { userService,compareService } from "../services/users.service.js";
import jwt from "jsonwebtoken"
//USER SIGNUP FUNCTION
const SECRET_KEY=process.env.SECRET_KEY
const userSignUp = async(req,res)=>{
    try{
        
        //FETCH EMAIL,PASSWORD FROM REQUEST BODY
        const {email,password}=req.body
        
        //HASH THE PASSWORDS BEFORE STORING IT IN DATABASE
        const hashedPassword= await userService(password)
        //CREATE A NEW USER WITH HASHED PASSWORD
        const newUser= await User.create({
           email,
           password:hashedPassword
        })
        //GENERATE JWT TOKEN
        const token=jwt.sign(
            {id:newUser._id,email: newUser.email}, 
            process.env.SECRET_KEY, 
            { expiresIn: "1h" })
        //SEND A SUCCESS RESPONSE WITH TOKEN
        res.status(201).json({ message:"user created successfully",user: newUser, token })
    }
    catch(error){
        //HANDLE ERRORS AND SEND A RESPONSE WITH ERROR MESSAGE
        res.status(400).json({error:error.message})
    }
}
// USER LOGIN FUNCTION
const userLogin= async(req,res)=>{
    try{
        //FETCH EMAIL,PASSWORD FROM REQUEST BODY
        const {email,password}=req.body
        //FIND THE USER IN DATABASE WITH GIVEN MAIL
        const user=await User.findOne({email});
        //
        if(!user){
         res.status(404).json({error:"user not found"})
       }
       //COMPARE THE PROVIDED PASSWORD WITH THE HASHED PASSWORD IN DATABASE
        const match=await compareService(password,user.password)
        if(!match){
         res.status(400).json({error:"incorrect password"})
     }
     const token=jwt.sign({id:user._id,email: user.email}, process.env.SECRET_KEY, { expiresIn: "1h" })
        res.status(200).json({message:"successfully login",token})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

export  {userSignUp,userLogin}
