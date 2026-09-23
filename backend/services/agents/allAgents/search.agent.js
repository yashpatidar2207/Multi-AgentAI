import { webSearchTool } from "../config/tools/tavily.js"
import { deductUserCredits } from "../utils/deductUserCredits.js"

export const searchAgent = async (state) =>{

    try {
     const result = await webSearchTool.invoke({
        query:state.prompt
     })  

     const data = await deductUserCredits(state.userId,"search")
    //   console.log(data)
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