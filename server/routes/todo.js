const express = require("express");
const { query } = require("../helpers/db");

const todoRouter = express.Router();

todoRouter.get("/", async (_request, response) => {
  try {
    const result = await query("SELECT * FROM task ORDER BY id");
    response.status(200).json(result.rows || []);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

todoRouter.post("/new", async (request, response) => {
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

todoRouter.delete("/delete/:id", async (request, response) => {
  const { id } = request.params;

  try {
    await query("DELETE FROM task WHERE id = $1", [id]);
    response.status(200).json({ id: Number(id) });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error.message });
  }
});

module.exports = todoRouter;
