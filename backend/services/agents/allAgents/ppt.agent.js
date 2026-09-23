import { deductUserCredits } from "../utils/deductUserCredits.js"

export const pptAgent = async () =>{
        await deductUserCredits(state.userId,"ppt")
return {
            ...state,
            aiResponse:`
⏳ PPT Agent will be coming soon 😊.
`
        }
}