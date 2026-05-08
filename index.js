const express = require("express");

const app = express();

app.use(express.json());

function calculateTotal(data) {
  let total = data.pricePerNight * data.nights;

  if (data.season === "Haute") {
    total *= 1.5;
  }

  if (data.hasWeekend) {
    total *= 1.2
  }

  if (data.nights > 7) {
    total *= 0.85;
  }

  if (data.seaView) {
    total += 30 * data.nights;
  }

  if (data.clientType !== "VIP") {
    total += 15 * data.persons * data.nights;
  }

  return total;
}

/**
 * POST /api/book-room
 * Accepts booking data and returns the calculated total price.
 */
app.post("/api/book-room", (req, res) => {
  const data = req.body;

  if (!data.pricePerNight || !data.nights) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const total = calculateTotal(data);

  return res.json({ total });
});

/* istanbul ignore next */
if (require.main === module) {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

module.exports = app;