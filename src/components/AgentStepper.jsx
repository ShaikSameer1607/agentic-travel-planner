import { useState, useEffect } from "react";

export default function AgentStepper({ steps, iterations }) {
  const [confetti, setConfetti] = useState([]);

  // Generate confetti when execution is complete
  useEffect(() => {
    if (steps.length > 0 && steps[steps.length - 1].includes("Generated final itinerary")) {
      generateConfetti();
    }
  }, [steps]);

  const generateConfetti = () => {
    const newConfetti = [];
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        color: ['#2EF8FF', '#C95EFF', '#FF3C88'][Math.floor(Math.random() * 3)],
      });
    }
    setConfetti(newConfetti);
  };

  // Map steps to icons and animations
  const getStepIcon = (stepText) => {
    if (stepText.includes("Parsing")) return { icon: "🧠", animation: "icon-pulse" };
    if (stepText.includes("weather")) return { icon: "☀️🌧", animation: "cloud-rain-animation" };
    if (stepText.includes("places")) return { icon: "📍", animation: "pin-bounce-animation" };
    if (stepText.includes("flights")) return { icon: "✈️", animation: "flight-path-animation" };
    if (stepText.includes("hotels")) return { icon: "🏨", animation: "icon-pulse" };
    if (stepText.includes("news")) return { icon: "📰", animation: "icon-pulse" };
    if (stepText.includes("Generated final itinerary")) return { icon: "✅", animation: "icon-pulse" };
    return { icon: "⚙️", animation: "icon-pulse" };
  };

  return (
    <div className="relative">
      {/* Confetti effect */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti"
          style={{
            left: `${c.left}%`,
            animationDelay: `${c.delay}s`,
            backgroundColor: c.color,
          }}
        />
      ))}

      <div className="space-y-4">
        {steps.map((step, index) => {
          const { icon, animation } = getStepIcon(step);
          const isActive = index === steps.length - 1;
          
          return (
            <div
              key={index}
              className={`flex items-center p-4 rounded-xl backdrop-blur-xl border border-white/20 ${
                isActive ? "bg-white/20 glow-blue" : "bg-white/10"
              }`}
            >
              <div className={`text-2xl mr-4 ${animation}`}>
                {icon}
              </div>
              <div className="flex-1">
                <div className="font-medium">{step}</div>
                {isActive && (
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-neonBlue h-2 rounded-full animate-pulse"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}