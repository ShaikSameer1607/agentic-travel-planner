# Agentic Travel Planner

An AI-powered travel planning application that uses Google's Gemini API with function calling to autonomously plan trips by gathering real-world data from multiple sources.

## Features

- **AI-Powered Planning**: Uses Gemini 1.5 Flash with function calling for autonomous trip planning
- **Multi-API Integration**: Integrates with OpenWeatherMap, OpenTripMap, SerpAPI, and more
- **Real-Time Data**: Fetches live weather, attractions, hotels, and news
- **Futuristic UI**: Dark mode with glassmorphism effects and neon accents
- **Image Analysis**: Upload images for aesthetic/mood-based trip inspiration
- **Structured Output**: Generates detailed JSON itineraries with execution steps

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: Google Gemini API with function calling
- **Authentication**: Email + OTP (EmailJS)
- **APIs**: OpenWeatherMap, OpenTripMap, SerpAPI, AviationStack, GNews

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```
3. Create `.env` files with your API keys (see `.env.example`)
4. Start the backend:
   ```bash
   cd backend && npm start
   ```
5. Start the frontend:
   ```bash
   npm start
   ```

## Security

API keys are stored in `.env` files which are excluded from Git. See `.env.example` for the required keys.

## How It Works

1. User submits a travel request
2. Gemini AI analyzes the request and autonomously decides which tools to call
3. Backend executes API calls in parallel
4. Results are sent back to Gemini for processing
5. Final itinerary is generated in structured JSON format

## Screenshots

![Dashboard](screenshots/dashboard.png)
![Itinerary](screenshots/itinerary.png)

## License

MIT