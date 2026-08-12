import { getModel } from './../config/llmModels.js';
import { chatAgent } from './../allAgents/chat.agent.js';
import { searchAgent } from './../allAgents/search.agent.js';
import { codingAgent } from './../allAgents/coding.agent.js';
import { pdfAgent } from './../allAgents/pdf.agent.js';
import { pptAgent } from './../allAgents/ppt.agent.js';
import { imgGenAgent } from './../allAgents/imgGen.agent.js';

export const router = async (state) =>{

   // user selected any agent manually then no need to call llm, invoke graph
    if(state.agent && state.agent!=="auto"){
      return {
         ...state,
         agent:state.agent
      }
    }

    const llmAgent = await getModel("router")
    const prompt= `You are an AI agent Router.

Your only responsibility is to analyze the user's request and determine which ONE agent should handle it.

Available Agents:

1. chat
   - General conversation
   - Greetings
   - Explanations
   - Writing, summarization, translation
   - Brainstorming
   - Questions that do NOT require web search, code execution, image generation, PDF analysis, or PPT creation.

2. search
   - Latest news
   - Real-time information
   - Current events
   - Web search
   - Information that requires searching the internet.

3. coding
   - Programming
   - Debugging
   - Code generation
   - Code explanation
   - Algorithms
   - Software development
   - API-related questions
   - Technical implementation

4. pdf
   - Questions about generate PDFs
   - or document context

5. ppt
   - Creating PowerPoint presentations
   - Generating presentation slides or PPT
   - Converting content into presentation format

6. imgGen
   - Creating images
   - Editing images
   - Image generation
   - Image modification
   - Visual design requests

Rules:
- Select EXACTLY ONE agent.
- Never explain your decision.
- Never return a sentence.
- Never return multiple agents.
- If the request could belong to multiple agents, choose the MOST SPECIFIC agent.
- If the request is general conversation, choose Chat.
- If the request requires programming, always choose Coding.
- If the request requires internet access, always choose Search.
- If the request is about a PDF document, always choose PDF.
- If the request is about creating presentations, always choose PPT.
- If the request is about image generation or editing, always choose Image.

Output Rules:
Return ONLY one of the following exact words:

chat
search
coding
pdf
ppt
imgGen

Do not output anything else.

User Query : - ${state.prompt}
`
// relative agent will set in state 
const response = await llmAgent.invoke(prompt)
console.log(response)
return {
    ...state,
    agent:response.content.trim().toLowerCase()
}


}