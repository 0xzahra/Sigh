import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { GeneratedContent, Citation } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Define the response schema for structured output
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    formattedText: {
      type: Type.STRING,
      description: "The polished content with Bionic Reading (markdown bolding) applied."
    },
    directorNotes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Stage directions for the teleprompter."
    },
    citations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          url: { type: Type.STRING },
          title: { type: Type.STRING },
        }
      }
    }
  },
  required: ["formattedText", "directorNotes"]
};

export const refineContent = async (input: string): Promise<GeneratedContent> => {
  try {
    const model = 'gemini-3-pro-preview';

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [{ text: input }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No content generated");

    const parsed = JSON.parse(jsonText);

    // Extract grounding chunks if available in metadata, otherwise use what the model hallucinated nicely in the JSON (but we prefer grounding metadata)
    let finalCitations: Citation[] = parsed.citations || [];

    // Attempt to merge real grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      const realCitations = groundingChunks
        .map((chunk: any) => chunk.web?.uri ? { url: chunk.web.uri, title: chunk.web.title || "Source" } : null)
        .filter((c: any) => c !== null);
      
      if (realCitations.length > 0) {
        finalCitations = realCitations;
      }
    }

    return {
      rawText: parsed.formattedText.replace(/\*\*/g, ''), // Strip bold for raw
      formattedText: parsed.formattedText,
      citations: finalCitations,
      directorNotes: parsed.directorNotes || []
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};