import {StateGraph} from "@langchain/langgraph"
import { agentState } from './customState.js';
import {router} from './router.js';
import { chatAgent } from './../allAgents/chat.agent.js';
import { searchAgent } from './../allAgents/search.agent.js';
import { codingAgent } from './../allAgents/coding.agent.js';
import { pdfAgent } from './../allAgents/pdf.agent.js';
import { pptAgent } from './../allAgents/ppt.agent.js';
import { imgGenAgent } from './../allAgents/imgGen.agent.js';
import { pdfRAGAgent } from "../allAgents/pdfRAG.agent.js";
import { imageAnalyzerAgent } from "../allAgents/imageAnalyzer.agent.js";

const goRelativeAgent = async (state) =>{
    switch (state.agent) {
        case "chat":
            return "chat"
        case "search":
            return "search"
        case "coding":
            return "coding"
        case "ppt":
            return "ppt"
        case "pdf":
            return "pdf"
        case "image":
            return "image"
        case "imageAnalyzer":
            return "imageAnalyzer"
        case "pdfRAG":
            return "pdfRAG"
    
        default:
            return "chat"
    }
}

const workflow = new StateGraph(agentState)

workflow.addNode("router",router)
workflow.addNode("chat",chatAgent)
workflow.addNode("search",searchAgent)
workflow.addNode("coding",codingAgent)
workflow.addNode("pdf",pdfAgent)
workflow.addNode("ppt",pptAgent)
workflow.addNode("image",imgGenAgent)
workflow.addNode("imageAnalyzer",imageAnalyzerAgent)
workflow.addNode("pdfRAG",pdfRAGAgent)

workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router",goRelativeAgent,{
    chat:"chat",
    search:"search",
    coding:"coding",
    ppt:"ppt",
    pdf:"pdf",
    image:"image",
    imageAnalyzer:"imageAnalyzer",
    pdfRAG:"pdfRAG"
})

workflow.addEdge("search","chat")
workflow.addEdge("chat","__end__")
workflow.addEdge("coding","__end__")
workflow.addEdge("pdf","__end__")
workflow.addEdge("ppt","__end__")
workflow.addEdge("image","__end__")
workflow.addEdge("imageAnalyzer","__end__")
workflow.addEdge("pdfRAG","__end__")

export const graph = workflow.compile()
