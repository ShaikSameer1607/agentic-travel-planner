import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import { runAgent } from "../agent/geminiAgent";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [iterations, setIterations] = useState(0);
  const [mockMode, setMockMode] = useState(false);

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
        setSteps(output.executionSteps.map((step, idx) => {
          if (step.functions) {
            return `${step.step}: ${step.functions.join(", ")}`;
          }
          return step.step || JSON.stringify(step).substring(0, 100);
        }));
      }

      setResult(output.itinerary);
      setIterations(output.iterations || 0);
      setMockMode(output.mockMode || false);
    } catch (error) {
      alert("Something went wrong while generating itinerary: " + error.message);
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
    <div className="min-h-screen p-8 gradient-bg text-white space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-neonBlue">
          Agentic Travel Planner
        </h1>
        <p className="text-gray-400 mt-2">
          Describe your trip and let the AI agent plan everything for you
        </p>
        {mockMode && (
          <div className="mt-3 px-4 py-2 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-300 text-sm">
            ⚠️ Running in MOCK MODE - Update Gemini API key in backend/.env for real AI planning
          </div>
        )}
      </div>

      {/* Prompt Input */}
      <div className="glass p-6 rounded-2xl backdrop-blur glow-blue">
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
        className="px-8 py-4 bg-gradient-to-r from-neonPurple to-neonBlue rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50 glow-purple"
      >
        {loading ? "🤖 AI Agent Planning..." : "✨ Generate Itinerary"}
      </button>

      {/* Agent Steps */}
      {steps.length > 0 && (
        <div className="glass p-6 rounded-2xl space-y-2 glow-blue">
          <h3 className="text-xl font-semibold mb-3 text-neonBlue">
            🤖 Agent Execution {iterations > 0 && `(${iterations} iterations)`}
          </h3>
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-black/40 text-sm flex items-start gap-3 hover:bg-black/60"
            >
              <span className="text-neonBlue font-bold">{index + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* JSON Output */}
      {result && (
        <div className="glass p-6 rounded-2xl overflow-auto glow-purple">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-neonPurple">
              📋 Generated Itinerary (JSON)
            </h3>
            <button
              onClick={downloadItinerary}
              className="px-4 py-2 bg-neonBlue rounded-lg text-sm font-semibold hover:scale-105"
            >
              ⬇️ Download JSON
            </button>
          </div>
          <pre className="text-sm bg-black/50 p-4 rounded-xl overflow-x-auto text-green-400">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
