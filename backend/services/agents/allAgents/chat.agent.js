import { getModel } from "../config/llmModels.js"

export const chatAgent = async (state) =>{
    const llm = await getModel("chat")
    const sysPrompt = 'You are an AI agent Assistent'
    const response = await llm.invoke([
        {
            "role":"system",
            "content":sysPrompt
        },
        {
            "role":"human",
            "content":state.prompt
        }
    ])
    return {
        ...state,
        aiResponse:response.content
    }

}