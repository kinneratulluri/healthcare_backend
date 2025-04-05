import express from "express"
import { patientSignUp,patientLogin } from "../controllers/patient.controller.js"
const router= express.Router()

router.post('/signup',patientSignUp)
router.post('/login',patientLogin)

export default router