
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
console.log("hi")
//USER SIGNUP FUNCTION
const userSignUp = async(req,res)=>{
    try{
        console.log("hi")
        //FETCH EMAIL,PASSWORD FROM REQUEST BODY
        const {email,password}=req.body
        console.log(req.body)
        //HASH THE PASSWORDS BEFORE STORING IT IN DATABASE
        const hashedPassword= await bcrypt.hash(password,12)
        //CREATE A NEW USER WITH HASHED PASSWORD
        const newData= await User.create({
           email,
           password:hashedPassword
        })
        //SEND A SUCCESS RESPONSE
        res.status(201).json(newData)
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
        const match=await bcrypt.compare(password,user.password)
        if(!match){
         res.status(400).json({error:"incorrect password"})
     }
        res.status(200).json({error:"successfully login"})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

export  {userSignUp,userLogin}
