require("dotenv").config();

const express = require("express");
const cors = require("cors");
const todoRouter = require("./routes/todo");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/", todoRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
