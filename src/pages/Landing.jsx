import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg flex flex-col justify-center items-center text-center px-4">
      <div className="mb-8 animate-pulse">
        <div className="text-6xl">🤖✨</div>
      </div>
      
      <h1 className="text-6xl font-bold text-neonBlue glow-blue mb-4">
        Agentic Travel Planner
      </h1>

      <p className="mt-4 text-gray-300 max-w-2xl text-lg">
        Plan entire journeys with autonomous AI using agentic workflows and real-time tools.
        Let our AI agent autonomously call multiple APIs to create your perfect itinerary.
      </p>

      <div className="mt-6 flex gap-4 text-sm text-gray-400">
        <span className="glass px-4 py-2 rounded-lg">🌦️ Live Weather</span>
        <span className="glass px-4 py-2 rounded-lg">📍 Tourist Places</span>
        <span className="glass px-4 py-2 rounded-lg">✈️ Flight Info</span>
        <span className="glass px-4 py-2 rounded-lg">🏨 Hotels</span>
      </div>

      <button
        onClick={() => navigate("/login")}
        className="mt-12 px-10 py-4 rounded-xl bg-gradient-to-r from-neonPurple to-neonBlue hover:scale-105 transition-all font-semibold text-lg glow-purple"
      >
        🚀 Start Planning
      </button>
    </div>
  );
}
