import mongoose from "mongoose";

const patientSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        enum:['male','female','other'],
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    contactNumber:{
        type: Number,
        required: true
    },
    medicalIssue:{
        type: String,
        required: true
    },
    appointments:[
        {
            patientId:{
                type:String
            },
            doctorName:{
                type:String,
                required:true
            },
            doctorId:{
                type:String,
                required:true
            },
            date:{
                type:String,required:true
            },
            timeSlot:{
                type:String,required:true
            },
            timeSlotId:{
                type:String,required:true
            }
        }
    ]
},{timestamps:true})

const Patient =mongoose.model('patient',patientSchema)

export default Patient