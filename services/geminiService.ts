import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProductDescription = async (productName: string, features: string): Promise<string> => {
  if (!apiKey) return "API Key missing for AI generation.";
  
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
  if (!apiKey) return null;
  
  try {
    // Attempting to use the model to edit the image (e.g., remove background)
    // Note: Complex editing might require specific Imagen models or fine-tuning, 
    // but we will use the edit instruction pattern with the 2.5-flash-image or 3-pro-image.
    
    // Cleaning the base64 string if it has the header
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using flash-image for efficiency
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png', // Assuming PNG for transparency support
            },
          },
          {
            text: prompt, // e.g. "Remove the background and return only the object on a transparent background"
          },
        ],
      },
    });

    // Check for image in response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
    
    return null;
  } catch (error) {
    console.error("AI Image Edit Error:", error);
    return null;
  }
};