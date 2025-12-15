import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const router = express.Router();

// Lazy initialization function for Gemini
function getGeminiInstance() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 20) {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return null;
}

// Define function declarations for Gemini
const functionDeclarations = [
  {
    name: "get_weather",
    description: "Get weather forecast for a city",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The city name to get weather for",
        },
      },
      required: ["city"],
    },
  },
  {
    name: "get_places",
    description: "Get tourist attractions and landmarks for a city",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The city name to find attractions in",
        },
      },
      required: ["city"],
    },
  },
  {
    name: "get_flights",
    description: "Get flight information between two locations",
    parameters: {
      type: "object",
      properties: {
        source: {
          type: "string",
          description: "Departure city or IATA code",
        },
        destination: {
          type: "string",
          description: "Arrival city or IATA code",
        },
        date: {
          type: "string",
          description: "Departure date in YYYY-MM-DD format",
        },
      },
      required: ["source", "destination"],
    },
  },
  {
    name: "get_hotels",
    description: "Get hotel recommendations for a city",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The city name to find hotels in",
        },
        budget: {
          type: "string",
          description: "Budget level: Low, Medium, or High",
        },
      },
      required: ["city"],
    },
  },
  {
    name: "get_news",
    description: "Get recent travel news and information about a destination",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The city or destination to get news about",
        },
      },
      required: ["city"],
    },
  },
];

// Mock mode handler for testing without valid API key
async function handleMockMode(req, res, prompt, imageData) {
  const executionSteps = [];
  
  // Simulate agent thinking
  executionSteps.push({
    step: "[MOCK MODE] Parsing travel request",
  });

  // Extract destination from prompt (simple parsing)
  const destinations = ["Paris", "Tokyo", "Bali", "New York", "London", "Dubai"];
  let destination = "Paris";
  
  for (const city of destinations) {
    if (prompt.toLowerCase().includes(city.toLowerCase())) {
      destination = city;
      break;
    }
  }

  executionSteps.push({
    step: `Detected destination: ${destination}`,
  });

  // Simulate image analysis
  if (imageData) {
    executionSteps.push({
      step: "Analyzing uploaded image for aesthetic preferences",
    });
  }

  // Simulate function calls
  executionSteps.push({
    step: "Iteration 1: Calling functions",
    functions: ["get_weather", "get_places"],
  });

  // Call weather API
  let weatherData;
  try {
    weatherData = await executeFunction("get_weather", { city: destination });
    executionSteps.push({
      step: "Executed get_weather",
      args: { city: destination },
      result: weatherData,
    });
  } catch (error) {
    weatherData = { main: { temp: 20 }, weather: [{ description: "partly cloudy" }] };
  }

  // Call places API
  let placesData;
  try {
    placesData = await executeFunction("get_places", { city: destination });
    executionSteps.push({
      step: "Executed get_places",
      args: { city: destination },
      result: placesData,
    });
  } catch (error) {
    placesData = [];
  }

  executionSteps.push({
    step: "Iteration 2: Calling functions",
    functions: ["get_hotels", "get_flights"],
  });

  // Call hotels API
  let hotelsData;
  try {
    hotelsData = await executeFunction("get_hotels", { city: destination, budget: "Medium" });
    executionSteps.push({
      step: "Executed get_hotels",
      args: { city: destination, budget: "Medium" },
      result: hotelsData,
    });
  } catch (error) {
    hotelsData = { hotels: ["Grand Hotel", "City Center Inn", "Comfort Suites"] };
  }

  // Call flights API
  let flightsData;
  try {
    flightsData = await executeFunction("get_flights", { source: "NYC", destination });
    executionSteps.push({
      step: "Executed get_flights",
      args: { source: "NYC", destination },
      result: flightsData,
    });
  } catch (error) {
    flightsData = { available: true, price_range: "$500-$1200" };
  }

  executionSteps.push({
    step: "Generated final itinerary",
  });

  // Create structured itinerary
  const itinerary = {
    trip_overview: {
      destination: destination,
      duration: "7 days",
      travel_style: imageData ? "Personalized based on image inspiration" : "Balanced exploration",
      budget_level: "Medium",
      mode: "MOCK - Update Gemini API key for real AI planning",
    },
    daily_itinerary: [
      {
        day: 1,
        date: "2025-01-15",
        weather: weatherData.weather ? `${weatherData.weather[0].description}, ${Math.round(weatherData.main.temp)}°C` : "Partly cloudy, 20°C",
        activities: [
          "Arrival and hotel check-in",
          "Evening city orientation walk",
          "Welcome dinner at local restaurant",
        ],
        places: placesData.length > 0 ? placesData.slice(0, 2).map(p => p.properties?.name || "Tourist Attraction") : ["Main Square", "Historic District"],
        notes: "Take it easy on the first day to adjust",
      },
      {
        day: 2,
        date: "2025-01-16",
        weather: "Sunny, 22°C",
        activities: [
          "Morning museum visit",
          "Lunch at local cafe",
          "Afternoon sightseeing tour",
          "Evening cultural show",
        ],
        places: placesData.length > 0 ? placesData.slice(2, 4).map(p => p.properties?.name || "Landmark") : ["National Museum", "Cathedral"],
        notes: "Book tickets in advance for popular attractions",
      },
      {
        day: 3,
        date: "2025-01-17",
        weather: "Partly cloudy, 19°C",
        activities: [
          "Day trip to nearby attraction",
          "Local cuisine food tour",
          "Shopping at local markets",
        ],
        places: ["Day Trip Destination", "Local Markets"],
        notes: "Bring comfortable walking shoes",
      },
    ],
    flights: {
      summary: flightsData.price_range || "Multiple options available",
      recommendation: "Book 2-3 months in advance for best prices",
    },
    hotels: {
      recommendations: hotelsData.hotels || ["Central Hotel", "Boutique Inn", "Comfort Suites"],
      tip: "Consider location near public transportation",
    },
    estimated_budget: "$2000 - $3500",
    tips: [
      "Check visa requirements well in advance",
      "Purchase travel insurance",
      "Download offline maps",
      "Learn basic local phrases",
    ],
  };

  res.json({
    success: true,
    itinerary,
    executionSteps,
    iterations: 2,
    mockMode: true,
  });
}

// Tool execution functions
async function executeFunction(functionName, args) {
  const baseURL = "http://localhost:5000/api";

  try {
    switch (functionName) {
      case "get_weather": {
        const response = await axios.get(
          `${baseURL}/weather?city=${args.city}`
        );
        return response.data;
      }
      case "get_places": {
        const response = await axios.get(`${baseURL}/places?city=${args.city}`);
        return response.data;
      }
      case "get_flights": {
        const response = await axios.get(
          `${baseURL}/flights?source=${args.source}&destination=${args.destination}`
        );
        return response.data;
      }
      case "get_hotels": {
        const response = await axios.get(
          `${baseURL}/hotels?city=${args.city}&budget=${args.budget || "Medium"}`
        );
        return response.data;
      }
      case "get_news": {
        const response = await axios.get(`${baseURL}/news?city=${args.city}`);
        return response.data;
      }
      default:
        return { error: "Unknown function" };
    }
  } catch (error) {
    console.error(`Error executing ${functionName}:`, error.message);
    return { error: error.message };
  }
}

router.post("/plan", async (req, res) => {
  const { prompt, imageData } = req.body;

  console.log("📥 Received planning request:", prompt?.substring(0, 60));

  // Get Gemini instance
  const genAI = getGeminiInstance();
  
  if (!genAI) {
    return res.status(500).json({
      success: false,
      error: "GEMINI_API_KEY not configured in backend/.env",
      help: "Get your API key from https://makersuite.google.com/app/apikey",
    });
  }

  console.log("✅ Gemini API key detected - Using REAL AI AGENT");

  try {
    console.log("🤖 Starting Gemini AI agent with function calling...");
    
    // Use Gemini 1.5 Flash (proven model with best free tier quota)
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      tools: [{ functionDeclarations }],
    });

    // Build system prompt with function calling instructions
    const systemPrompt = `You are an autonomous AI travel planning agent with access to real-time tools.

Your capabilities:
1. Parse natural language travel requests
2. Extract: destination, duration, budget, travel style
3. Analyze uploaded images for mood/aesthetic preferences
4. Call functions to gather real data (NO hallucination)
5. Generate structured JSON itineraries

Available functions:
- get_weather(city): Real-time weather data
- get_places(city): Tourist attractions and landmarks
- get_hotels(city, budget): Hotel recommendations
- get_flights(source, destination, date): Flight information
- get_news(city): Recent travel news

RULES:
- ALWAYS call functions for real-world data
- NEVER invent/hallucinate weather, places, hotels, or flights
- Use function results to build accurate itineraries
- Output MUST be valid JSON

Output Structure:
{
  "trip_overview": {
    "destination": "city name",
    "duration": "X days",
    "travel_style": "based on prompt and image",
    "budget_level": "Low/Medium/High"
  },
  "daily_itinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "weather": "from get_weather",
      "morning": ["activity"],
      "afternoon": ["activity"],
      "evening": ["activity"],
      "places": ["from get_places"],
      "meals": {"breakfast": "", "lunch": "", "dinner": ""},
      "notes": "tips and recommendations"
    }
  ],
  "flights": {
    "outbound": "from get_flights or recommendation",
    "return": "from get_flights or recommendation",
    "tips": "booking advice"
  },
  "hotels": {
    "recommendations": ["from get_hotels"],
    "location_tips": "where to stay"
  },
  "estimated_budget": "$X - $Y per person",
  "packing_list": ["essential items based on weather and activities"],
  "local_tips": ["cultural tips, customs, phrases"]
}`;

    let userMessage = `${systemPrompt}\n\nUser's travel request: ${prompt}`;

    if (imageData) {
      userMessage += `\n\nImage uploaded: Analyze the aesthetic and mood to infer:
- Travel style (luxury, adventure, relaxed, cultural, romantic, etc.)
- Preferred atmosphere (urban, nature, beach, mountains, etc.)
- Activity level (active, moderate, leisurely)
Use this to personalize the itinerary tone and recommendations.`;
    }

    const chat = model.startChat({
      history: [],
    });

    console.log("💬 Sending initial prompt to Gemini...");
    let result = await chat.sendMessage(userMessage);
    let executionSteps = [];
    let iterationCount = 0;
    const MAX_ITERATIONS = 10;

    executionSteps.push({
      step: "Initial prompt sent to Gemini AI",
      timestamp: new Date().toISOString(),
    });

    // Function calling loop
    while (result.response.functionCalls() && iterationCount < MAX_ITERATIONS) {
      iterationCount++;
      const functionCalls = result.response.functionCalls();

      console.log(`🔄 Iteration ${iterationCount}: Gemini requesting functions:`, functionCalls.map(fc => fc.name));

      executionSteps.push({
        step: `Iteration ${iterationCount}: AI decided to call functions`,
        functions: functionCalls.map((fc) => fc.name),
        timestamp: new Date().toISOString(),
      });

      // Execute all function calls in parallel
      const functionResponses = await Promise.all(
        functionCalls.map(async (fc) => {
          console.log(`  ⚙️  Executing: ${fc.name}(${JSON.stringify(fc.args)})`);
          
          const functionResult = await executeFunction(fc.name, fc.args);
          
          executionSteps.push({
            step: `Executed ${fc.name}`,
            args: fc.args,
            result: functionResult,
            timestamp: new Date().toISOString(),
          });

          return {
            functionResponse: {
              name: fc.name,
              response: {
                content: functionResult,
              },
            },
          };
        })
      );

      console.log(`✅ Sending ${functionResponses.length} function results back to Gemini...`);
      result = await chat.sendMessage(functionResponses);
    }

    console.log("✅ Function calling complete. Extracting final response...");
    
    // Get final response
    const finalResponse = result.response.text();
    
    executionSteps.push({
      step: "Generated final itinerary",
      timestamp: new Date().toISOString(),
    });

    console.log("📋 Final response length:", finalResponse.length, "characters");

    // Parse JSON from response
    let itinerary;
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = finalResponse.match(/```json\n([\s\S]*?)\n```/) ||
                        finalResponse.match(/```\n([\s\S]*?)\n```/) ||
                        finalResponse.match(/\{[\s\S]*\}/);
      
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : finalResponse;
      itinerary = JSON.parse(jsonText.trim());
      
      console.log("✅ Successfully parsed JSON itinerary");
    } catch (parseError) {
      console.error("❌ JSON parsing failed:", parseError.message);
      console.log("📝 Attempting to extract JSON manually...");
      
      // Fallback: try to find JSON object in response
      try {
        const startIdx = finalResponse.indexOf('{');
        const endIdx = finalResponse.lastIndexOf('}') + 1;
        if (startIdx !== -1 && endIdx > startIdx) {
          const extractedJson = finalResponse.substring(startIdx, endIdx);
          itinerary = JSON.parse(extractedJson);
          console.log("✅ Successfully extracted and parsed JSON");
        } else {
          throw new Error("No JSON object found in response");
        }
      } catch (fallbackError) {
        console.error("❌ Fallback JSON extraction also failed");
        return res.status(500).json({
          success: false,
          error: "Failed to parse AI response as JSON",
          rawResponse: finalResponse.substring(0, 1000),
          parseError: parseError.message,
        });
      }
    }

    res.json({
      success: true,
      itinerary,
      execution_steps: executionSteps,
      metadata: {
        model: "gemini-flash-latest",
        iterations: iterationCount,
        generatedAt: new Date().toISOString(),
        promptLength: prompt.length,
      },
    });
    
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    console.log("🔍 Full error:", error);
    
    // Return clear error - NO FALLBACK TO MOCK
    return res.status(500).json({
      success: false,
      error: "Gemini API call failed",
      message: error.message,
      details: {
        apiKeyPresent: !!process.env.GEMINI_API_KEY,
        apiKeyLength: process.env.GEMINI_API_KEY?.length,
        errorType: error.name,
        status: error.status,
      },
      solution: "Get a valid Gemini API key from https://makersuite.google.com/app/apikey and update backend/.env",
    });
  }
});

export default router;
