import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const { source, destination } = req.query;

  try {
    const url = `http://api.aviationstack.com/v1/routes?access_key=${process.env.AVIATIONSTACK_API_KEY}&departure_iata=${source}&arrival_iata=${destination}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Flights fetch failed" });
  }
});

export default router;
