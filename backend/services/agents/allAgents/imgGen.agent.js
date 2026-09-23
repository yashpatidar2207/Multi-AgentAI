import { getModel } from "./../config/llmModels.js";
import axios from "axios";
import { uploadToS3 } from "./../utils/uploadToS3.js";
import { getFromS3 } from "./../utils/getFromS3.js";
import { generateImage } from "../config/mcp/imageGeneration.service.js";
import { deductUserCredits } from "../utils/deductUserCredits.js";

// export const imgGenAgent = async (state) => {
//   try {
//     const llm = await getModel("image");

//     const res = await llm.invoke(`
//         You are an elite AI image prompt engineer.
        
//         Convert the user request into a highly detailed image generation prompt.
        
//         Requirements:
        
//         - Cinematic lighting
//         - Professional composition
//         - Ultra realistic
//         - High detail
//         - Beatiful  color palette
//         - Sharp focus
//         - 8k Quality
//         - Photorealistic
//         - Depth of field
//         - Professional photography
//         - Stunning visuals

//         Return only the prompt.

//         User Request for image generation:
//         ${state.prompt}
//         `)

//     const enhancedPrompt = res.content.trim();
    
//     const imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}`;

//     const imageRes = await axios.get(imageURL, { responseType: "arraybuffer" });
//     //console.log(imageRes);

//     const buffer = Buffer.from(imageRes?.data);
//     const filename = `image-${Date.now()}.png`;

//     await uploadToS3(filename, buffer, "image/png");
//     const downloadURL = await getFromS3(filename, 60 * 10);

//     return {
//       ...state,
//       aiResponse: `
//             🖼️ Image Generated Successfully

// ![Generated Image](${downloadURL})

// 📥 [Download Image](${downloadURL})

// ⏳ Link expires in 10 minutes.
//             `,
//     };
//   } catch (error) {
//     console.log("Image Agent Error:", error);
//     return {
//       ...state,
//       aiResponse: "❌ Failed to generate image.",
//     };
//   }
// }; ----------------------------------------------------


// export const imgGenAgent = async (state) => {

//   try {
    
//     const llm = await getModel("image")

//   const systemPrompt = `
//         You are an elite AI image prompt engineer.
        
//         Convert the user request into a highly detailed image generation prompt.
        
//         Requirements:
        
//         - Cinematic lighting
//         - Professional composition
//         - Ultra realistic
//         - High detail
//         - Beatiful  color palette
//         - Sharp focus
//         - 8k Quality
//         - Photorealistic
//         - Depth of field
//         - Professional photography
//         - Stunning visuals

//         Return only the prompt.

//         User Request for image generation:
//         ${state.prompt}
//   `
//   const res = await llm.invoke(systemPrompt)

//   const enhancedPrompt = res.content.trim();

//   const result = await generateImage(enhancedPrompt);

//   const imageURL = result?.content[0]?.uri;
//   console.log(
//   JSON.stringify(result, null, 2)
//   );
//   return {
//       ...state,
//       aiResponse: `
//             🖼️ Image Generated Successfully

// ![Generated Image](${imageURL})

// 📥 [Download Image](${imageURL})

// ⏳ Link expires in 10 minutes.
//             `,
//     };
//   } catch (error) {
//    console.log("Image Agent Error:", error);
//     return {
//       ...state,
//       aiResponse: "❌ Failed to generate image.",
//     };
//   }
  
// }

export const imgGenAgent = async (state) => {

  try {
    
    const llm = await getModel("image")

  const systemPrompt = `
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
  `
  const res = await llm.invoke(systemPrompt)

  const enhancedPrompt = res.content.trim();

  const result = await generateImage(enhancedPrompt);

  //1. MCP result se Pollinations URI get ki
  const imageUri = result?.content?.find(
    item => item.type === "resource_link"
  )?.uri;

  if(!imageUri){
    throw new Error("Image URI not found in MCP response")
  }
  
  console.log("Pollinations Image URI: ",imageUri);

  //2. URI se actual image download kro

  const imageRes = await axios.get(imageUri,
    {
      responseType: "arraybuffer"
    }
  )

  //3. ArrayBuffer --> Node.js Buffer

  const buffer = Buffer.from(imageRes?.data);
  const filename = `image-${Date.now()}.jpg`;

  //4. S3 pr upload
  await uploadToS3(filename, buffer, "image/jpeg");

  //5. S3 se url nikalo
  const downloadURL = await getFromS3(filename, 60 * 10);

  await deductUserCredits(state.userId,"image")

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
  
}