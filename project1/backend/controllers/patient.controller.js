import Patient from "../models/patientModel.js"
import { userService,jwtService,compareService } from "../services/users.service.js"
import { parsedValidation, patientValidation } from "../services/validation.service.js"


const patientSignUp = async (req, res) => {
    try {
        const parsed = parsedValidation(patientValidation, req.body)
        const isEmail = await Patient.findOne({ email: parsed.email })
        if (isEmail)
            res.status(400).json({ error: "user already registered" })
        const hashedPassword = await userService(parsed.password)
        const newPatient = await Patient.create({
            name: parsed.name,
            email: parsed.email,
            password: hashedPassword,
            gender: parsed.gender,
            age: parsed.age,
            contactNumber: parsed.contactNumber,
            medicalIssue: parsed.medicalIssue,
            appointments: parsed.appointments ? parsed.appointments : []
        })
        //GENERATE JWT TOKEN
        const token = await jwtService(newPatient, process.env.PATIENT_SECRET_KEY, process.env.PATIENT_EXPIRE_DATE)
        //SEND A SUCCESS RESPONSE WITH TOKEN
        res.status(201).json({ message: "patient registered successfully", user: newPatient, token })
    }
    catch (error) {
        //HANDLE ERRORS AND SEND A RESPONSE WITH ERROR MESSAGE
        res.status(400).json({ error: error.message })
    }
}

//LOGIN FUNCTION
const patientLogin = async (req, res) => {
    try {
        const parsed = parsedValidation(patientValidation,req.body)
        const user = await Patient.findOne({ email: parsed.email })
        if (!user)
            return res.status(404).json({ error: "User not found" })
        const match = await compareService(parsed.password, user.password)
        if (!match)
            return res.status(400).json({ error: "Incorrect Password" })
        //GENERATE JWT TOKEN
        const token = await jwtService(user, process.env.PATIENT_SECRET_KEY, process.env.PATIENT_EXPIRE_DATE)
        //SEND A SUCCESS RESPONSE WITH TOKEN
        res.status(201).json({ message: "loggedin successfully", token,appointments:user.appointments })
    }

    catch (error) {
        //HANDLE ERRORS AND SEND A RESPONSE WITH ERROR MESSAGE
        res.status(400).json({ error: error.message })
    }
}

export {patientSignUp,patientLogin}