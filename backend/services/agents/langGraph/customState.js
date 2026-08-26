import {Annotation} from "@langchain/langgraph"

export const agentState = Annotation.Root({
    prompt:Annotation(),
    aiResponse:Annotation(),
    agent:Annotation(), // which agent is decided by router
    conversationId:Annotation(), // to get the memory of previous conversation
    webSearchResults:Annotation(),
    webImages:Annotation(),
    artifacts:Annotation()
})