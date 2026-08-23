import { getAuth} from "firebase-admin/auth"
import {app} from "../config/firebase.js"
import User from '../models/user.model.js';
import crypto from "crypto"; 
import mongoose from "mongoose";
import redis from "../../../shared/redis/redis.js";

export const login = async (req,res)=>{
    try {
        console.log(req.body)
        const {token}= req.body

        const decode= await getAuth(app).verifyIdToken(token)
        //console.log(decode)
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
        // create sessionId using crypto
        const sessionId=crypto.randomUUID();
        await redis.set(`session-${sessionId}`,JSON.stringify({
            userId:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar
        }),"EX",7*24*60*60*1000)
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

export const logOut = async (req,res)=>{
    try {
        const sessionId=req.cookies?.session
        await redis.del(`session-${sessionId}`)

        res.clearCookie("session")
        return res.status(200).json({message:'logOut successfully'})
    } catch (error) {
        console.log(`logOut error ${error}`)
    }
}