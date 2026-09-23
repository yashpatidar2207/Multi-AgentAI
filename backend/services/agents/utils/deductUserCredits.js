import axios from 'axios';

export const deductUserCredits = async (userId,agent)=>{
    try {
        const {data} = await axios.patch(`${process.env.AUTH_SERVICE}/deduct-user-credits`,{userId,agent})
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}