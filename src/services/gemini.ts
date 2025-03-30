import { fal } from "@fal-ai/client";

// Configure Fal client with API key
fal.config({
  credentials: process.env.FAL_KEY
});

interface TransformResult {
  inputImage: string;
  outputImage: string;
}

export async function GeminiFlashEdit(
	prompt: string, 
	images: string[]
): Promise<TransformResult[]> {
  try {
    // Process each image in parallel
    const transformPromises = images.map(async (imageUrl) => {
      const result = await fal.subscribe("fal-ai/gemini-flash-edit", {
        input: {
          prompt,
          image_url: imageUrl
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("Processing image:", imageUrl);
          }
        },
      });

      return {
        inputImage: imageUrl,
        outputImage: result.data.image.url
      };
    });

    const results = await Promise.all(transformPromises);
    return results;
  } catch (error) {
    console.error("Error transforming images:", error);
    throw error;
  }
} 