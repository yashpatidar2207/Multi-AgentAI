import { getModel } from "./../config/llmModels.js";
import axios from "axios";
import { uploadToS3 } from "./../utils/uploadToS3.js";
import { getFromS3 } from "./../utils/getFromS3.js";

export const imgGenAgent = async (state) => {
  try {
    const llm = await getModel("image");

    const res = await llm.invoke(`
        You are an elite AI image prompt engineer.
        
        Convert the user request into a highly detailed image generation prompt.
        
        Requirements:
        
        - Cinematic lighting
        - Professional composition
        - Ultra realistic
        - High detail
        - Beatiful  color palette
        - Sharp focus
        - 8k Quality
        - Photorealistic
        - Depth of field
        - Professional photography
        - Stunning visuals

        Return only the prompt.

        User Request for image generation:
        ${state.prompt}
        `)

    const enhancedPrompt = res.content.trim();
    
    const imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}`;

    const imageRes = await axios.get(imageURL, { responseType: "arraybuffer" });
    //console.log(imageRes);

    const buffer = Buffer.from(imageRes?.data);
    const filename = `image-${Date.now()}.png`;

    await uploadToS3(filename, buffer, "image/png");
    const downloadURL = await getFromS3(filename, 60 * 60);

    return {
      ...state,
      aiResponse: `
            🖼️ Image Generated Successfully

![Generated Image](${downloadURL})

📥 [Download Image](${downloadURL})

⏳ Link expires in 10 minutes.
            `,
    };
  } catch (error) {
    console.log("Image Agent Error:", error);
    return {
      ...state,
      aiResponse: "❌ Failed to generate image.",
    };
  }
};
