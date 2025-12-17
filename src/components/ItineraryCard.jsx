import { useState } from "react";
import AdvancedMap from "./AdvancedMap";

export default function ItineraryCard({ day, date, weather, activities, places, notes, meals, city }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass p-6 rounded-2xl backdrop-blur-xl border border-white/20 mb-4 glow-purple">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="text-xl font-bold text-neonBlue">📅 Day {day}</h3>
          <p className="text-gray-300">{date}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{weather}</p>
          <span className="text-sm text-gray-400">Click to {expanded ? 'collapse' : 'expand'}</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 animate-fadeIn">
          {meals && (
            <div>
              <h4 className="font-semibold text-neonPink mb-2">🍽️ Meals</h4>
              <ul className="space-y-1">
                {meals.breakfast && <li>🍳 Breakfast: {meals.breakfast}</li>}
                {meals.lunch && <li>🥗 Lunch: {meals.lunch}</li>}
                {meals.dinner && <li>🍽️ Dinner: {meals.dinner}</li>}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-neonBlue mb-2">📍 Places to Visit</h4>
            <div className="flex flex-wrap gap-2">
              {places.map((place, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-white/10 rounded-full text-sm glow-on-hover"
                >
                  {place}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-neonPurple mb-2">📋 Activities</h4>
            <ul className="space-y-1">
              {activities.map((activity, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>

          {notes && (
            <div>
              <h4 className="font-semibold text-neonPink mb-2">💡 Notes</h4>
              <p className="text-gray-300">{notes}</p>
            </div>
          )}
          
          {/* Advanced Map */}
          <AdvancedMap city={city} places={places} />
        </div>
      )}
    </div>
  );
}