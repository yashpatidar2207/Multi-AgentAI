import  axios  from 'axios';
import { graph } from './../langGraph/graph.js';
export const agent = async (req,res) =>{

    try {
        const {conversationId,prompt} = req.body()
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId,
            content:prompt,
            role:"user"
        })
        const result = await graph.invoke({
            prompt,
            conversationId
        })
        const response = result.aiResponse
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({message:`Error in chat Agent - ${error}`})
    }

}