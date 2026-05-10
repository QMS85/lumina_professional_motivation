
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { QuoteTheme, QuoteGenerationResult } from "../types";

const API_KEY = process.env.API_KEY || '';

export const generateQuote = async (theme: QuoteTheme): Promise<QuoteGenerationResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a sophisticated, professional, and unique motivational quote about ${theme}. 
    Avoid clichés like 'don't give up' or 'believe in yourself'. 
    The quote should sound like it was written by a modern-day philosopher or a high-impact CEO. 
    It should be punchy, insightful, and profoundly positive.`,
    config: {
      thinkingConfig: { thinkingBudget: 2000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          quote: {
            type: Type.STRING,
            description: 'The bespoke motivational quote.',
          },
          author: {
            type: Type.STRING,
            description: 'A sophisticated fictional or historical-sounding author name, or attribution.',
          },
        },
        required: ["quote", "author"]
      },
    },
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return {
      quote: data.quote || "The future belongs to those who prepare for it today.",
      author: data.author || "Lumina Wisdom"
    };
  } catch (error) {
    console.error("Failed to parse quote JSON", error);
    return {
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    };
  }
};

export const generateQuoteImage = async (quote: string, theme: string): Promise<string | undefined> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `Create a stunning, minimalist, and abstract background image for a professional quote about ${theme}. 
  The mood should be elegant, sophisticated, and inspirational. Use a high-end color palette like deep teals, 
  muted golds, or atmospheric charcoal. No text in the image. Cinematic lighting, soft bokeh, and high-quality textures.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};
