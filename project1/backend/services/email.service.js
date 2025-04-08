import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,

        pass:process.env.PASS
    }
})


export const sendMailToPatient = async(patientEmail)=>{
    await transporter.sendMail({
        from:process.env.EMAIL,
        to:patientEmail,
        subject:"Your appointment slot was booked",
        html:`<h1>Hello Doctor<h1`
    })
}