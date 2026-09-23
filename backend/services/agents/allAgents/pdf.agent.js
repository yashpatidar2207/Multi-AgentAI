import generatePDF from "../utils/generatePDF.js";
import { getModel } from "./../config/llmModels.js";
import { uploadToS3 } from './../utils/uploadToS3.js';
import { getFromS3 } from './../utils/getFromS3.js';
import { deductUserCredits } from "../utils/deductUserCredits.js";

export const pdfAgent = async (state) => {
  try {
    const llm = await getModel("pdf");
    const systemPrompt = `
        You are a professional PDF Content Generator for a Multi-Agent AI platform.

Your task is to generate well-structured, professional, and document-ready content based on the user's prompt.

IMPORTANT:
- Do NOT generate the actual PDF file.
- Do NOT generate HTML, CSS, Markdown code, or programming code.
- Generate only the structured content that will be used by another service to create the final PDF document.
- The output must be suitable for directly rendering into a professional PDF.

DOCUMENT STRUCTURE:

1. TITLE
   - Provide a clear and relevant document title.
   - The title should represent the main topic.

2. SUBTITLE
   - Provide a short descriptive subtitle explaining the purpose or scope of the document.

3. SECTIONS
   Divide the content into logical sections based on the user's topic.

   Each section should contain:
   - heading
   - Bullet points 
OUTPUT FORMAT:

Return the response strictly as valid JSON.

Use the following structure:

{
  "title": "Document Title",
  "subtitle": "Document Subtitle",
  "sections": [
    {
        "heading": "Section Heading",
        "points": [] 
    }
    ]
}

IMPORTANT JSON RULES:

- Return ONLY valid JSON.
- Do not wrap the JSON in Markdown code fences.
- Do not add explanations before or after the JSON.
- Use double quotes for JSON keys and string values.
- Properly escape special characters.
- Do not return undefined, null, or malformed JSON.
- If a particular field is not required, return an empty array or empty string instead.
- Ensure the JSON can be directly parsed using JSON.parse().

CONTENT ADAPTATION:

The document structure should adapt to the user's topic.

For educational topics:
- Include definitions, concepts, explanations, examples, and key takeaways.

For technical topics:
- Include architecture/concepts, components, workflow, implementation details, examples, advantages, limitations, and best practices when relevant.

For comparison topics:
- Clearly separate the concepts being compared.
- Use structured points for similarities and differences.

For tutorial/how-to topics:
- Use numbered steps.
- Explain each step clearly.

For research/informational topics:
- Organize information logically.
- Distinguish facts, examples, and conclusions.

The final output must always be professional, logically structured, readable, and suitable for conversion into a PDF document.

Topic : 
${state.prompt}
        `;

        const res = await llm.invoke(systemPrompt)
        console.log(JSON.parse(res.content))

        const data = JSON.parse(res.content)
        const pdfBuffer = await generatePDF(data)

        const filename = `pdf-${Date.now().pdf}`

        await uploadToS3(filename,pdfBuffer,"application/pdf")

        const downloadURL = await getFromS3(filename,24*10)

        await deductUserCredits(state.userId,"pdf")

        return {
            ...state,
            aiResponse:`
# ✅ PDF Generated Successfully

📄 **${data?.title}**

📥 [Download PDF](${downloadURL})

⏳ Link expires in 10 minutes.
`
        }


  } catch (error) {
    console.log(
      "PDF Agent Error:",
      error
    );

    return {

      ...state,

      response:
        "❌ Failed to generate PDF."

    };
  }
};
