import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },

    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    contactNumber: {
        type: String,
        //default: "doctor",
        required: true
    },
    availability: [
        {
            date: { type: String, required: true },//yyyy-mm-dd
            slots: [
                {

                    time: {
                        type: String,
                        required: true
                    },
                    isBooked: {
                        type: Boolean,
                        default: false
                    }
                }, { _id: true }
            ]//hh:mm am/pm
        }
    ]

}, { timestamps: true })

const Doctor = mongoose.model('doctor', doctorSchema)

export default Doctor