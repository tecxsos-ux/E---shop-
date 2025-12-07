import { GoogleGenAI } from "@google/genai";

// Initialize the client safely. If API_KEY is missing (e.g. on client side), handle gracefully.
const apiKey = process.env.API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateProductDescription = async (productName: string, features: string): Promise<string> => {
  if (!ai) return "AI Service Unavailable (Missing Key)";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a compelling, SEO-friendly ecommerce product description for a "${productName}". Key features: ${features}. Keep it under 100 words.`
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Failed to generate description.";
  }
};

export const editProductImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  if (!ai) {
      console.error("AI Service Unavailable");
      return null;
  }
  try {
    // Remove the data URL prefix if present to get raw base64
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png', // API supports common formats, but mimeType in inlineData helps
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image part as per guidelines.
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
           if (part.inlineData) {
             return `data:image/png;base64,${part.inlineData.data}`;
           }
        }
    }
    
    return null;
  } catch (error) {
    console.error("AI Image Edit Error:", error);
    return null;
  }
};