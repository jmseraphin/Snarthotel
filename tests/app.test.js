const request = require("supertest");
const app = require("../index");

describe("POST /api/book-room", () => {
  test("cas complet", async () => {
    const res = await request(app).post("/api/book-room").send({
      pricePerNight: 100,
      nights: 2,
      season: "Haute",
      hasWeekend: true,
      seaView: true,
      clientType: "Normal",
      persons: 2,
    });
    expect(res.statusCode).toBe(200);
  });

  test("basse saison sans extras", async () => {
    const res = await request(app).post("/api/book-room").send({
      pricePerNight: 100,
      nights: 1,
      season: "Basse",
      hasWeekend: false,
      seaView: false,
      clientType: "VIP",
      persons: 1,
    });
    expect(res.body.total).toBe(100);
  });

  test("haute saison applique un multiplicateur de 1.5", async () => {
    const res = await request(app).post("/api/book-room").send({
      pricePerNight: 100,
      nights: 1,
      season: "Haute",
      hasWeekend: false,
      seaView: false,
      clientType: "VIP",
      persons: 1,
    });
    expect(res.body.total).toBe(150);
  });

  test("weekend applique un multiplicateur de 1.2", async () => {
    const res = await request(app).post("/api/book-room").send({
      pricePerNight: 100,
      nights: 1,
      season: "Basse",
      hasWeekend: true,
      seaView: false,
      clientType: "VIP",
      persons: 1,
    });
    expect(res.body.total).toBe(120);
  });

  test("séjour long (>7 nuits) applique une réduction de 15%", async () => {
    const res = await request(app).post("/api/book-room").send({
      pricePerNight: 100,
      nights: 10,
      season: "Basse",
      hasWeekend: false,
      seaView: false,
      clientType: "VIP",
      persons: 1,
    });
    expect(res.body.total).toBe(850);
  });

  test("vue mer ajoute 30 par nuit", async () => {
    const res = await request(app).post("/api/book-room").send({
      pricePerNight: 100,
      nights: 2,
      season: "Basse",
      hasWeekend: false,
      seaView: true,
      clientType: "VIP",
      persons: 1,
    });
    expect(res.body.total).toBe(260);
  });

  test("client non-VIP paie le petit-déjeuner (15 par personne par nuit)", async () => {
    const res = await request(app).post("/api/book-room").send({
      pricePerNight: 100,
      nights: 2,
      season: "Basse",
      hasWeekend: false,
      seaView: false,
      clientType: "Normal",
      persons: 2,
    });
    expect(res.body.total).toBe(260);
  });

  test("client VIP ne paie pas le petit-déjeuner", async () => {
    const res = await request(app).post("/api/book-room").send({
      pricePerNight: 100,
      nights: 2,
      season: "Basse",
      hasWeekend: false,
      seaView: false,
      clientType: "VIP",
      persons: 2,
    });
    expect(res.body.total).toBe(200);
  });

  test("combinaison de plusieurs modificateurs", async () => {
    const res = await request(app).post("/api/book-room").send({
      pricePerNight: 100,
      nights: 5,
      season: "Haute",
      hasWeekend: true,
      seaView: true,
      clientType: "Normal",
      persons: 2,
    });
    expect(res.body.total).toBeGreaterThan(0);
  });

  test("entrée invalide retourne 400", async () => {
    const res = await request(app).post("/api/book-room").send({});
    expect(res.statusCode).toBe(400);
  });
});