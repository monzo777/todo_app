const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

function openDb() {
  return new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "todo",
    port: Number(process.env.DB_PORT || 5432),
  });
}

app.get("/", async (_request, response) => {
  const pool = openDb();

  try {
    const result = await pool.query("SELECT * FROM task ORDER BY id");
    response.status(200).json(result.rows);
  } catch (error) {
    response.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
});

app.post("/new", async (request, response) => {
  const { description } = request.body;

  if (!description || description.trim() === "") {
    return response.status(400).json({ error: "Description is required" });
  }

  const pool = openDb();

  try {
    const result = await pool.query(
      "INSERT INTO task (description) VALUES ($1) RETURNING *",
      [description.trim()]
    );

    return response.status(200).json(result.rows[0]);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
});

app.delete("/delete/:id", async (request, response) => {
  const pool = openDb();
  const { id } = request.params;

  try {
    await pool.query("DELETE FROM task WHERE id = $1", [id]);
    response.status(200).json({ id: Number(id) });
  } catch (error) {
    response.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
