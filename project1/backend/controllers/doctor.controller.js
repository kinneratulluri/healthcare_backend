import { mongoose } from "mongoose";
import Doctor from "../models/doctorModel.js"
import { userService, jwtService, compareService } from "../services/users.service.js"
import { parsedValidation, doctorValidation, availabilityValidation } from "../services/validation.service.js";
import Patient from "../models/patientModel.js";
//SIGNUP FUNCTION
const doctorSignUp = async (req, res) => {
    try {
        //VALIDATE THE DATA AND FETCH
        const parsed = parsedValidation(doctorValidation, req.body)
        const isEmail = await Doctor.findOne({ email: parsed.email })
        if (isEmail)
            return res.status(401).json({ message: "doctor already registered" })
        const hashedPassword = await userService(parsed.password)
        const newDoctor = await Doctor.create(
            {
                name: parsed.name,
                email: parsed.email,
                password: hashedPassword,
                gender: parsed.gender,
                specialization: parsed.specialization,
                experience: parsed.experience,
                contactNumber: parsed.contactNumber,
                availability: parsed.availability ? parsed.availability : []
            }
        );

        //GENERATE JWT TOKEN
        const token = await jwtService(newDoctor, process.env.DOCTOR_SECRET_KEY, process.env.DOCTOR_EXPIRE_DATE)
        //SEND A SUCCESS RESPONSE WITH TOKEN
        res.status(201).json({ message: "doctor registered successfully", user: newDoctor, token })
    }
    catch (error) {
        //HANDLE ERRORS AND SEND A RESPONSE WITH ERROR MESSAGE
        res.status(400).json({ error: error.message })
    }
}
//LOGIN FUNCTION
const doctorLogin = async (req, res) => {
    try {
        const parsed = parsedValidation(doctorValidation, req.body)
        const user = await Doctor.findOne({ email: parsed.email })
        if (!user)
            return res.status(404).json({ error: "User not found" })
        const match = await compareService(parsed.password, user.password)
        if (!match)
            return res.status(400).json({ error: "Incorrect Password" })
        //GENERATE JWT TOKEN
        const token = await jwtService(user, process.env.DOCTOR_SECRET_KEY, process.env.DOCTOR_EXPIRE_DATE)
        //SEND A SUCCESS RESPONSE WITH TOKEN
        res.status(201).json({ message: "loggedin successfully", token })
    }
    catch (error) {
        //HANDLE ERRORS AND SEND A RESPONSE WITH ERROR MESSAGE
        res.status(400).json({ error: error.message })
    }
}
//CREATE FUNCTION TO ADD SLOTS
const addSlots = async (req, res) => {
    try {
        //EXTRACT ID FROM REQUEST
        const doctorid = req.doctor.id
        const parsed = parsedValidation(availabilityValidation, req.body)
        const incomingSlots = parsed.availability; // Extract validated availability data
        if (!incomingSlots || !Array.isArray(incomingSlots) || incomingSlots.length === 0) {
            return res.status(400).json({
                message: "provide available slots"
            })
        }
        //FIND DOCTOR BY ID
        const doctor = await Doctor.findById(doctorid)
        if (!doctor) {
            return res.status(401).json({ message: "doctor not found" })
        }
        //FETCH CURRENT DATA INTO UPDATEDDATA
        const updatedAvailability = [...doctor.availability]
        //ITERATE OVER INCOMING REQUESTS
        incomingSlots.forEach((newSlot) => {
            //FIND FOR SAME DATE
            const existingDate = updatedAvailability.find((slot) => slot.date === newSlot.date)
            if (existingDate) {
                //IF DATE EXISTS ADD NEW UNIQUE TIME SLOTS
                newSlot.slots.forEach((newTime) => {
                    const slotExists = existingDate.slots.find(slot => slot.time === newTime.time)

                    if (!slotExists) {
                        existingDate.slots.push(
                            {
                                _id: new mongoose.Types.ObjectId(),
                                time: newTime.time,
                                isBooked: false
                            }
                        )
                    }

                })
            }
            //NEW DATE,ADD ALL SLOTS
            else {
                updatedAvailability.push({
                    date: newSlot.date,
                    slots: newSlot.slots.map((slot) => ({//TRANSFORMS EACH TIME SLOT INTO AN OBJECT
                        _id: new mongoose.Types.ObjectId(),
                        time: slot.time,
                        isBooked: false
                    }))
                })
            }


        })
        doctor.availability = updatedAvailability
        await doctor.save()
        res.status(200).json({
            message: "slots added successfully",
            doctor_id: doctorid,
            availability: doctor.availability
        })
    }
    catch (error) {
        //HANDLE ERRORS AND SEND A RESPONSE WITH ERROR MESSAGE
        res.status(400).json({ error: error.message })
    }
}

const viewAppointments = async (req, res) => {
    try {
        const doctorId = req.doctor.id
        const doctor = await Doctor.findById(doctorId)
        if (!doctor) {
            return res.status(401).json({ message: "doctor not found" })
        }
        const patients = await Patient.find({
            "appointments.doctorId": doctorId
        }).select("name email gender contactNumber appointments")
        const doctorAppointments = []
        patients.forEach((patient) => {
            patient.appointments.forEach((app) => {
                if (app.doctorId.toString() === doctorId) {
                    doctorAppointments.push({
                        patientName: patient.name,
                        patientEmail: patient.email,
                        date: app.date,
                        timeSlot: app.timeSlot,
                        timeSlotId: app.timeSlotId,
                        status:app.status
                    })
                }
            })
        })
        res.status(200).json({ appointments: doctorAppointments });
    }
    catch (error) {
        //HANDLE ERRORS AND SEND A RESPONSE WITH ERROR MESSAGE
        res.status(400).json({ error: error.message })
    }
}


const doctorProfile=async(req,res)=>{
    try{
        const doctorId=req.params.id
        const doctor = await Doctor.findById(doctorId).select("name email gender specialization experience contactNumber availability ")
        if (!doctor) {
            return res.status(401).json({ message: "doctor not found" })
        }
        res.status(201).json({
            doctorDetails:doctor
        })
    } 
    catch(error){
        res.status(400).json({ error: error.message })
    }
}

export { doctorSignUp, doctorLogin, addSlots, viewAppointments ,doctorProfile}