import { faker } from "@faker-js/faker";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

const skillsPool = [
  "Leadership",
  "Waste Management",
  "Safety Compliance",
  "Process Optimization",
  "Sustainability Practices",
  "Team Coordination",
  "Lean Manufacturing",
  "Quality Control",
  "Equipment Handling"
];

async function seed() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  });

  console.log("Connected to MySQL");

  const values = [];

  for (let i = 0; i < 40; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const name = `${firstName} ${lastName}`;

    // build realistic email from name
    const email = faker.internet.email({
      firstName,
      lastName,
      provider: "fakemail.com"
    }).toLowerCase();

    const experience = faker.number.int({ min: 1, max: 15 });

    const skills = faker.helpers
      .arrayElements(skillsPool, faker.number.int({ min: 2, max: 4 }))
      .join(", ");

    values.push([email, name, experience, skills]);
  }


  const query = `
    INSERT INTO candidates (email, name, experience, skills)
    VALUES ?
  `;

  await connection.query(query, [values]);

  console.log("40 candidates inserted successfully");

  await connection.end();
}

seed().catch(console.error);
