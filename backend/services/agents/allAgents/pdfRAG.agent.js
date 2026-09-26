import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { getVectorStore } from "../config/RAG/vectorDB.js";
import { getModel } from "./../config/llmModels.js";
import { deductUserCredits } from "./../utils/deductUserCredits.js";

export const pdfRAGAgent = async (state) => {

  const filePath = state.file.path;

  try {

    // -----------------------------
    // 1. Read temporary PDF
    // -----------------------------

    const pdfBuffer = await fs.readFile(filePath);

    // -----------------------------
    // 2. Parse PDF
    // -----------------------------

    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const pdfResult = await parser.getText();

    const text = pdfResult.text;

    if (!text?.trim()) {
      throw new Error("No text could be extracted from PDF");
    }

    await parser.destroy();

    console.log("PDF text extracted successfully");
    console.log("Total characters:", text.length);

    // -----------------------------
    // 3. Split text into chunks
    // -----------------------------

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([text]);

    console.log(`Total chunks: ${chunks.length}`);

    // -----------------------------
    // 4. Add metadata
    // -----------------------------

    const documentsWithMetadata = chunks.map((chunk) => ({
      ...chunk,

      metadata: {
        ...chunk.metadata,
        source: state.file.originalname,
      },
    }));

    // -----------------------------
    // 5. Create Qdrant collection
    //    + Generate embeddings
    //    + Store documents
    // -----------------------------

    const vectorStore = await getVectorStore(
      state.file.originalname,
      documentsWithMetadata
    );

    console.log("PDF chunks stored in Qdrant");

    // -----------------------------
    // 6. Similarity Search
    // -----------------------------

    const relevantChunks = await vectorStore.similaritySearch(
      state.prompt,
      5
    );

    console.log(
      `Relevant chunks found: ${relevantChunks.length}`
    );

    // -----------------------------
    // 7. Create Context
    // -----------------------------

    const context = relevantChunks
      .map((doc, index) => {
        return `
SOURCE ${index + 1}

${doc.pageContent}
`;
      })
      .join("\n\n");

    // -----------------------------
    // 8. System Prompt
    // -----------------------------

    const systemPrompt = `
You are a PDF RAG Agent.

Your job is to answer the user's question
strictly using the information retrieved
from the uploaded PDF.

Rules:

1. Answer ONLY using the provided PDF context.

2. Do not use external knowledge.

3. Do not hallucinate or invent information.

4. If the answer cannot be found in the
   provided PDF context, say:

"I could not find the answer to this
question in the uploaded PDF."

5. Keep the answer directly relevant
   to the user's question.

6. Do not answer unrelated questions.

7. Treat the retrieved PDF context as
   the only source of truth.

PDF CONTEXT:

${context}
`;

    // -----------------------------
    // 9. Gemini
    // -----------------------------

    const pdfLLM = await getModel("pdfRAG");

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(state.prompt),
    ];

    const result = await pdfLLM.invoke(messages);

    // -----------------------------
    // 10. Deduct credits
    // -----------------------------

    await deductUserCredits(
      state.userId,
      "pdf"
    );

    // -----------------------------
    // 11. Return State
    // -----------------------------

    return {
      ...state,
      aiResponse: result.content
    };

  } catch (error) {

    console.error(
      "PDF RAG Agent Error:",
      error
    );

    return {
      ...state,
      aiResponse: "Failed to analyze PDF",
    };

  } finally {

    // -----------------------------
    // Delete temporary PDF
    // -----------------------------

    try {

      await fs.unlink(filePath);

      console.log(
        "Temporary PDF deleted"
      );

    } catch (unlinkError) {

      console.error(
        "Failed to delete temporary PDF:",
        unlinkError.message
      );

    }
  }
};