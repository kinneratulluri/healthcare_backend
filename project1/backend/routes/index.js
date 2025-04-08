import express from "express";

import doctorRoutes from "./doctor.route.js"
import patientRoutes from "./patient.route.js"

const  router = express.Router()
router.use("/api/v1/doctor",doctorRoutes)

router.use("/api/v1/patient",patientRoutes)


export default router