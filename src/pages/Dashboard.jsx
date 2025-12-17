import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import { runAgent } from "../agent/geminiAgent";
import AgentStepper from "../components/AgentStepper";
import ItineraryCard from "../components/ItineraryCard";
import LoadingSpinner from "../components/LoadingSpinner";
import AdvancedMap from "../components/AdvancedMap";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const [iterations, setIterations] = useState(0);

  const generateItinerary = async () => {
    if (!prompt) {
      alert("Please describe your trip");
      return;
    }

    setLoading(true);
    setResult(null);
    setSteps([]);
    setIterations(0);

    // Initial loading message
    setSteps(["Initializing AI agent..."]);

    try {
      const output = await runAgent({
        prompt,
        image,
      });

      // Update with actual execution steps
      if (output.executionSteps) {
        setSteps(output.executionSteps.map((step) => {
          if (step.step) {
            return step.step;
          }
          if (step.functions) {
            return `Calling functions: ${step.functions.join(", ")}`;
          }
          return JSON.stringify(step).substring(0, 100);
        }));
      }

      setResult(output.itinerary);
      setIterations(output.iterations || 0);
      setMockMode(output.mockMode || false);
    } catch (error) {
      let errorMessage = error.message;
      
      // Handle specific error cases
      if (errorMessage.includes('quota') || errorMessage.includes('Quota')) {
        errorMessage = 'You have exceeded your daily quota for the Gemini API. Please try again tomorrow or use a different API key.\n\nSolution: Get a new Gemini API key from https://makersuite.google.com/app/apikey and update it in backend/.env';
      } else if (errorMessage.includes('API key')) {
        errorMessage = 'Invalid or missing Gemini API key.\n\nSolution: Get a valid Gemini API key from https://makersuite.google.com/app/apikey and update it in backend/.env';
      } else if (errorMessage.includes('network')) {
        errorMessage = 'Network error connecting to the backend. Please make sure the backend server is running on http://localhost:5000';
      } else {
        errorMessage = "Something went wrong while generating itinerary: " + errorMessage;
      }
      
      alert(errorMessage);
      setSteps([...steps, "Error: " + error.message]);
    } finally {
      setLoading(false);
    }
  };

  const downloadItinerary = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'travel-itinerary.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 gradient-bg text-white">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-neonBlue drop-shadow-neonBlue">
          Agentic Travel Planner
        </h1>
        <p className="text-gray-400 mt-2">
          Describe your trip and let the AI agent plan everything for you
        </p>
        {mockMode && (
          <div className="mt-3 px-4 py-2 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-300 text-sm mx-auto max-w-2xl">
            ⚠️ Running in MOCK MODE - Update Gemini API key in backend/.env for real AI planning
          </div>
        )}
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Prompt & Upload */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="glass p-6 rounded-2xl backdrop-blur glow-blue">
            <h2 className="text-xl font-semibold mb-4 text-neonBlue">📝 Describe Your Trip</h2>
            <textarea
              rows={4}
              className="w-full bg-black/40 p-4 rounded-xl outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-neonBlue"
              placeholder="Describe your entire trip in one sentence... (e.g., 'Plan a 7-day luxury trip to Paris with romantic vibes and great food')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <ImageUploader setImage={setImage} />

          {/* Generate Button */}
          <button
            onClick={generateItinerary}
            disabled={loading}
            className="w-full px-8 py-4 bg-gradient-to-r from-neonPurple to-neonBlue rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50 glow-purple"
          >
            {loading ? "🤖 AI Agent Planning..." : "✨ Generate Itinerary"}
          </button>
        </div>

        {/* Middle Column - Agent Execution */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl glow-purple h-full">
            <h2 className="text-xl font-semibold mb-4 text-neonPurple">🤖 Agent Execution {iterations > 0 && `(${iterations} iterations)`}</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : steps.length > 0 ? (
              <AgentStepper steps={steps} iterations={iterations} />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>Enter your travel request and click "Generate Itinerary" to see the AI agent in action</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Interactive Itinerary Cards */}
              <div className="glass p-6 rounded-2xl glow-blue">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-neonBlue">🗺️ Your Itinerary</h2>
                  <button
                    onClick={downloadItinerary}
                    className="px-4 py-2 bg-neonBlue rounded-lg text-sm font-semibold hover:scale-105 glow-on-hover"
                  >
                    ⬇️ Download JSON
                  </button>
                </div>
                
                <div className="mb-6 p-4 bg-black/30 rounded-lg">
                  <h3 className="font-semibold text-neonPink"> Trip Overview</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>Destination: {result.trip_overview?.destination || 'N/A'}</div>
                    <div>Duration: {result.trip_overview?.duration || 'N/A'}</div>
                    <div>Style: {result.trip_overview?.travel_style || 'N/A'}</div>
                    <div>Budget: {result.trip_overview?.budget_level || 'N/A'}</div>
                  </div>
                </div>
                
                {/* Map Overview */}
                <div className="mb-6">
                  <AdvancedMap 
                    city={result?.trip_overview?.destination} 
                    places={result?.daily_itinerary?.flatMap(day => day.places || []) || []} 
                  />
                </div>
                
                <div className="max-h-[500px] overflow-y-auto pr-2">
                  {result.daily_itinerary?.map((day, index) => (
                    <ItineraryCard
                      key={index}
                      day={day.day}
                      date={day.date}
                      weather={day.weather}
                      activities={day.activities || []}
                      places={day.places || []}
                      notes={day.notes}
                      meals={day.meals}
                      city={result?.trip_overview?.destination}
                    />
                  ))}
                </div>
              </div>

              {/* JSON Output */}
              <div className="glass p-6 rounded-2xl overflow-auto glow-purple">
                <h3 className="text-xl font-semibold mb-4 text-neonPurple">
                  📋 Raw JSON Data
                </h3>
                <pre className="text-xs bg-black/50 p-4 rounded-xl overflow-x-auto text-green-400 max-h-60 overflow-y-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            <div className="glass p-6 rounded-2xl glow-blue h-full flex items-center justify-center">
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-4">🌍</div>
                <p>Your personalized travel itinerary will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
