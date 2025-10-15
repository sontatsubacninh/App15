
import { GoogleGenAI, Modality } from "@google/genai";

// This check is important for environments where API_KEY might not be set.
if (!process.env.API_KEY) {
    // In a real app, you might want to handle this more gracefully,
    // but for this context, throwing an error is clear.
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImageFromImageAndPrompt = async (
    base64ImageData: string,
    mimeType: string,
    prompt: string
): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        // Loop through the parts to find the image data
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                // Return the image as a data URL
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }

        // If no image is found in the response
        throw new Error("No image data found in the API response.");

    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        // Provide a more user-friendly error message
        throw new Error("Failed to generate image. The model may have refused the request due to safety policies or an internal error.");
    }
};
