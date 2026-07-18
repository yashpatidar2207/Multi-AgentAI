import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbconnect.js"
 
dotenv.config()

const port = process.env.PORT

const app = express()

app.get('/', (req, res)=>{
    return res.json({message : 'Auth service running'})
})
app.listen(port, (req,res)=>{
    console.log(`Server is listening at port : ${port}`);
    connectDB()
})