# Recycling Manager Selection Dashboard

A full-stack dashboard that helps hiring teams evaluate, rank, and explore candidates for a Recycling Production Line Manager role. The project combines a React + Vite frontend (Mantine UI), a Node.js backend API, MySQL schema and sample data, and small scripts to generate mock candidates and compute AI-based evaluation scores.

---

Table of contents
- Project overview
- Tech stack
- Folder structure (auto-detected)
- Setup (clone, install, run)
- Environment variables
- Features breakdown
- SQL (schema, how to load, example queries)
- AI prompts (what they do and how to run AI scripts)
- Screenshots 

---

## 1. Project overview

Purpose
- Provide a recruiter / hiring-manager dashboard to shortlist and compare candidates for a Recycling Production Line Manager position.
- Aggregate structured candidate metadata (experience, skills) and AI-evaluated competency scores to produce a ranked leaderboard and visualizations.

Problem it solves
- Automates and standardizes candidate evaluation on domain-relevant competencies.
- Makes it simple to explore top candidates, skill distributions (heatmap), and candidate-level details.
- Provides an auditable SQL-backed ranking that updates when evaluations change.

High-level architecture
- Frontend: React + Vite application (located in /dashboard) using Mantine UI components for UI and visualizations.
- Backend/API: Node.js + Express (in /backend). Provides endpoints for leaderboard and candidate lists (reads from MySQL).
- Database: MySQL schema in /MySQL queries with tables: candidates, evaluations, rankings. Stored procedures + triggers recompute ranks.
- Scripts: Utility scripts in /scripts to seed fake candidates and compute AI evaluation scores (local mock mode + optional Gemini integration).
- AI/Prompts: Prompts stored in /prompts used by the AI scoring script to evaluate candidates on three competencies (crisis management, sustainability, team motivation).

---

## 2. Tech stack

Frontend
- React (Vite)
- Mantine UI (for component library and styling)
- Vite dev server

Backend
- Node.js (Express 5.x)
- mysql2 (promise API)
- dotenv
- cors

Database
- MySQL (SQL files with schema and sample queries included in /MySQL queries)

AI / Prompt tools
- Local scripted scoring that can use Google Gemini via @google/genai (scripts/aiEvaluationScores.js)
- Prompts stored in prompts/prompts.md

Notes on versions
- Many packages (frontend and scripts) target Node >= 18. Some optional AI client versions may require Node >= 20 — see package.json / package-lock.json in each package for engine requirements.

---

## 3. Folder structure 

Top-level :

- backend/
  - package.json
  - package-lock.json
  - server.js
- dashboard/
  - (frontend React + Vite project — not expanded above; run commands below)
- MySQL queries/
  - queries.sql
  - queries2.sql
- prompts/
  - prompts.md
- scripts/
  - aiEvaluationScores.js
  - fakerCandidateGeneration.js
  - package.json
  - package-lock.json
- README.md (this file)

---

## 4. Setup instructions

Prerequisites
- Node.js (recommended >= 18.x; check package.json engine requirements for specific packages)
- npm (>= 9 recommended for lockfile v3, though npm 8 works for many)
- MySQL server (8.x recommended)
- Optional: Google Cloud AI/Gemini API key if you want to run real AI scoring

Step 1 — Clone repository
```bash
git clone https://github.com/srinu0906/VENTU-Internship-assignment.git
cd VENTU-Internship-assignment
```

Step 2 — Database setup
1. Start MySQL server and log in as a user that can create databases/tables.
2. Create the database and load schema:

```bash
# From repo root (adjust user/host/port as needed)
mysql -u root -p < "MySQL queries/queries.sql"
```

The file `MySQL queries/queries.sql` creates:
- database: `candidates_db`
- tables: `candidates`, `evaluations`, `rankings`
- stored procedure `recompute_rankings()` and triggers to recompute ranks after insert/update.

Step 3 — Seed sample data 
- Use the provided faker script to generate 40 realistic candidates:

```bash
# from repo root
cd scripts
# install script dependencies if you haven't
npm install
# ensure DB env vars are set (see .env.example below)
node fakerCandidateGeneration.js
```

Step 4 — Run AI evaluation script 
- The AI script will create/replace evaluation rows for each candidate (scores 1–10).
- By default the script is configured to mock AI responses with random scores. To use a real API (Gemini) set GEMINI_API_KEY in environment and enable the API call in the script.

```bash
# from repo root
cd scripts
# install dependencies (if not already)
npm install
# set DB env vars + GEMINI_API_KEY if using real AI
node aiEvaluationScores.js
```

Step 5 — Backend setup and run
```bash
cd ../backend
npm install
# then run
node server.js
# server will start at http://localhost:5000
```

The backend exposes:
- GET /leaderboard — top 10 ranked candidates (server.js)
- GET /candidates — candidate list with evaluation fields (server.js)

Step 6 — Frontend setup and run
```bash
# from repo root
cd dashboard
npm install
npm run dev
# default Vite dev server (e.g. http://localhost:5173)
```

Notes:
- Frontend consumes backend API at http://localhost:5000 by default (CORS enabled). If the frontend is configured with a different API base, update VITE variables or fetch endpoints accordingly.

---

## 5. Environment variables

Create a `.env` file in both `backend/` (or project root — whichever you prefer) and `scripts/` when running scripts. Example:

```bash
# .env.example
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=candidates_db

# Optional — for AI scripts (Gemini)
GEMINI_API_KEY=your_gemini_api_key_here
```

- DB_HOST — hostname of your MySQL server (127.0.0.1 / localhost)
- DB_USER — MySQL username
- DB_PASSWORD — MySQL user password
- DB_NAME — database name (default created by queries.sql: candidates_db)
- GEMINI_API_KEY — (optional) to use Google Gemini via @google/genai in scripts/aiEvaluationScores.js

Important: Do not commit `.env` with secrets to version control. Use secure secrets management for production.

---

## 6. Features breakdown

Authentication (dummy login)
- The assignment mentions login/logout. The repository includes a frontend dashboard which can implement a dummy authentication flow (local/dummy credentials). If not present, you can add a simple client-side login that stores a session key in localStorage.

Leaderboard
- Endpoint: GET /leaderboard (backend/server.js)
- Shows top 10 candidates by ranking (rankings table).
- Leaderboard rows include candidate name and competency scores (crisis_management, sustainability, team_motivation), total score and rank.

Skill heatmap
- Frontend visualization that aggregates skill frequency from the `skills` field in `candidates` and displays a heatmap by competency or skill tag. (Frontend component expected in /dashboard)

Candidate cards
- Candidate list/cards show candidate metadata (name, experience, skills, email) and AI-evaluated competency scores. Cards can link to detailed candidate view.

Pagination
- Candidate API returns the full list by default; frontend implements pagination client-side or server-side depending on preference.

Sorting
- Frontend provides sorting (by rank, total score, experience, name). Backend query examples show ORDER BY ranking.

Search
- Frontend search filters by candidate name, email or skill tags.

Email sharing
- Feature to share candidate profile or leaderboard via email. Implementation options:
  - Frontend constructs mailto: links for quick sharing.
  - Backend can integrate with an email service (SendGrid, nodemailer) for richer sharing.

Note: Where the frontend lacks an implementation for a listed feature, the README describes how to implement or extend it.

---

## 7. SQL section

Schema overview (from MySQL queries/queries.sql)
- candidates
  - id INT AUTO_INCREMENT PRIMARY KEY
  - email VARCHAR(50) UNIQUE NOT NULL
  - name VARCHAR(100)
  - experience INT
  - skills TEXT
  - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

- evaluations
  - candidate_id INT PRIMARY KEY (foreign key to candidates.id)
  - crisis_management INT
  - sustainability INT
  - team_motivation INT

- rankings
  - candidate_id INT PRIMARY KEY (foreign key to candidates.id)
  - total_score INT
  - ranking INT

Rank maintenance
- Stored procedure `recompute_rankings()` deletes and reinserts rows into `rankings` using DENSE_RANK() window function over total_score desc.
- Triggers `trg_eval_after_insert` and `trg_eval_after_update` call `recompute_rankings()` to keep rankings up-to-date.

How to load schema and sample data
1. Run schema creation:
```bash
mysql -u root -p < "MySQL queries/queries.sql"
```

2. Inspect tables / sample rows:
```sql
USE candidates_db;
SELECT * FROM candidates;
SELECT * FROM evaluations;
SELECT * FROM rankings;
```

Example queries
- Top 10 leaderboard (matching backend endpoint):
```sql
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
LIMIT 10;
```

- Candidate list with evaluations:
```sql
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
JOIN evaluations e ON c.id = e.candidate_id
LEFT JOIN rankings r ON c.id = r.candidate_id
ORDER BY r.ranking;
```

- Combined view (from queries2.sql)
```sql
SELECT r.ranking as 'rank', c.name, c.email,
       (e.crisis_management + e.sustainability + e.team_motivation) as total_score
FROM rankings r
JOIN candidates c ON r.candidate_id = c.id
JOIN evaluations e ON c.id = e.candidate_id
ORDER BY r.ranking;
```

---

## 8. AI prompts section

Prompt design
- Prompts are human-readable instructions to an LLM that return a numeric score between 1 and 10 for each competency.
- Stored under: prompts/prompts.md
- Competencies evaluated:
  1. Crisis Management
  2. Sustainability Knowledge
  3. Team Motivation & Leadership

How they are used
- scripts/aiEvaluationScores.js constructs three prompt texts per candidate (using experience and skills) and calls an `askAI()` function.
- The script includes a mocked `askAI()` that returns a random integer 1–10 (safe default for testing without API calls).
- There is a prepared (commented) function `askGemini()` that uses @google/genai to call Google Gemini models when you supply GEMINI_API_KEY and enable the call.

How the AI results are saved
- For each candidate the script computes three scores, sums them to total, then inserts/updates the `evaluations` table with candidate_id and the three scores.
- Triggers/procedure recompute `rankings`.

Usage notes
- Gemini API has rate-limits — the script mentions RPM limits; for evaluation at scale consider batching and rate limiting.
- Always parse and validate LLM output: the script handles non-numeric outputs by falling back to a random safe score.

---

## 9. Screenshots

Add screenshot images to the repo (suggested path `dashboard/public/screenshots/` or `/screenshots`) and embed them here. Example placeholders:

- /screenshots/login.png
- <img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/e3d70599-cc35-484c-ae80-b9dcac6f9a9f" />

- /screenshots/leaderboard.png
- <img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/21b49b81-3367-43ad-ae69-22f870c4b471" />

- /screenshots/candidate-card.png
- <img width="1918" height="1079" alt="image" src="https://github.com/user-attachments/assets/35a9ea60-3504-4092-bf32-31047b09292d" />

- /screenshots/heatmap.png
- <img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/42443ac4-9346-4365-935e-b6e11de8bb01" />


---
