import express from "express";

import {userSignUp,userLogin} from "../controllers/user.controller.js"
import verifyToken from "../middlewares/authMiddleware.js";

//CREATE EXPRESS ROUTER (GROUPING ALL RELATED ROUTES TOGETHER)
export const router=express.Router();


//ROUTE FOR USER SIGNUP
router.post("/signup", userSignUp);

//ROUTE FOR USER LOGIN
router.post("/login",userLogin)

router.get("/protected",verifyToken,(req,res)=>{
    res.json({message:"protected route",user:req.user})
})


export default router;