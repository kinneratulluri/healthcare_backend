import express from "express"
import { patientSignUp, patientLogin, getDoctorDetails,bookAppointment, cancelAppointment } from "../controllers/patient.controller.js"
import { isPatient } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post('/signup', patientSignUp)
router.post('/login', patientLogin)
router.get('/doctors', isPatient, getDoctorDetails)
router.post('/book',isPatient,bookAppointment)
router.post('/cancel',isPatient,cancelAppointment)
export default router