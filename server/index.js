require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { query } = require("./helpers/db");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", async (_request, response) => {
  try {
    const result = await query("SELECT * FROM task ORDER BY id");
    response.status(200).json(result.rows || []);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

app.post("/new", async (request, response) => {
  const { description } = request.body;

  if (!description || description.trim() === "") {
    return response.status(400).json({ error: "Description is required" });
  }

  try {
    const result = await query(
      "INSERT INTO task (description) VALUES ($1) RETURNING *",
      [description.trim()]
    );

    return response.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }
});

app.delete("/delete/:id", async (request, response) => {
  const { id } = request.params;

  try {
    await query("DELETE FROM task WHERE id = $1", [id]);
    response.status(200).json({ id: Number(id) });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
