import express from "express"
import { patientSignUp, patientLogin, getDoctorDetails } from "../controllers/patient.controller.js"
import { isPatient } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post('/signup', patientSignUp)
router.post('/login', patientLogin)
router.get('/doctors', isPatient, getDoctorDetails)

export default router