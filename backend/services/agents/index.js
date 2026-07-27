import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbconnect.js"
 
dotenv.config()

const port = process.env.PORT

const app = express()
app.use(express.json())
app.get('/', (req, res)=>{
    return res.json({message : 'Agent service running'})
})
app.listen(port, (req,res)=>{
    console.log(`Agent service running at port : ${port}`);
    connectDB()
})