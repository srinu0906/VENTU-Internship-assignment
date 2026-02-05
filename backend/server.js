import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;


const app = express();
app.use(cors());

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

// Top 10 leaderboard
app.get("/leaderboard", async (req, res) => {
  const [rows] = await pool.query(`
    SELECT c.id, c.name,
           e.crisis_management,
           e.sustainability,
           e.team_motivation,
            r.ranking,
            r.total_score
    FROM rankings r
    JOIN candidates c ON r.candidate_id = c.id
    JOIN evaluations e ON e.candidate_id = c.id
    ORDER BY r.ranking ASC
    LIMIT 10
  `);
  res.json(rows);
});

// All candidates (for heatmap + cards)
app.get("/candidates", async (req, res) => {
  const [rows] = await pool.query(`
    SELECT
    c.id,
    c.email,
    c.name,
    c.experience,
    c.skills,
    e.crisis_management,
    e.sustainability,
    e.team_motivation,
    r.total_score,
    r.ranking
FROM candidates c
JOIN evaluations e
    ON c.id = e.candidate_id
LEFT JOIN rankings r
    ON c.id = r.candidate_id
ORDER BY r.ranking;
  `);
  res.json(rows);
});

app.listen(5000, () => console.log("API running on port 5000"));
