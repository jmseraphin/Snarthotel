const express = require("express");

const app = express();

app.use(express.json());

/**
 * Calculates the total price for a room booking.
 * Applies multipliers and surcharges based on booking conditions.
 *
 * @param {Object} data - Booking details
 * @param {number} data.pricePerNight - Base price per night
 * @param {number} data.nights - Number of nights
 * @param {string} data.season - "Haute" or "Basse"
 * @param {boolean} data.hasWeekend - Whether the stay includes a weekend
 * @param {boolean} data.seaView - Whether the room has a sea view
 * @param {string} data.clientType - "VIP" or "Normal"
 * @param {number} data.persons - Number of persons
 * @returns {number} Total price
 */
function calculateTotal(data) {
  let total = data.pricePerNight * data.nights;

  if (data.season === "Haute") {
    total *= 1.5;
  }

  if (data.hasWeekend) {
    total *= 1.2;
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