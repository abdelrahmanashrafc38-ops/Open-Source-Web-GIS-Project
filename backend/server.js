const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL config
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// GET all ITI branches as GeoJSON
app.get("/iti_branches", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        "Branch",
        "Longitude",
        "Latitude",
        "tracks"
      FROM iti_branches
    `);

    res.json({
      type: "FeatureCollection",
      features: result.rows.map((row, index) => ({
        type: "Feature",
        id: `iti_branches.${index + 1}`,
        geometry: {
          type: "Point",
          coordinates: [row.Longitude, row.Latitude],
        },
        properties: {
          Branch: row.Branch,
          Longitude: row.Longitude,
          Latitude: row.Latitude,
          tracks: row.tracks,
        },
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/iti_branches", async (req, res) => {
  try {
    const { Branch, Longitude, Latitude, tracks } = req.body;

    const lng = parseFloat(Longitude);
    const lat = parseFloat(Latitude);

    if (!lng || !lat) {
      return res.status(400).send("Invalid coordinates");
    }

    await pool.query(
      `INSERT INTO iti_branches ("Branch", "Longitude", "Latitude", "tracks", geom)
       VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($2, $3), 4326))`,
      [Branch, lng, lat, tracks],
    );

    res.send("Inserted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Insert error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
