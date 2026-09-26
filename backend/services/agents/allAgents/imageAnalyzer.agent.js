import fs from "fs/promises";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { deductUserCredits } from "../utils/deductUserCredits.js";

export const imageAnalyzerAgent = async (state) => {
  const filePath = state.file.path;
  const mimeType = state.file.mimetype;
  const userPrompt =
    state.prompt || "Analyze this image and describe what you see.";

  const systemPrompt = `
You are a Power-AI Image Analyzer Agent.

Your primary responsibility is to analyze the provided image and answer the user's
question strictly based on the visual information present in the image.

Rules:
1. Analyze the provided image carefully before generating a response.
2. Answer only questions that are related to the provided image.
3. Base your response strictly on information that can be observed or reasonably
   inferred from the image.
4. Do not invent, assume, or hallucinate information that is not present in the image.
5. If the requested information cannot be determined from the image, clearly state
   that it cannot be determined from the provided image.
6. If the user's question is unrelated to the image, politely state that you can
   only help with questions related to the provided image.
7. Describe objects, people, text, scenes, colors, relationships, and other visible
   elements when relevant to the user's question.
8. If text is visible in the image, read and use that text when answering.
9. Keep the response clear, accurate, and directly relevant to the user's question.
10. Do not provide information unrelated to the image unless it is necessary to
    explain your image-based answer.

Always prioritize visual evidence from the provided image over assumptions.
`;

  try {
    const imageAnalyzerLLM = await getModel("imageAnalyzer");

    // Read temporary image file
    const imageBuffer = await fs.readFile(filePath);

    // Convert image to Base64
    const base64Image = imageBuffer.toString("base64");

    // Send image + user prompt to Gemini
    const messages = [
      new SystemMessage(systemPrompt),

      new HumanMessage({
        content: [
          {
            type: "text",
            text: userPrompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      }),
    ];

    const result = await imageAnalyzerLLM.invoke([messages]);

    // Gemini successfully analyzed the image
    const response = result.content;

    await deductUserCredits(state.userId,"image")
    return {
      ...state,
      aiResponse:response
    };
  } catch (error) {
    console.error("Image Analyzer Agent Error:", error);

    return {
      ...state,
      aiResponse:"Failed to analyze image"
    };
  }
  finally{
    // Delete temporary file
    await fs.unlink(filePath);
  }
};
