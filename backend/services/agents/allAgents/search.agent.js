import { webSearchTool } from "../config/tools/tavily.js"

export const searchAgent = async (state) =>{

    try {
     const result = await webSearchTool.invoke({
        query:state.prompt
     })  

     console.log(result)
     return {
        ...state,
        webSearchResults:JSON.stringify(result),
        webImages:result.images
     }
    } catch (error) {
        console.log(error)
        return {
        ...state,
    webSearchResults:[],
        webImages:[]
     }
    }
   
}