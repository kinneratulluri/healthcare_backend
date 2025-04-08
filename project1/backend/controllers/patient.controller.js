import Patient from "../models/patientModel.js"
import { userService, jwtService, compareService } from "../services/users.service.js"
import { parsedValidation, patientValidation } from "../services/validation.service.js"
import Doctor from "../models/doctorModel.js"
import { sendMailToPatient } from "../services/email.service.js"

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
        const parsed = parsedValidation(patientValidation, req.body)
        const user = await Patient.findOne({ email: parsed.email })
        if (!user)
            return res.status(404).json({ error: "User not found" })
        const match = await compareService(parsed.password, user.password)
        if (!match)
            return res.status(400).json({ error: "Incorrect Password" })
        //GENERATE JWT TOKEN
        const token = await jwtService(user, process.env.PATIENT_SECRET_KEY, process.env.PATIENT_EXPIRE_DATE)
        //SEND A SUCCESS RESPONSE WITH TOKEN
        res.status(201).json({ message: "loggedin successfully", token, appointments: user.appointments })
    }

    catch (error) {
        //HANDLE ERRORS AND SEND A RESPONSE WITH ERROR MESSAGE
        res.status(400).json({ error: error.message })
    }
}

const getDoctorDetails = async (req, res) => {
    try {
        const doctors = await Doctor.find().select("id name gender specialization experience availability")
        res.status(200).json({
            message: "doctors details", doctors
        })
    }
    catch (error) {
        //HANDLE ERRORS AND SEND A RESPONSE WITH ERROR MESSAGE
        res.status(400).json({ error: error.message })
    }
}
//SLOT BOOKING FUNCTION
const bookAppointment = async (req, res) => {
    try {
        const patientId = req.patient.id
        const { doctorId, slotId } = req.body
        //FIND DOCTOR AND FETCH DETAILS
        const doctor = await Doctor.findById(doctorId)
        if (!doctor) {
            return res.status(401).json({ error: "Doctor not found" })
        }
        const patient = await Patient.findById(patientId)
        if (!patient)
            return res.status(400).json({ error: "Patient not found" })
        let selectedDate = null
        let selectedSlot = null
        //ITERATE OVER AVAILABLESLOTS
        for (const dateEntry of doctor.availability) {
            //FIND THE REQUIRED SLOTID
            const slot = dateEntry.slots.find((slot) => slot._id.toString() === slotId)
            if (slot && !slot.isBooked) {
                selectedDate = dateEntry.date;
                selectedSlot = slot.time;
                slot.isBooked = true
                break;
            }
        }
        await doctor.save()
        if (!selectedDate || !selectedSlot) {
            return res.status(400).json({
                error: "Slot not found or already cancelled"
            })
        }
        const appointment = {
            patientId,
            patientEmail:patient.email,
            doctorName: doctor.name,
            doctorId: doctor._id.toString(),
            date: selectedDate,
            timeSlot: selectedSlot,
            timeSlotId: slotId,
            status:"booked"
        }
        //SAVE APPOINTMENT DETAILS IN PATIENT MODEL
        patient.appointments.push(appointment)
        await patient.save()
        sendMailToPatient(patient.email)
        res.status(201).json({
            message: "slot booked successfully",
            details: appointment
        })

    }
    catch (error) {
        //HANDLE ERRORS AND SEND A RESPONSE WITH ERROR MESSAGE
        res.status(400).json({ error: error.message })
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const patientId = req.patient.id
        const { doctorId, slotId } = req.body
        //FIND DOCTOR AND FETCH DETAILS
        const doctor = await Doctor.findById(doctorId)
        if (!doctor) {
            return res.status(401).json({ error: "Doctor not found" })
        }
        const patient = await Patient.findByIdAndUpdate(
            {_id:patientId},{$set:{"appointments.$.staus":"cancelled"}},{new:true}
        )
        if (!patient)
            return res.status(400).json({ error: "Patient not found" })
        //ITERATE OVER AVAILABLESLOTS
        for (const dateEntry of doctor.availability) {
            //FIND THE REQUIRED SLOTID
            const slot = dateEntry.slots.find((slot) => slot._id.toString() === slotId)
            if (slot && slot.isBooked) {
                slot.isBooked = false
                break;
            }
        }
        await doctor.save()
        if (!selectedDate || !selectedSlot) {
            return res.status(400).json({
                error: "Slot not found or already booked"
            })
        }
        const appointment = {
            patientId,
            patientEmail:patient.email,
            doctorName: doctor.name,
            doctorId: doctor._id.toString(),
            date: selectedDate,
            timeSlot: selectedSlot,
            timeSlotId: slotId,
            status:"cancelled"
        }
        res.status(201).json({
            message: "slot cancelled successfully",
            details: appointment
        })

    }
    catch (error) {
        //HANDLE ERRORS AND SEND A RESPONSE WITH ERROR MESSAGE
        res.status(400).json({ error: error.message })
    }
}


export { patientSignUp, patientLogin, getDoctorDetails,bookAppointment,cancelAppointment }