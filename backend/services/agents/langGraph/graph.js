import {StateGraph} from "@langchain/langgraph"
import { agentState } from './customState.js';
import {router} from './router.js';
import { chatAgent } from './../allAgents/chat.agent.js';
import { searchAgent } from './../allAgents/search.agent.js';
import { codingAgent } from './../allAgents/coding.agent.js';
import { pdfAgent } from './../allAgents/pdf.agent.js';
import { pptAgent } from './../allAgents/ppt.agent.js';
import { imgGenAgent } from './../allAgents/imgGen.agent.js';

const goRelativeAgent = async (state) =>{
    switch (state.agent) {
        case "chat":
            return "chat"
            break;
        case "search":
            return "search"
            break;
        case "coding":
            return "coding"
            break;
        case "ppt":
            return "ppt"
            break;
        case "pdf":
            return "pdf"
            break;
        case "imgGen":
            return "imgGen"
            break;
    
        default:
            return "search"
            break;
    }
}

const workflow = new StateGraph(agentState)

workflow.addNode("router",router)
workflow.addNode("chat",chatAgent)
workflow.addNode("search",searchAgent)
workflow.addNode("coding",codingAgent)
workflow.addNode("pdf",pdfAgent)
workflow.addNode("ppt",pptAgent)
workflow.addNode("imgGen",imgGenAgent)

workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router",goRelativeAgent,{
    chat:"chat",
    search:"search",
    coding:"coding",
    ppt:"ppt",
    pdf:"pdf",
    imgGen:"imgGen"
})

workflow.addEdge("search","chat")
workflow.addEdge("chat","__end__")
workflow.addEdge("coding","__end__")
workflow.addEdge("pdf","__end__")
workflow.addEdge("ppt","__end__")
workflow.addEdge("imgGen","__end__")

export const graph = workflow.compile()
