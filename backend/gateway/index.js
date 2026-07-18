import express from "express"
import dotenv from "dotenv"

dotenv.config();

const port = process.env.PORT
const app=express()

app.get('/',(req,res)=>{
    return res.json({message:'msg gateway se'})
})
app.listen(port,()=>{
    console.log(`gateway running at port ${port}`)
})