import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const { city } = req.query;

  try {
    const geo = await axios.get(
      `https://api.opentripmap.com/0.1/en/places/geoname?name=${city}&apikey=${process.env.OPENTRIPMAP_API_KEY}`
    );

    const { lat, lon } = geo.data;

    const places = await axios.get(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lat=${lat}&lon=${lon}&limit=5&apikey=${process.env.OPENTRIPMAP_API_KEY}`
    );

    res.json(places.data.features);
  } catch (err) {
    res.status(500).json({ error: "Places fetch failed" });
  }
});

export default router;
