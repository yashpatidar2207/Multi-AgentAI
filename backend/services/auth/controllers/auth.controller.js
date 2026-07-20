import { getAuth} from "firebase-admin/auth"
import {app} from "../config/firebase.js"
import User from '../models/user.model.js';
import crypto from "crypto"; 
import mongoose from "mongoose";
export const login = async (req,res)=>{
    try {
        const {token}= req.body
        const decode= await getAuth(app).verifyIdToken(token)
        //console.log(decode)
        console.log("Before Query:", mongoose.connection.readyState);
        let user= await User.findOne(
            {firebaseUID:decode.uid}
        )
        if(!user){
            user= await User.create({
                firebaseUID:decode.uid,
                name:decode.name,
                email:decode.email,
                avatar:decode.picture
            })
        }

        const sessionId=crypto.randomUUID();

        res.cookie("session",sessionId,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })
        return res.status(200).json(user)
    } catch (error) {
        console.log("error in login")
        console.log(error);
        res.status(500).json({message:`login error ${error}`})
    }
    
}