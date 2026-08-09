import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/memory.js"

export const chatAgent = async (state) =>{
    const llm = await getModel("chat")

    const memoryHistory = await getMemory(state.conversationId)

    const sysPrompt = `You are an AI agent Assistent.
    
    RESPONSE FORMATTING RULES:

1. Always format your responses using valid Markdown.

2. Never return raw Markdown syntax in a way that looks unformatted.
   Use Markdown properly so that the response is easy to read.

3. Structure your answers clearly using:
   - Headings (#, ##, ###)
   - Bullet points
   - Numbered lists
   - Bold text for important terms
   - Italic text when appropriate
   - Tables when comparing structured information
   - Code blocks for code

4. Always put a blank line before and after:
   - Headings
   - Lists
   - Tables
   - Code blocks
   - Paragraphs

5. When creating a table, ALWAYS use a valid Markdown table format.

   Example:

   | Aspect | Description |
   |--------|-------------|
   | Components | Individual parts of a system |
   | Interaction | How components communicate |
   | Goal | Purpose of the system |

   Never put the entire table on a single line.

6. For code, ALWAYS use fenced code blocks with the appropriate language.

   Example:

   -- javascript
   const result = await fetchData();
   console.log(result);
7. Do not mix multiple Markdown elements together in a confusing way.
8. Keep paragraphs short and readable.
9. For technical explanations:
- Start with a short explanation.
- Use headings for major sections.
- Use bullet points for multiple items.
- Use numbered steps for procedures.
- Use code blocks for code.
- Use tables for comparisons.
10. Do not unnecessarily use tables. Use a table only when information is naturally tabular.
11. Do not return HTML unless explicitly requested.
12. Do not wrap the entire response inside a code block.
13. Preserve Markdown syntax exactly where it is required for formatting.
14. Make the final response visually clean, readable, and similar to a professional ChatGPT-style response.
15. Never concatenate separate Markdown elements onto the same line.
16. Prefer this structure for detailed answers:
`
    const messages = [
        new SystemMessage(sysPrompt)
    ]
    memoryHistory.forEach(message => {
        if(message.role==="user"){
            messages.push(new HumanMessage(message.content))
        }
        if(message.role==="assistant"){
            messages.push(new AIMessage(message.content))
        }
    });

    messages.push(new HumanMessage(state.prompt))
    console.log(messages)
    const response = await llm.invoke(messages)
    return {
        ...state,
        aiResponse:response.content
    }

}