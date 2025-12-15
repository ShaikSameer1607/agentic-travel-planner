import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const { city, budget } = req.query;

  res.json({
    city,
    budget,
    hotels: [
      "City Central Hotel",
      "Comfort Stay Inn",
      "Premium Suites"
    ],
  });
});

export default router;
