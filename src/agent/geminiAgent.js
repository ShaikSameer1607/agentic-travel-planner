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
      throw new Error(`Agent API error: ${response.statusText}`);
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
