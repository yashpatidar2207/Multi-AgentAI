import "dotenv/config"
import express from "express"
import connectDB from "./config/dbConnect.js";
import router from "./routes/billing.routes.js";
 
//dotenv.config()

const port = process.env.PORT

const app = express()
app.use(express.json())
app.use("/",router)
app.get('/', (req, res)=>{
    return res.json({message : 'Billing service running'})
})
app.listen(port, (req,res)=>{
    console.log(`Billing service running at port : ${port}`);
    connectDB()
})