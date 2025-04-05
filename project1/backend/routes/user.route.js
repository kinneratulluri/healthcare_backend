import express from "express";

import {userSignUp,userLogin,userProfile} from "../controllers/user.controller.js"
import isUser from "../middlewares/authMiddleware.js";

//CREATE EXPRESS ROUTER (GROUPING ALL RELATED ROUTES TOGETHER)
const router=express.Router();


//ROUTE FOR USER SIGNUP
router.post("/signup", userSignUp);

//ROUTE FOR USER LOGIN
router.post("/login",userLogin)

router.get("/profile",isUser,userProfile)


export default router;