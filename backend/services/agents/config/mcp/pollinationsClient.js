import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

let mcpClient = null;

export const getPollinationsClient = async () => {

  if (mcpClient) {
    return mcpClient;
  }

  mcpClient = new Client({
    name: "multi-agent-ai",
    version: "1.0.0",
  });

// https://gen.pollinations.ai/mcp/pollinations

  const transport = new StreamableHTTPClientTransport(
    new URL("https://gen.pollinations.ai/mcp/pollinations"),
    {
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}`,
        },
      },
    }
  );

 await mcpClient.connect(transport);

  console.log("Connected to Pollinations MCP");

  return mcpClient;
};