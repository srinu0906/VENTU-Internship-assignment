import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const {
  GEMINI_API_KEY,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function askAI(prompt) {

  // Mocked AI response for testing without API calls
  // in case of using real API, comment the line below
  return Math.ceil(Math.random() * 10);

  /*Real API call
  Gemini API call has RPM (requests per minute) 0f 8 for free tier*/
  // uncomment below line to use real API
  // return askGemini(prompt);

}

async function askGemini(prompt) {
    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  console.log(response.text);

  if(typeof parseInt(response.text) !== "number" || isNaN(parseInt(response.text))) {
    return Math.ceil(Math.random() * 10); // safe fallback
  }

  return parseInt(response.text);
}

const crisisPrompt = (exp, skills) => `
Rate crisis management ability of this candidate on the scale from 1 to 10 for a recycling production line manager.

Experience: ${exp} years
Skills: ${skills}

Return only a number.
`;

const sustainabilityPrompt = (exp, skills) => `
Evaluate sustainability knowledge of this candidate on the scale from 1 to 10 for a recycling production line manager.

Experience: ${exp} years
Skills: ${skills}

Return only a number.
`;

const teamPrompt = (exp, skills) => `
Score team motivation and leadership of this candidate on the scale from 1 to 10 for a recycling production line manager.

Experience: ${exp} years
Skills: ${skills}

Return only a number.
`;

async function runAI() {
  const db = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  });

  const [candidates] = await db.query(
    "SELECT id, experience, skills FROM candidates"
  );

  for (const c of candidates) {
    console.log(`Evaluating candidate ${c.id}`);

    const crisis = await askAI(
      crisisPrompt(c.experience, c.skills)
    );

    const sustainability = await askAI(
      sustainabilityPrompt(c.experience, c.skills)
    );

    const team = await askAI(
      teamPrompt(c.experience, c.skills)
    );

    const total = crisis + sustainability + team;

    await db.query(
      `
      INSERT INTO evaluations
      (candidate_id, crisis_management, sustainability, team_motivation)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        crisis_management = VALUES(crisis_management),
        sustainability = VALUES(sustainability),
        team_motivation = VALUES(team_motivation)
      `,
      [c.id, crisis, sustainability, team]
    );
  }

  console.log("AI scoring complete");

  await db.end();
}

runAI().catch(console.error);
