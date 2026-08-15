import  axios  from 'axios';
import { graph } from './../langGraph/graph.js';
import { addMessage } from '../config/memory.js';
import redis from '../../../shared/redis/redis.js';

export const agent = async (req,res) =>{

    try {
        const {conversationId,prompt,agent} = req.body

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId,
            content:prompt,
            role:"user",
        })
        const result = await graph.invoke({
            prompt,
            conversationId,
            agent
        })

        //add msg for agent memory (redis)
        await addMessage(conversationId,"user",prompt)
        await addMessage(conversationId,"assistant",result.aiResponse)

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId,
            content:result.aiResponse,
            role:"assistant",
            images:result.images
        })
        return res.status(200).json({
            answer:result.aiResponse,
            images:result.webImages
        })
    } catch (error) {
        //console.log(error)
        return res.status(500).json({message:`Error in chat Agent - ${error}`})
    }

}