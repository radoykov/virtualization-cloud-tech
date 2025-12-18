import express, { json } from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
app.use(cors());
app.use(json());

const pool = new Pool({
  host: process.env.DB_HOST,   
  user: process.env.DB_USER,       
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  port: 5432,
});

app.get("/", async (req, res) => {
  try {
    res.json({message: 'Hello from api'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error" });
  }
});

app.get("/recipes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recipes");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/recipes", async (req, res) => {
  const { title, ingredients, instructions } = req.body;

  try {
    await pool.query(
      "INSERT INTO recipes (title, ingredients, instructions) VALUES ($1, $2, $3)",
      [title, ingredients, instructions]
    );

    res.status(201).json({ message: "Recipe saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});