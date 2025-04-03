import express from "express";

import {userSignUp,userLogin} from "../controllers/user.controller.js"

//CREATE EXPRESS ROUTER (GROUPING ALL RELATED ROUTES TOGETHER)
export const router=express.Router();


//ROUTE FOR USER SIGNUP
router.post("/signup", userSignUp);

//ROUTE FOR USER LOGIN
router.post("/login",userLogin)



export default router;