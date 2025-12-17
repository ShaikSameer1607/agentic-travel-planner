import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import weatherRoutes from "./routes/weather.js";
import placesRoutes from "./routes/places.js";
import flightsRoutes from "./routes/flights.js";
import hotelsRoutes from "./routes/hotels.js";
import newsRoutes from "./routes/news.js";
import agentRoutes from "./routes/agent.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/weather", weatherRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/flights", flightsRoutes);
app.use("/api/hotels", hotelsRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
  console.log("📡 Available endpoints:");
  console.log("  - GET  /api/weather?city=<city>");
  console.log("  - GET  /api/places?city=<city>");
  console.log("  - GET  /api/flights?source=<src>&destination=<dest>");
  console.log("  - GET  /api/hotels?city=<city>&budget=<budget>");
  console.log("  - GET  /api/news?city=<city>");
  console.log("  - POST /api/agent/plan");
  console.log("\n⚠️  Mock mode:", !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 20 ? "ENABLED" : "DISABLED");
  console.log("\n🟢 Server is ready and waiting for requests...\n");
});

// Prevent the server from timing out
server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
