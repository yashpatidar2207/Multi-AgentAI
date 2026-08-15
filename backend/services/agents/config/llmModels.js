import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"


const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY
})

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY
})

export const getModel = async (agent) => {
    switch (agent) {
        case "chat":
            return groq
            break;
        case "search":
            return groq
            break;
        case "coding":
            return gemini
            break;
        default:
            return groq
            break;
    }
}
