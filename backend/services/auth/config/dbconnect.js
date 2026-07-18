import mongoose from "mongoose"
import dns from "dns"

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const connectDB = async () =>{
    try {
        console.log(process.env.MONGODB_URL)
        
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`db connected`)
    } catch (error) {
        console.log(`db error ${error}`)
    }
}

export default connectDB;