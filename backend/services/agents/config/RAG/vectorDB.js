import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embedding.js";

export const getVectorStore = async (filename,documentsWithMetadata) => {
  const collectionName = filename
    .replace(/\.pdf$/i, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")

    console.log(collectionName)

  const vectorStore = await QdrantVectorStore.fromDocuments(
    documentsWithMetadata,
    embeddings,
    {
      url: process.env.QDRANT_ENDPOINT,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName,
    },
  );

  return vectorStore;
};
