import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"


const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
})

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b"
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
