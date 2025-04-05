import { Mongoose } from "mongoose";
import Doctor from "../models/doctorModel.js"
import { userService, jwtService, compareService } from "../services/users.service.js"

import { z } from "zod";
import mongoose from "mongoose";
//VALIDATION TO ENSURE PROPER DATA
const doctorValidation = z.object(
    {
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        gender: z.enum(["male", "female", "other"]),
        specialization: z.string(),
        experience: z.number(),
        contactNumber: z.string().length(10),
        availability: z.array(z.object({
            date: z.string(),
            slots: z.array(z.object({
                time: z.string(),
                isBooked: z.boolean().optional().default(false)
            }))
        })).optional()
    }
)

const availabilityValidation = z.object({
    availability: z.array(z.object({
        date: z.string(),
        slots: z.array(z.object({
            time: z.string(),
            isBooked: z.boolean().optional().default(false)
        }))
    }))
})

//SIGNUP FUNCTION
const doctorSignUp = async (req, res) => {
    try {
        const parsed = doctorValidation.safeParse(req.body)
        console.log(parsed.error)
        if (!parsed.success) {
            throw new Error(JSON.stringify(parsed.error.format()))
        }

        const isEmail = await Doctor.findOne({ email: parsed.data.email })
        if (isEmail)
            return res.status(401).json({ message: "doctor already registered" })
        const hashedPassword = await userService(parsed.data.password)
        const newDoctor = await Doctor.create(
            {
                name: parsed.data.name,
                email: parsed.data.email,
                password: hashedPassword,
                gender: parsed.data.gender,
                specialization: parsed.data.specialization,
                experience: parsed.data.experience,
                contactNumber: parsed.data.contactNumber,
                availability: parsed.data.availability ? parsed.data.availability : []
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
        const parsed = doctorValidation.safeParse(req.body)
        console.log(parsed.error)
        if (!parsed.success) {
            throw new Error(JSON.stringify(parsed.error.format()))
        }

        const user = await Doctor.findOne({ email: parsed.data.email })
        if (!user)
            return res.status(404).json({ error: "User not found" })
        const match = await compareService(parsed.data.password, user.password)
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
        const parsed = availabilityValidation.safeParse(req.body)
        if (!parsed.success) {
            throw new Error(JSON.stringify(parsed.error.format()));
        } 
        const incomingSlots = parsed.data.availability; // Extract validated availability data
        //FIND DOCTOR BY ID
        const doctor = await Doctor.findById(doctorid)
        if (!doctor) {
            return res.status(401).json({ message: "doctor not found" })
        }
        if (!incomingSlots || !Array.isArray(incomingSlots) || incomingSlots.length === 0) {
            return res.status(400).json({
                message: "provide available slots"
            })
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
       doctor.availability=updatedAvailability
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

export { doctorSignUp, doctorLogin, addSlots }