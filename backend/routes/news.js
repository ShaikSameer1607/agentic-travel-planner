import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const { city } = req.query;

  try {
    const url = `https://gnews.io/api/v4/search?q=${city}&token=${process.env.GNEWS_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data.articles.slice(0, 3));
  } catch (err) {
    res.status(500).json({ error: "News fetch failed" });
  }
});

export default router;
