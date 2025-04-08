import express from "express";
import { doctorLogin,doctorSignUp,addSlots,viewAppointments,doctorProfile } from "../controllers/doctor.controller.js";
import { isDoctor } from "../middlewares/authMiddleware.js";

 const  router = express.Router()

router.post("/signup",doctorSignUp)
router.post("/login",doctorLogin)
router.get("/addSlots",isDoctor,addSlots)
router.get("/viewAppointments",isDoctor,viewAppointments)
router.get("/doctorProfile/:id",isDoctor,doctorProfile)
export default router;