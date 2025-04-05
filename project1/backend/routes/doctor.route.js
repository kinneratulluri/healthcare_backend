import express from "express";
import { doctorLogin,doctorSignUp,addSlots } from "../controllers/doctor.controller.js";
import { isDoctor } from "../middlewares/authMiddleware.js";

 const  router = express.Router()

router.post("/signup",doctorSignUp)
router.post("/login",doctorLogin)
router.get("/addSlots",isDoctor,addSlots)
export default router;