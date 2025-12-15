import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const { city } = req.query;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;

    console.log("Calling Weather API:", url);

    const response = await axios.get(url);

    res.json(response.data);
  } catch (err) {
    console.error("Weather API ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "Weather fetch failed",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
