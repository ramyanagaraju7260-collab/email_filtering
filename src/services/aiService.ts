import { GoogleGenAI, Type } from "@google/genai";
import { Email, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const categorizeEmail = async (email: { subject: string; body: string }): Promise<{
  category: Category;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  tags: string[];
  isSpam: boolean;
}> => {
  if (!process.env.GEMINI_API_KEY) {
    return {
      category: 'Updates',
      sentiment: 'neutral',
      summary: 'API Key not set.',
      tags: [],
      isSpam: false
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform high-precision neural analysis on this email. 
      Subject: ${email.subject}. 
      Body: ${email.body.substring(0, 1000)}. 
      
      Critical Objective: Identify malicious intent, phishing patterns, or spam.
      
      Return a JSON object with: 
      - category: One of [Spam, Important, Promotions, Social, Updates]. Use 'Spam' if there are clickbait elements or suspicious requests.
      - sentiment: [positive, negative, neutral]
      - summary: Clear analysis of intent (max 25 words).
      - tags: array of 2-3 technical descriptors.
      - isSpam: true only if dangerous or junk.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            isSpam: { type: Type.BOOLEAN }
          },
          required: ["category", "sentiment", "summary", "tags", "isSpam"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("AI Categorization failed", error);
    return {
      category: 'Updates',
      sentiment: 'neutral',
      summary: 'Processing failed.',
      tags: [],
      isSpam: false
    };
  }
};
