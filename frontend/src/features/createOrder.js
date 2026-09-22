import api from './../../utils/axios.js';

export const createOrder = async (plan) =>{
    try {
        const response = await api.post("/api/billing/create",{plan})
        return response.data
    } catch (error) {
        console.log(error)
        return []
    }
}