import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import protectService from "./middleware/auth.middleware.js";
import getCurrentUser from "./controllers/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
 
dotenv.config();

const port = process.env.PORT
const app=express()

app.use(cookieParser())

// cross origin 
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

// Gateway redirector
app.use("/api/me",protectService,getCurrentUser)

app.use("/api/auth",proxy(process.env.AUTH_SERVICE))
app.use("/api/chat",protectService,proxyWithHeader(process.env.CHAT_SERVICE))
app.use("/api/agents",protectService,proxy(process.env.CHAT_SERVICE))

app.get('/',(req,res)=>{
    return res.json({message:'msg gateway se'})
})
app.listen(port,()=>{
    console.log(`gateway running at port ${port}`)
})