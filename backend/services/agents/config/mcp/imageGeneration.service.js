import { getPollinationsClient } from "./pollinationsClient.js";

export const generateImage = async (prompt) => {

  const client = await getPollinationsClient();

//   const tools = await client.listTools();
//   console.log(tools.tools);

  const result = await client.callTool({
    name: "generateImage",
    arguments: {
      prompt: prompt,
    },
  });

  return result;
};