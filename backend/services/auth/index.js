import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbconnect.js"
import router from "./routes/auth.route.js"
 
dotenv.config()

const port = process.env.PORT

const app = express()
app.use(express.json())
app.use("/",router)
app.get('/', (req, res)=>{
    return res.json({message : 'Auth service running'})
})
app.listen(port, (req,res)=>{
    console.log(`Auth service running at port : ${port}`);
    connectDB()
})