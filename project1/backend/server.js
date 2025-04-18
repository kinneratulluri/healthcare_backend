import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js"

//LOAD VARIABLES FROM .env FILE INTO process.env
dotenv.config();

//INITIALIZES THE EXPRESS APPLICATION(SERVER CONFIGURATION)
const app= express()

//MIDDLEWARE TO PARSE JSON REQUESTS
app.use(express.json())
 
//ROUTES IN userRoutes ARE ACCESSIBLE AT /api/v1/user
app.use("/api/v1",routes)

app.use("/",(req,res)=>{
    res.send("Welcome")
})

mongoose.connect(process.env.MONGO_URL)
//HANDELS SUCESSFULL CONNECTION TO MONGODB
.then(()=>{
    //STARTS THE EXPRESS SERVER,LISTEN TO REQUEST
    app.listen(process.env.PORT,()=>{
        console.log(`server is started ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.error("Mongodb connection error:",error)
})





