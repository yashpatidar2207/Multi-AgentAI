import redis from "../../shared/redis/redis.js"

const protectService = async (req,res,next)=>{
    try {
        const sessionId=req.cookies?.session
        if(!sessionId){
            console.log(`You are not logged in`)
            return res.status(400).json({message:`You are not logged in`})
        }
        const sessionData = await redis.get(`session-${sessionId}`)
        if(!sessionData){
            return res.status(400).json({message:`You need to login first`})
        }
        req.user=JSON.parse(sessionData)
        next()
    } catch (error) {
        return res.status(500).json({message:`protectService error - ${error}`})
    }
}

export default protectService