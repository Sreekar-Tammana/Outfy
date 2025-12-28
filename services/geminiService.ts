
import { GoogleGenAI } from "@google/genai";

// Toggle this variable to switch between development (free) and deployment (dummy key)
const IS_DEPLOYED = false;

export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async generateTryOn(
    userImageBase64: string,
    outfitImageBase64: string,
    instruction: string
  ): Promise<string | null> {
    try {
      // Stripping data URL prefix if present
      const cleanUserImg = userImageBase64.split(',')[1] || userImageBase64;
      const cleanOutfitImg = outfitImageBase64.split(',')[1] || outfitImageBase64;

      /**
       * API Key Selection Logic:
       * If IS_DEPLOYED is true, uses a placeholder dummy key.
       * If IS_DEPLOYED is false, uses the environment-provided free API key.
       */
      const selectedApiKey = IS_DEPLOYED 
        ? 'DUMMY_API_KEY_FOR_DEPLOYMENT' 
        : process.env.API_KEY;

      // Always instantiate a new GoogleGenAI before making calls to ensure latest configuration.
      const ai = new GoogleGenAI({ apiKey: selectedApiKey || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanUserImg,
                mimeType: 'image/png',
              },
            },
            {
              inlineData: {
                data: cleanOutfitImg,
                mimeType: 'image/png',
              },
            },
            {
              text: `This is a virtual try-on request. The first image is the user's portrait. The second image contains the outfit/clothing items. Please photorealistically apply the outfit from the second image onto the person in the first image. Specific instruction: ${instruction}. Maintain the user's facial features and posture.`,
            },
          ],
        },
      });

      // Iterate through candidates and parts to find the generated image as per guidelines.
      if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Try-On Error:", error);
      throw error;
    }
  }
}
