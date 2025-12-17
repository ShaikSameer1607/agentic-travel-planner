export async function runAgent({ prompt, image }) {
  try {
    // Prepare image data if exists
    let imageData = null;
    if (image) {
      // Convert image to base64 if needed
      imageData = image;
    }

    // Call the backend agent endpoint
    const response = await fetch("http://localhost:5000/api/agent/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        imageData,
      }),
    });

    if (!response.ok) {
      // Try to parse error response
      let errorMessage = `Agent API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
          // Handle specific Gemini API quota error
          if (errorMessage.includes('quota') || errorMessage.includes('Quota')) {
            errorMessage = 'You have exceeded your daily quota for the Gemini API. Please try again tomorrow or use a different API key.';
          }
        }
      } catch (parseError) {
        // If we can't parse the error, use the generic message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Agent execution failed");
    }

    // Return the itinerary and execution steps
    return {
      itinerary: data.itinerary,
      executionSteps: data.executionSteps,
      iterations: data.iterations,
    };
  } catch (error) {
    console.error("Agent error:", error);
    throw error;
  }
}
